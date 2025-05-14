'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Author {
  id: string;
  name: string;
}

interface Character {
  id: string;
  name: string;
  lastName?: string;
  title?: string;
  mainImage?: string;
}

interface Story {
  id: string;
  title: string;
  mainImage?: string;
  summary?: string;
  published: boolean;
}

interface Place {
  id: string;
  name: string;
  description?: string;
  content?: string;
  mainImage?: string;
  images: string[];
  createdAt: string;
  updatedAt: string;
  tags: string[];
  author: Author;
  characters: Character[];
  stories: Story[];
}

export default function PlaceDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [parsedImages, setParsedImages] = useState<string[]>([]);
  const [parsedTags, setParsedTags] = useState<string[]>([]);
  
  // Génération d'une classe de fond aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };
  
  const backgroundClass = getBgClass();

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(`/api/wiki/places/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Lieu non trouvé');
          }
          throw new Error('Erreur lors de la récupération du lieu');
        }
        const data = await response.json();
        setPlace(data);
        
        // Parser les images JSON
        try {
          setParsedImages(JSON.parse(data.images || '[]'));
        } catch (e) {
          console.error('Erreur lors du parsing des images', e);
          setParsedImages([]);
        }
        
        // Parser les tags JSON
        try {
          setParsedTags(JSON.parse(data.tags || '[]'));
        } catch (e) {
          console.error('Erreur lors du parsing des tags', e);
          setParsedTags([]);
        }
      } catch (error) {
        console.error('Error loading place:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchPlace();
  }, [params.id]);

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/wiki/places/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      router.push('/wiki/places');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      alert(`Erreur: ${message}`);
    }
  };

  // Formater la date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  // Vérifier si l'utilisateur peut modifier le lieu
  const canEdit = place && session?.user && (
    (session.user as any).role === 'ADMIN' || 
    (session.user as any).id === place.author.id
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-8 relative">
        <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95"></div>
        <div className="max-w-7xl mx-auto relative z-10 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="min-h-screen bg-black text-white p-8 relative">
        <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-red-900/50 text-red-200 p-4 rounded-md border border-red-700">
            {error || 'Lieu non trouvé'}
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push('/wiki/places')}
              className="text-white underline hover:text-gray-300 transition-colors"
            >
              Retour à la liste des lieux
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 relative">
      <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Navigation */}
        <div className="mb-8">
          <Link
            href="/wiki/places"
            className="text-gray-400 hover:text-white transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux lieux
          </Link>
        </div>
        
        {/* En-tête */}
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          {/* Image principale */}
          {place.mainImage && (
            <div className="w-full md:w-1/3 lg:w-1/4">
              <div className="glass-panel rounded-md overflow-hidden border border-gray-700/50">
                <div className="aspect-[3/4] relative">
                  <Image
                    src={place.mainImage}
                    alt={place.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
              </div>
            </div>
          )}
          
          {/* Informations */}
          <div className="flex-1">
            <h1 className="text-4xl font-title font-bold text-white mb-2 flame-effect">{place.name}</h1>
            
            <div className="mb-6 text-gray-500 text-sm">
              Par {place.author.name} • Dernière mise à jour: {formatDate(place.updatedAt)}
            </div>
            
            {place.description && (
              <div className="glass-panel rounded-md p-6 border border-gray-700/50 mb-6">
                <h2 className="text-lg font-title text-white mb-4">Description</h2>
                <div className="text-gray-300">
                  {place.description}
                </div>
              </div>
            )}
            
            {/* Actions */}
            {canEdit && (
              <div className="mb-8 flex gap-3">
                <Link
                  href={`/wiki/places/${place.id}/edit`}
                  className="px-3 py-1.5 bg-blue-900/50 hover:bg-blue-900/70 text-blue-300 rounded text-sm border border-blue-800/50 transition-colors"
                >
                  Modifier
                </Link>
                {(session?.user && (session.user as any).role === 'ADMIN') && (
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded text-sm border border-red-800/50 transition-colors"
                  >
                    Supprimer
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Contenu détaillé */}
        {place.content && (
          <div className="glass-panel rounded-md p-6 border border-gray-700/50 mb-8">
            <h2 className="text-xl font-title text-white mb-4">À propos de ce lieu</h2>
            <div className="prose prose-invert prose-img:rounded-md prose-headings:font-title max-w-none">
              {place.content.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </div>
        )}
        
        {/* Personnages liés */}
        {place.characters.length > 0 && (
          <div className="glass-panel rounded-md p-6 border border-gray-700/50 mb-8">
            <h2 className="text-xl font-title text-white mb-4">Personnages liés à ce lieu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {place.characters.map(character => (
                <Link
                  key={character.id}
                  href={`/wiki/characters/${character.id}`}
                  className="flex items-center p-3 rounded-md bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-900/70 transition-all group"
                >
                  <div className="w-10 h-10 mr-3 rounded-full overflow-hidden bg-gray-800 relative flex-shrink-0">
                    {character.mainImage ? (
                      <Image
                        src={character.mainImage}
                        alt={character.name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-600 text-xl font-title">{character.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-title group-hover:text-gray-300 transition-colors">
                      {character.name} {character.lastName && character.lastName}
                    </h3>
                    {character.title && (
                      <p className="text-gray-500 text-xs">{character.title}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Histoires liées */}
        {place.stories.length > 0 && (
          <div className="glass-panel rounded-md p-6 border border-gray-700/50 mb-8">
            <h2 className="text-xl font-title text-white mb-4">Histoires mentionnant ce lieu</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {place.stories.filter(story => 
                story.published || 
                (session?.user && ((session.user as any).role === 'ADMIN' || (session.user as any).id === place.author.id))
              ).map(story => (
                <Link
                  key={story.id}
                  href={`/wiki/stories/${story.id}`}
                  className="flex items-center p-3 rounded-md bg-gray-900/50 border border-gray-800 hover:border-gray-700 hover:bg-gray-900/70 transition-all group"
                >
                  <div className="w-10 h-10 mr-3 rounded overflow-hidden bg-gray-800 relative flex-shrink-0">
                    {story.mainImage ? (
                      <Image
                        src={story.mainImage}
                        alt={story.title}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-gray-600 text-xl font-title">{story.title.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-white text-sm font-title group-hover:text-gray-300 transition-colors">
                      {story.title}
                    </h3>
                    {!story.published && (
                      <p className="text-amber-500 text-xs">Brouillon</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        
        {/* Galerie d'images supplémentaires */}
        {parsedImages.length > 0 && (
          <div className="glass-panel rounded-md p-6 border border-gray-700/50 mb-8">
            <h2 className="text-xl font-title text-white mb-4">Galerie</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {parsedImages.map((img, index) => (
                <div key={index} className="aspect-square relative rounded-md overflow-hidden">
                  <Image
                    src={img}
                    alt={`Image ${index + 1} de ${place.name}`}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Tags */}
        {parsedTags.length > 0 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {parsedTags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-gray-800 text-gray-300 text-xs rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 