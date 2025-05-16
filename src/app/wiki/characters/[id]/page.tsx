'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import React from 'react';

interface Character {
  id: string;
  name: string;
  lastName?: string;
  title?: string;
  race?: string;
  class?: string;
  faction?: string;
  alignment?: string;
  background?: string;
  description?: string;
  mainImage?: string;
  headerBackground?: string;
  images: string;
  videos: string;
  author: {
    name: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Fonction pour convertir un alignement en texte anglais (système de karma simplifié)
const getAlignmentText = (alignment: string) => {
  const alignments: Record<string, string> = {
    'GOOD': 'Good',
    'NEUTRAL': 'Neutral',
    'EVIL': 'Evil'
  };
  return alignments[alignment] || alignment;
};

// Fonction pour formater une date
const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

// Fonction pour formater le texte avec des sauts de ligne HTML
const formatTextWithLineBreaks = (text: string) => {
  // Si le texte est déjà au format HTML, on le retourne tel quel
  if (text.includes('<p>') || text.includes('<br') || text.includes('<div')) {
    return text;
  }
  
  // Sinon, on remplace les \n par des <br />
  return text.replace(/\n/g, '<br />');
};

export default function CharacterPage({ params }: { params: { id: string } }) {
  // Utiliser React.use() pour déballer les params
  const resolvedParams = React.use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'gallery'
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Fonction pour générer un arrière-plan aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };
  
  const backgroundClass = getBgClass();

  // Fonction pour supprimer un personnage
  const deleteCharacter = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce personnage?')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/wiki/characters/${resolvedParams.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        router.push('/wiki/characters');
      } else {
        alert('Erreur lors de la suppression du personnage');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression du personnage');
    }
  };

  useEffect(() => {
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`/api/wiki/characters/${resolvedParams.id}`);
        if (!response.ok) {
          throw new Error('Character not found');
        }
        const data = await response.json();
        
        // Formater le texte du background pour les retours à la ligne
        if (data.background) {
          data.background = formatTextWithLineBreaks(data.background);
        }
        
        // Formater la description si elle existe
        if (data.description) {
          data.description = formatTextWithLineBreaks(data.description);
        }
        
        setCharacter(data);
        
        // Parse les images et vidéos JSON
        try {
          setAdditionalImages(JSON.parse(data.images || '[]'));
          setVideoUrls(JSON.parse(data.videos || '[]'));
        } catch (e) {
          console.error('Erreur lors du parsing des images ou vidéos', e);
        }
      } catch (error) {
        setError('Erreur lors du chargement du personnage');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [resolvedParams.id]);

  // Appliquer les styles CSS personnalisés pour supprimer les teintes bleues
  useEffect(() => {
    // Ajouter des styles CSS pour remplacer les teintes bleues par du blanc
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      .prose-invert a {
        color: #ffffff !important;
      }
      .prose-invert h1, .prose-invert h2, .prose-invert h3, .prose-invert h4, .prose-invert h5, .prose-invert h6 {
        color: #ffffff !important;
      }
      .prose-invert code, .prose-invert strong, .prose-invert em {
        color: #ffffff !important;
      }
    `;
    document.head.appendChild(styleElement);
    
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  // Détermine si une URL est une vidéo hébergée ou une URL externe
  const isHostedVideo = (url: string) => {
    return url.startsWith('/videos/');
  };

  // Gestion de la modal d'image
  const openImageModal = (imageSrc: string) => {
    setSelectedImage(imageSrc);
  };

  const closeImageModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-300 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-gray-900 rounded-none w-1/3 mb-8"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/3 h-80 bg-gray-900 rounded-none mb-8 vignette-effect"></div>
              <div className="w-full md:w-2/3 space-y-4">
                <div className="h-6 bg-gray-900 rounded-none w-1/2"></div>
                <div className="h-4 bg-gray-900 rounded-none w-full"></div>
                <div className="h-4 bg-gray-900 rounded-none w-full"></div>
                <div className="h-4 bg-gray-900 rounded-none w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-black text-gray-300 p-4 md:p-8">
        <div className="max-w-6xl mx-auto text-center py-16">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-title text-white mb-2 flame-effect">Personnage non trouvé</h2>
          <p className="text-gray-400 mb-6">{error || 'Ce personnage n\'existe pas ou a été supprimé.'}</p>
          <Link
            href="/wiki/characters"
            className="btn-medieval px-5 py-2.5 animated-border-glow inline-block"
          >
            Retour à la liste des personnages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black/90 text-gray-300 relative">
      {/* Page background with headerBackground image */}
      {character.headerBackground && (
        <div className="fixed inset-0 z-0">
          <Image
            src={character.headerBackground}
            alt={`${character.name} background`}
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
        </div>
      )}

      {/* Header with character info */}
      <div className="relative py-16 border-b border-gray-100/50 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center">
          {character.headerBackground ? (
            <Image
              src={character.headerBackground}
              alt={`${character.name} background`}
              fill
              className="object-cover opacity-60"
              priority
            />
          ) : (
            <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center opacity-40`}></div>
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
          <div className="absolute inset-0 vignette-effect-intense pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-[0.05] mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center mb-8">
            <Link href="/wiki/characters" className="flex items-center text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-title">Retour aux personnages</span>
            </Link>
          </div>
          
          <div className="fade-in py-4">
            <h1 className="text-4xl md:text-5xl font-title font-bold mb-2 text-white flame-effect-intense drop-shadow-lg">{character.name} {character.lastName}</h1>
            {character.title && <p className="text-xl font-body text-gray-300 italic mb-6 drop-shadow-md">{character.title}</p>}
            
            <div className="flex justify-between items-center mb-8">
              <div></div>
              
              {session?.user && (session.user as any).role === 'ADMIN' && (
                <div className="flex space-x-2">
                  <Link 
                    href={`/wiki/characters/${character.id}/edit`}
                    className="btn-medieval bg-black/70 border border-gray-700 hover:border-gray-500 px-3 py-1.5 text-sm flex items-center"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Modifier
                  </Link>
                  <button 
                    onClick={deleteCharacter}
                    className="btn-medieval bg-black/70 border border-gray-700 hover:border-red-900/50 px-3 py-1.5 text-sm flex items-center hover:text-red-400 transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Supprimer
                  </button>
                </div>
              )}
            </div>
            
            {/* Navigation tabs */}
            <div className="flex border-b border-gray-100/50 mb-8">
              <button 
                onClick={() => setActiveTab('info')}
                className={`py-3 px-5 font-title text-lg transition-colors drop-shadow-md ${activeTab === 'info' ? 'text-white border-b-2 border-white -mb-px' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Informations
              </button>
              <button 
                onClick={() => setActiveTab('gallery')}
                className={`py-3 px-5 font-title text-lg transition-colors drop-shadow-md ${activeTab === 'gallery' ? 'text-white border-b-2 border-white -mb-px' : 'text-gray-400 hover:text-gray-200'}`}
              >
                Galerie
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
        {/* Onglet Informations */}
        {activeTab === 'info' && (
          <div className="flex flex-col md:flex-row gap-8 animate-fadeIn fade-in">
            {/* Image et statistiques */}
            <div className="w-full md:w-1/3 space-y-6">
              {character.mainImage ? (
                <div className="aspect-[3/4] relative rounded-sm overflow-hidden">
                  {/* Cadre décoratif amélioré */}
                  <div className="absolute inset-0 border border-gray-100/70 z-10"></div>
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-gray-200 z-10"></div>
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-gray-200 z-10"></div>
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-gray-200 z-10"></div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-gray-200 z-10"></div>
                  
                  {/* Texture et effets de superposition */}
                  <div className="absolute inset-0 vignette-effect pointer-events-none z-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 opacity-60 mix-blend-overlay z-10"></div>
                  <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-[0.03] mix-blend-overlay z-10"></div>
                  <div className="vertical-scan"></div>
                  
                  <Image
                    src={character.mainImage}
                    alt={character.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[3/4] relative rounded-sm overflow-hidden">
                  {/* Cadre décoratif amélioré */}
                  <div className="absolute inset-0 border border-gray-100/70 z-10"></div>
                  <div className="absolute top-0 left-0 w-5 h-5 border-t-2 border-l-2 border-gray-200 z-10"></div>
                  <div className="absolute top-0 right-0 w-5 h-5 border-t-2 border-r-2 border-gray-200 z-10"></div>
                  <div className="absolute bottom-0 left-0 w-5 h-5 border-b-2 border-l-2 border-gray-200 z-10"></div>
                  <div className="absolute bottom-0 right-0 w-5 h-5 border-b-2 border-r-2 border-gray-200 z-10"></div>
                  
                  {/* Texture et effets de superposition */}
                  <div className="absolute inset-0 vignette-effect pointer-events-none z-20"></div>
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 opacity-60 mix-blend-overlay z-10"></div>
                  <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-[0.03] mix-blend-overlay z-10"></div>
                  <div className="vertical-scan"></div>
                  
                  <Image
                    src="/images/default-character.png"
                    alt={character.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 400px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Statistiques du personnage */}
              <div className="bg-black/80 p-6 border border-gray-300/40 space-y-4 relative">
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-200 animated-border-glow"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-200 animated-border-glow"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-200 animated-border-glow"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-200 animated-border-glow"></div>
                
                <div className="bg-black/90 border-b border-white shadow-md -mx-6 -mt-6 mb-6">
                  <h2 className="text-xl font-title text-[#ffffff] pl-6 py-2">Caractéristiques</h2>
                </div>
                
                <div className="bg-black/80 p-4 text-gray-300 border border-gray-300/30">
                  {character.race && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 font-title text-sm">Race</span>
                      <span className="font-body text-gray-300">{character.race}</span>
                    </div>
                  )}
                  
                  {character.class && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 font-title text-sm">Classe</span>
                      <span className="font-body text-gray-300">{character.class}</span>
                    </div>
                  )}
                  
                  {character.faction && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 font-title text-sm">Faction</span>
                      <span className="font-body text-gray-300">{character.faction}</span>
                    </div>
                  )}
                  
                  {character.alignment && (
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-500 font-title text-sm">Alignement</span>
                      <span className="font-body text-gray-300">{getAlignmentText(character.alignment)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Description and Story */}
            <div className="w-full md:w-2/3 space-y-6">
              <div className="bg-black/80 p-6 md:p-8 border border-gray-300/40 relative">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gray-200 animated-border-glow"></div>
                <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gray-200 animated-border-glow"></div>
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gray-200 animated-border-glow"></div>
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gray-200 animated-border-glow"></div>
                
                <div className="bg-black/90 border-b border-white shadow-md -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6">
                  <h2 className="text-2xl font-title text-[#ffffff] pl-6 md:pl-8 py-2 flame-effect">Description</h2>
                </div>
                
                {character.description ? (
                  <div className="prose prose-invert prose-md max-w-none font-body bg-black/80 p-4 border border-gray-300/30 relative">
                    <div className="absolute inset-0 bg-[url('/images/parchment-texture.jpg')] bg-cover opacity-5 mix-blend-overlay"></div>
                    <div className="relative z-10">
                      <div dangerouslySetInnerHTML={{ __html: character.description }} />
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic bg-black/80 p-4 border border-gray-300/30">Aucune description disponible.</p>
                )}
              </div>
              
              {character.background && (
                <div className="bg-black/80 p-6 md:p-8 border border-gray-300/40 relative">
                  <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gray-200 animated-border-glow"></div>
                  <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gray-200 animated-border-glow"></div>
                  <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gray-200 animated-border-glow"></div>
                  <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gray-200 animated-border-glow"></div>
                  
                  <div className="bg-black/90 border-b border-white shadow-md -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6">
                    <h2 className="text-2xl font-title text-[#ffffff] pl-6 md:pl-8 py-2 flame-effect">Histoire</h2>
                  </div>
                  <div className="prose prose-invert prose-md max-w-none font-body bg-black/80 p-4 border border-gray-300/30 relative">
                    <div className="absolute inset-0 bg-[url('/images/parchment-texture.jpg')] bg-cover opacity-5 mix-blend-overlay"></div>
                    <div className="relative z-10">
                      <div dangerouslySetInnerHTML={{ __html: character.background }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Onglet Galerie */}
        {activeTab === 'gallery' && (
          <div className="animate-fadeIn fade-in">
            <div className="bg-black/80 p-6 md:p-8 border border-gray-300/40 relative">
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gray-200 animated-border-glow"></div>
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gray-200 animated-border-glow"></div>
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gray-200 animated-border-glow"></div>
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gray-200 animated-border-glow"></div>
              
              <div className="bg-black/90 border-b border-white shadow-md -mx-6 md:-mx-8 -mt-6 md:-mt-8 mb-6">
                <h2 className="text-2xl font-title text-[#ffffff] pl-6 md:pl-8 py-2 flame-effect">Galerie</h2>
              </div>

              {additionalImages.length > 0 && (
                <div className="mb-10 bg-black/80 p-4 border border-gray-300/30">
                  <h3 className="text-xl font-title text-white mb-4">Images</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {additionalImages.map((image, index) => (
                      <div 
                        key={index} 
                        className="aspect-square relative overflow-hidden border border-gray-300/40 cursor-pointer hover:opacity-90 transition-opacity"
                        onClick={() => openImageModal(image)}
                      >
                        {/* Ajout du cadre décoratif sur les images de la galerie */}
                        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-200 z-10"></div>
                        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-200 z-10"></div>
                        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-200 z-10"></div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-200 z-10"></div>
                        <div className="absolute inset-0 vignette-effect pointer-events-none z-10"></div>
                        <Image 
                          src={image} 
                          alt={`${character.name} - Image ${index + 1}`} 
                          fill 
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {videoUrls.length > 0 && (
                <div className="bg-black/80 p-4 border border-gray-300/30">
                  <h3 className="text-xl font-title text-white mb-4">Vidéos</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {videoUrls.map((video, index) => (
                      <div key={index} className="overflow-hidden border border-gray-300/40">
                        {isHostedVideo(video) ? (
                          <video 
                            src={video} 
                            controls 
                            className="w-full aspect-video" 
                          />
                        ) : (
                          <iframe
                            src={video}
                            allowFullScreen
                            className="w-full aspect-video"
                            title={`${character.name} - Vidéo ${index + 1}`}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {additionalImages.length === 0 && videoUrls.length === 0 && (
                <p className="text-gray-500 italic bg-black/80 p-4 border border-gray-300/30">Aucun média disponible.</p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal pour agrandir les images */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeImageModal}
        >
          <div className="max-w-4xl max-h-full relative">
            <button 
              className="absolute top-4 right-4 text-white bg-black/70 p-2 hover:bg-gray-800/70 transition-colors z-10 border border-gray-300/40"
              onClick={closeImageModal}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="p-1 border-2 border-gray-300/70 relative">
              {/* Cadre décoratif sur l'image agrandie */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-white z-10"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-white z-10"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-white z-10"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-white z-10"></div>
              <div className="absolute inset-0 vignette-effect pointer-events-none z-10"></div>
              <Image 
                src={selectedImage} 
                alt="Image agrandie" 
                width={1200} 
                height={800} 
                className="max-h-[80vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 