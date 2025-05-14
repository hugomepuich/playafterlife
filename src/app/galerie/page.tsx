"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface MediaItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string;
  thumbnail: string | null;
  width: number | null;
  height: number | null;
  tags: string;
  author: {
    name: string | null;
  };
}

export default function GaleriePage() {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState('TOUS');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentMedia, setCurrentMedia] = useState<MediaItem | null>(null);
  const lightboxRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch('/api/media');
        if (response.ok) {
          const data = await response.json();
          setMediaItems(data);
        } else {
          console.error('Erreur lors du chargement des médias');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMedia();
  }, []);
  
  // Fonctions utilitaires
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'IMAGE': return 'Screenshots';
      case 'VIDEO': return 'Vidéos';
      case 'ARTWORK': return 'Artworks';
      case 'CONCEPT': return 'Concepts';
      default: return type;
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'IMAGE': return '📷';
      case 'VIDEO': return '🎬';
      case 'ARTWORK': return '🎨';
      case 'CONCEPT': return '✏️';
      default: return '🖼️';
    }
  };
  
  // Ouvrir la lightbox pour une image
  const openLightbox = (media: MediaItem) => {
    setCurrentMedia(media);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };
  
  // Fermer la lightbox
  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'auto';
  };
  
  // Navigation entre les images dans la lightbox
  const navigateMedia = (direction: 'prev' | 'next') => {
    if (!currentMedia) return;
    
    const filteredMedia = activeType === 'TOUS' 
      ? mediaItems 
      : mediaItems.filter(item => item.type === activeType);
    
    const currentIndex = filteredMedia.findIndex(item => item.id === currentMedia.id);
    let newIndex;
    
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : filteredMedia.length - 1;
    } else {
      newIndex = currentIndex < filteredMedia.length - 1 ? currentIndex + 1 : 0;
    }
    
    setCurrentMedia(filteredMedia[newIndex]);
  };
  
  // Gestion des touches du clavier pour la navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateMedia('prev');
          break;
        case 'ArrowRight':
          navigateMedia('next');
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentMedia]);
  
  // Clic en dehors de l'image pour fermer la lightbox
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (lightboxRef.current && !lightboxRef.current.contains(e.target as Node)) {
        closeLightbox();
      }
    };
    
    if (lightboxOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [lightboxOpen]);
  
  // Filtrage des médias
  const filteredMedia = activeType === 'TOUS' 
    ? mediaItems 
    : mediaItems.filter(item => item.type === activeType);
  
  // Obtenir tous les types uniques
  const types = ['TOUS', ...Array.from(new Set(mediaItems.map(item => item.type)))];
  
  // Regrouper par type pour l'affichage
  const mediaByType = mediaItems.reduce((acc, item) => {
    if (!acc[item.type]) acc[item.type] = [];
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, MediaItem[]>);
  
  return (
    <div className="min-h-screen relative">
      {/* Header avec titre de section */}
      <div className="relative py-20 mb-12 bg-medieval-900">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 bg-[url('/backgrounds/HighresScreenshot00017.png')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-medieval-900/100"></div>
        <div className="absolute inset-0 vignette-effect-intense pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-title font-bold mb-6 text-white flame-effect">Galerie</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Découvrez les visuels et médias d'Afterlife
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-20">
        {/* Filtres */}
        <div className="mb-10 flex justify-center">
          <div className="bg-medieval-800/40 p-1 rounded-lg flex flex-wrap gap-1">
            {types.map(type => (
              <button
                key={type}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeType === type
                    ? 'bg-medieval-highlight text-white'
                    : 'text-gray-300 hover:bg-medieval-700/50'
                }`}
                onClick={() => setActiveType(type)}
              >
                {type === 'TOUS' ? 'Tous les médias' : (
                  <span className="flex items-center">
                    <span className="mr-2">{getTypeIcon(type)}</span>
                    {getTypeLabel(type)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Contenu de la galerie */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medieval-highlight"></div>
          </div>
        ) : activeType === 'TOUS' ? (
          // Affichage de tous les types regroupés
          <div className="space-y-16">
            {Object.entries(mediaByType).map(([type, items]) => (
              <div key={type} className="space-y-6">
                <h2 className="text-2xl font-title font-bold text-white flex items-center border-b border-gray-700/30 pb-2">
                  <span className="mr-3">{getTypeIcon(type)}</span>
                  {getTypeLabel(type)}
                </h2>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.slice(0, 8).map((item) => (
                    <div 
                      key={item.id}
                      className="group relative rounded-lg overflow-hidden bg-medieval-800/30 shadow-md hover:shadow-lg transition-all border border-gray-700/30 hover:border-gray-600/50"
                    >
                      <div 
                        className="aspect-[16/9] relative cursor-pointer"
                        onClick={() => item.type !== 'VIDEO' && openLightbox(item)}
                      >
                        <Image
                          src={item.thumbnail || item.url}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        
                        {item.type === 'VIDEO' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-16 h-16 rounded-full bg-black/70 flex items-center justify-center">
                              <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="p-4">
                        <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-300 text-sm line-clamp-2 mb-3">{item.description}</p>
                        )}
                        
                        {JSON.parse(item.tags).length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {JSON.parse(item.tags).slice(0, 3).map((tag: string) => (
                              <span key={tag} className="px-2 py-0.5 text-xs bg-medieval-900/80 text-gray-300 rounded">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {items.length > 8 && (
                  <div className="text-center mt-4">
                    <button
                      className="text-medieval-highlight hover:text-medieval-highlight/80 font-medium transition-colors flex items-center mx-auto"
                      onClick={() => setActiveType(type)}
                    >
                      Voir tous les {getTypeLabel(type).toLowerCase()}
                      <svg className="ml-1 w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Affichage d'un type spécifique
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredMedia.map((item) => (
                <div 
                  key={item.id}
                  className="group relative rounded-lg overflow-hidden bg-medieval-800/30 shadow-md hover:shadow-lg transition-all border border-gray-700/30 hover:border-gray-600/50"
                >
                  <div 
                    className="aspect-[16/9] relative cursor-pointer"
                    onClick={() => item.type !== 'VIDEO' && openLightbox(item)}
                  >
                    <Image
                      src={item.thumbnail || item.url}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {item.type === 'VIDEO' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-black/70 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-white font-semibold text-lg mb-1">{item.title}</h3>
                    {item.description && (
                      <p className="text-gray-300 text-sm mb-3">{item.description}</p>
                    )}
                    
                    {JSON.parse(item.tags).length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {JSON.parse(item.tags).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 text-xs bg-medieval-900/80 text-gray-300 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {filteredMedia.length === 0 && !loading && (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-title font-bold text-gray-400 mb-2">Aucun média disponible</h3>
            <p className="text-gray-500">
              {activeType !== 'TOUS' 
                ? `Aucun média de type "${getTypeLabel(activeType)}" n'est disponible pour le moment.`
                : "Notre galerie sera bientôt disponible avec de nouveaux contenus."}
            </p>
          </div>
        )}
        
        {/* Appel à l'action */}
        <div className="mt-16 text-center">
          <Link href="/devblog" className="btn-medieval">
            Lire le devblog
          </Link>
        </div>
      </div>
      
      {/* Lightbox modal */}
      {lightboxOpen && currentMedia && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
          <div 
            className="max-w-screen-lg max-h-screen p-4 relative"
            ref={lightboxRef}
          >
            <button 
              className="absolute top-0 right-0 z-10 w-10 h-10 bg-medieval-900/80 rounded-full flex items-center justify-center text-white hover:bg-medieval-900 transition-colors m-4"
              onClick={closeLightbox}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            
            <div className="relative">
              <Image
                src={currentMedia.url}
                alt={currentMedia.title}
                width={currentMedia.width || 1200}
                height={currentMedia.height || 675}
                className="max-h-[80vh] w-auto mx-auto object-contain"
              />
              
              <button 
                className="absolute top-1/2 left-0 -translate-y-1/2 z-10 w-12 h-12 bg-medieval-900/60 rounded-full flex items-center justify-center text-white hover:bg-medieval-900/80 transition-colors -ml-6"
                onClick={() => navigateMedia('prev')}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                className="absolute top-1/2 right-0 -translate-y-1/2 z-10 w-12 h-12 bg-medieval-900/60 rounded-full flex items-center justify-center text-white hover:bg-medieval-900/80 transition-colors -mr-6"
                onClick={() => navigateMedia('next')}
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            <div className="mt-4 text-white">
              <h3 className="text-xl font-semibold">{currentMedia.title}</h3>
              {currentMedia.description && (
                <p className="mt-2 text-gray-300">{currentMedia.description}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 