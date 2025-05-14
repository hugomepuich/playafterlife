'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Story {
  id: string;
  title: string;
  summary?: string;
  content: string;
  mainImage?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
  _count: {
    characters: number;
    places: number;
  };
}

export default function StoriesPage() {
  const { data: session } = useSession();
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  
  // Génération d'une classe de fond aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };
  
  const backgroundClass = getBgClass();

  useEffect(() => {
    const fetchStories = async () => {
      try {
        const response = await fetch('/api/wiki/stories');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des histoires');
        }
        const data = await response.json();
        setStories(data);
      } catch (error) {
        console.error('Error loading stories:', error);
        setError('Impossible de charger les histoires. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Filtrer les histoires en fonction de la recherche
  const filteredStories = stories.filter(story => 
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (story.summary && story.summary.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Filtrer les histoires publiées pour les utilisateurs non-admin
  const visibleStories = filteredStories.filter(story => 
    story.published || 
    (session?.user && ((session.user as any).role === 'ADMIN' || (session.user as any).id === story.author.id))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleDeleteStory = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette histoire ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/wiki/stories/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      // Mise à jour de la liste des histoires après suppression
      setStories(stories.filter(story => story.id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      alert(`Erreur: ${message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8 relative">
      <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-title font-bold text-white flame-effect">Histoires</h1>
            <p className="text-gray-400 mt-2">Découvrez les récits qui façonnent l'univers d'Afterlife</p>
          </div>
          
          {/* Barre de recherche */}
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Rechercher une histoire..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50 focus:border-white text-gray-300"
            />
          </div>
        </div>
        
        {/* Bouton de création */}
        {session?.user && (
          <div className="mb-8">
            <Link
              href="/wiki/stories/create"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded border border-gray-600 shadow-md hover:from-gray-600 hover:to-gray-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Créer une nouvelle histoire
            </Link>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900/50 text-red-200 p-4 rounded-md border border-red-700">
            {error}
          </div>
        ) : visibleStories.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-md">
            <p className="text-gray-400">Aucune histoire trouvée</p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-white underline"
              >
                Effacer la recherche
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visibleStories.map(story => (
              <Link
                key={story.id}
                href={`/wiki/stories/${story.id}`}
                className="group glass-panel rounded-md overflow-hidden border border-gray-700/50 hover:border-gray-500/50 hover:shadow-glow transition-all"
              >
                <div className="h-48 relative bg-gray-800">
                  {story.mainImage ? (
                    <Image
                      src={story.mainImage}
                      alt={story.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <span className="text-gray-600 text-4xl font-title">{story.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-title text-white group-hover:text-gray-300 transition-colors">
                      {story.title}
                    </h3>
                    {!story.published && (
                      <span className="text-xs bg-amber-900/50 px-2 py-1 rounded-full text-amber-300 border border-amber-700">
                        Brouillon
                      </span>
                    )}
                  </div>
                  
                  <div className="flex gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{story._count.characters}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>{story._count.places}</span>
                    </div>
                  </div>
                  
                  {story.summary && (
                    <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                      {story.summary}
                    </p>
                  )}
                  
                  <div className="text-gray-500 text-xs pt-2 border-t border-gray-800">
                    {story.author.name} • {formatDate(story.updatedAt)}
                  </div>
                  
                  {/* Actions administrateur ou auteur */}
                  {session?.user && ((session.user as any).role === 'ADMIN' || (session.user as any).id === story.author.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-700/50 flex gap-2">
                      <Link
                        href={`/wiki/stories/${story.id}/edit`}
                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                      >
                        Modifier
                      </Link>
                      {(session.user as any).role === 'ADMIN' && (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleDeleteStory(story.id);
                          }}
                          className="text-sm text-red-400 hover:text-red-300 transition-colors"
                        >
                          Supprimer
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 