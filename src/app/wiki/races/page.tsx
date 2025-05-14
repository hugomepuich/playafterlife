'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface Race {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  _count: {
    characters: number;
  };
}

// Styles spécifiques pour l'effet de cartes
const cardStyles = `
  .grid-container {
    position: relative;
    padding: 2rem 0;
    width: 100%;
    overflow: visible;
  }
  
  .races-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
    padding: 1rem 0;
    width: 100%;
    overflow: visible;
  }
  
  .race-card {
    position: relative;
    transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
    transform-origin: center;
    will-change: transform;
    z-index: 10;
    overflow: visible;
  }
  
  /* S'assurer que la carte survolée est toujours au-dessus des autres */
  .race-card:hover {
    transform: translateY(-1rem) scale(1.03);
    z-index: 50 !important;
    filter: drop-shadow(0 15px 15px rgba(0, 0, 0, 0.7));
  }
  
  .card-inner {
    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
    transform: perspective(1000px) rotateY(0);
    height: 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgba(0, 0, 0, 0.7);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  .race-card:hover .card-inner {
    box-shadow: 0 15px 35px rgba(0,0,0,0.7);
    transform: perspective(1000px);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  /* Animation de l'image lors du survol */
  .race-card:hover .card-image {
    transform: scale(1.1);
    filter: grayscale(0.7);
  }

  /* Styles pour les écrans moyens */
  @media (max-width: 1280px) {
    .races-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  /* Styles pour les petits écrans */
  @media (max-width: 768px) {
    .races-grid {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;

export default function RacesPage() {
  const { data: session } = useSession();
  const [races, setRaces] = useState<Race[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState('');
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  
  // Fonction pour générer un arrière-plan aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };

  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch('/api/wiki/races');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des races');
        }
        const data = await response.json();
        setRaces(data);
      } catch (error) {
        console.error('Error loading races:', error);
        setError('Impossible de charger les races. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    fetchRaces();
  }, []);

  // Filtrer les races en fonction de la recherche
  const filteredRaces = races.filter(race => 
    race.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (race.description && race.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteRace = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette race ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/wiki/races/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      // Mise à jour de la liste des races après suppression
      setRaces(races.filter(race => race.id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      alert(`Erreur: ${message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-300 overflow-visible">
      {/* Injecter les styles CSS personnalisés */}
      <style jsx global>{cardStyles}</style>
      
      {/* Header with section title and create button */}
      <div className="relative py-16 mb-8 border-b border-gray-700/50">
        <div className={`absolute inset-0 ${getBgClass()} bg-cover bg-center opacity-20 grayscale vignette-effect-intense`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 to-black/70"></div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-title font-bold mb-3 text-white flame-effect-intense">Races</h1>
              <p className="text-gray-400 font-body text-lg">
                Découvrez les différentes races qui peuplent l'univers d'Afterlife, chacune avec son histoire et ses particularités.
              </p>
            </div>
            {session?.user && (session.user as any).role === 'ADMIN' && (
              <Link
                href="/wiki/races/create"
                className="btn-medieval flex items-center px-5 py-3 shadow-lg hover:shadow-md transition-all animated-border-glow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Créer une Race
              </Link>
            )}
          </div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 overflow-visible">
        {/* Search bar and filters */}
        <div className="mb-8 space-y-5 fade-in">
          {/* Search bar with toggle button */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Rechercher une race..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-12 pr-4 glass-panel bg-black/50 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-gray-400/30 text-gray-300 font-body"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            {/* Collapse toggle button */}
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="glass-panel p-1.5 border border-gray-700/30 flex items-center px-3 text-gray-400 hover:text-white transition-colors"
              title={isFilterExpanded ? "Masquer les filtres" : "Afficher les filtres"}
            >
              <span className="mr-2 font-title text-sm">Filtres</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Filters - collapsible */}
          {isFilterExpanded && (
            <div className="glass-panel p-5 border border-gray-700/30 animate-fadeIn">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 font-title mr-3">Options de recherche:</span>
                  <p className="text-sm text-gray-400">
                    La recherche s'effectue par nom et description.
                  </p>
                </div>
                
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-white hover:text-gray-300 flex items-center font-title text-sm bg-black/60 hover:bg-gray-800/60 py-1.5 px-3 border border-gray-700/30 hover:border-gray-600 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Effacer la recherche
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6 text-gray-400 font-body text-sm">
          {filteredRaces.length} {filteredRaces.length === 1 ? 'race' : 'races'} trouvée{filteredRaces.length > 1 ? 's' : ''}
        </div>

        {/* Race grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          </div>
        ) : error ? (
          <div className="glass-panel p-5 text-center fade-in border border-red-700/30 bg-red-950/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-700/70 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-2xl font-title text-red-300 mb-3 flame-effect">Erreur</h3>
            <p className="text-red-200 max-w-md mx-auto">
              {error}
            </p>
          </div>
        ) : filteredRaces.length === 0 ? (
          <div className="glass-panel p-10 text-center fade-in border border-gray-700/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-title text-white mb-3 flame-effect">Aucune Race Trouvée</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              Aucune race ne correspond à votre recherche actuelle.
            </p>
            {session?.user && (session.user as any).role === 'ADMIN' && (
              <Link
                href="/wiki/races/create"
                className="mt-6 inline-block btn-medieval px-5 py-2.5 shadow-lg animated-border-glow"
              >
                Créer une Race
              </Link>
            )}
          </div>
        ) : (
          <div className="grid-container fade-in">
            <div className="races-grid">
              {filteredRaces.map((race) => (
                <Link
                  key={race.id}
                  href={`/wiki/races/${race.id}`}
                  className="group race-card"
                >
                  <div className="card-inner">
                    {/* Image de la race */}
                    <div className="h-48 bg-black/50 relative overflow-hidden">
                      {race.image ? (
                        <>
                          {/* Cadre décoratif */}
                          <div className="absolute inset-0 border border-gray-700/50"></div>
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-600"></div>
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-600"></div>
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-600"></div>
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-600"></div>
                          <div className="absolute inset-0 vignette-effect pointer-events-none"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40 mix-blend-overlay"></div>
                          <div className="vertical-scan"></div>
                          <Image
                            src={race.image}
                            alt={race.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                            className="object-cover object-center transition-all duration-700 grayscale card-image"
                            loading="lazy"
                          />
                        </>
                      ) : (
                        <>
                          {/* Cadre décoratif */}
                          <div className="absolute inset-0 border border-gray-700/50"></div>
                          <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-600"></div>
                          <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-600"></div>
                          <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-600"></div>
                          <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-600"></div>
                          <div className="absolute inset-0 vignette-effect pointer-events-none"></div>
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40 mix-blend-overlay"></div>
                          <div className="vertical-scan"></div>
                          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-700/30 to-gray-900/30">
                            <span className="text-gray-600 text-6xl font-title">{race.name.charAt(0)}</span>
                          </div>
                        </>
                      )}
                      {/* Gradient de fondu en bas de l'image */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
                    </div>

                    {/* Contenu de la carte */}
                    <div className="p-4 flex-grow flex flex-col bg-black/90 relative">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-title text-lg text-white group-hover:text-gray-300 transition-colors line-clamp-1">{race.name}</h3>
                        <span className="text-xs bg-gray-800/80 px-2 py-0.5 rounded-sm text-gray-400 border border-gray-700/50">
                          {race._count.characters} {race._count.characters === 1 ? 'personnage' : 'personnages'}
                        </span>
                      </div>
                      
                      {race.description && (
                        <p className="text-gray-400 font-body mb-2 text-sm line-clamp-3">
                          {race.description}
                        </p>
                      )}
                      
                      {/* Actions administrateur */}
                      {session?.user && (session.user as any).role === 'ADMIN' && (
                        <div className="mt-auto pt-3 border-t border-gray-700/30 flex justify-between items-center">
                          <div className="flex gap-3">
                            <Link
                              href={`/wiki/races/${race.id}/edit`}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Modifier
                            </Link>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteRace(race.id);
                              }}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Supprimer
                            </button>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-xs text-white bg-black/60 border border-gray-700/50 px-3 py-1 rounded-sm inline-flex items-center">
                              Voir
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {!session?.user && (
                        <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <span className="text-xs text-white bg-black/60 border border-gray-700/50 px-3 py-1 rounded-sm inline-flex items-center">
                            Voir
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 