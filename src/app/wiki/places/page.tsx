'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Place {
  id: string;
  name: string;
  description?: string;
  mainImage?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
  _count: {
    characters: number;
    stories: number;
  };
}

export default function PlacesPage() {
  const { data: session } = useSession();
  const [places, setPlaces] = useState<Place[]>([]);
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
    const fetchPlaces = async () => {
      try {
        const response = await fetch('/api/wiki/places');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des lieux');
        }
        const data = await response.json();
        setPlaces(data);
      } catch (error) {
        console.error('Error loading places:', error);
        setError('Impossible de charger les lieux. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  // Filtrer les lieux en fonction de la recherche
  const filteredPlaces = places.filter(place => 
    place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (place.description && place.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };

  const handleDeletePlace = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce lieu ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/wiki/places/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      // Mise à jour de la liste des lieux après suppression
      setPlaces(places.filter(place => place.id !== id));
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
            <h1 className="text-4xl font-title font-bold text-white flame-effect">Lieux</h1>
            <p className="text-gray-400 mt-2">Découvrez les lieux qui composent l'univers d'Afterlife</p>
          </div>
          
          {/* Barre de recherche */}
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Rechercher un lieu..."
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
              href="/wiki/places/create"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-gray-700 to-gray-800 text-white rounded border border-gray-600 shadow-md hover:from-gray-600 hover:to-gray-700 transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              Créer un nouveau lieu
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
        ) : filteredPlaces.length === 0 ? (
          <div className="glass-panel p-8 text-center rounded-md">
            <p className="text-gray-400">Aucun lieu trouvé</p>
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
            {filteredPlaces.map(place => (
              <Link
                key={place.id}
                href={`/wiki/places/${place.id}`}
                className="group glass-panel rounded-md overflow-hidden border border-gray-700/50 hover:border-gray-500/50 hover:shadow-glow transition-all"
              >
                <div className="h-48 relative bg-gray-800">
                  {place.mainImage ? (
                    <Image
                      src={place.mainImage}
                      alt={place.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                      <span className="text-gray-600 text-4xl font-title">{place.name.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                </div>
                
                <div className="p-5">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-title text-white mb-2 group-hover:text-gray-300 transition-colors">
                      {place.name}
                    </h3>
                  </div>
                  
                  <div className="flex gap-4 text-sm text-gray-400 mb-3">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span>{place._count.characters}</span>
                    </div>
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                      <span>{place._count.stories}</span>
                    </div>
                  </div>
                  
                  {place.description && (
                    <p className="text-gray-400 text-sm line-clamp-3 mb-3">
                      {place.description}
                    </p>
                  )}
                  
                  <div className="text-gray-500 text-xs pt-2 border-t border-gray-800">
                    {place.author.name} • {formatDate(place.updatedAt)}
                  </div>
                  
                  {/* Actions administrateur ou auteur */}
                  {session?.user && ((session.user as any).role === 'ADMIN' || (session.user as any).id === place.author?.id) && (
                    <div className="mt-4 pt-4 border-t border-gray-700/50 flex gap-2">
                      <Link
                        href={`/wiki/places/${place.id}/edit`}
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
                            handleDeletePlace(place.id);
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