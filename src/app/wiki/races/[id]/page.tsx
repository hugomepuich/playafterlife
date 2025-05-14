'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

interface Character {
  id: string;
  name: string;
  lastName?: string;
  title?: string;
  mainImage?: string;
}

interface Race {
  id: string;
  name: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  characters: Character[];
}

export default function RaceDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { data: session } = useSession();
  const [race, setRace] = useState<Race | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Génération d'une classe de fond aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };
  
  const backgroundClass = getBgClass();

  useEffect(() => {
    const fetchRace = async () => {
      try {
        const response = await fetch(`/api/wiki/races/${params.id}`);
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Race non trouvée');
          }
          throw new Error('Erreur lors de la récupération de la race');
        }
        const data = await response.json();
        setRace(data);
      } catch (error) {
        console.error('Error loading race:', error);
        setError(error instanceof Error ? error.message : 'Une erreur est survenue');
      } finally {
        setLoading(false);
      }
    };

    fetchRace();
  }, [params.id]);

  const handleDelete = async () => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette race ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/wiki/races/${params.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      router.push('/wiki/races');
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

  if (error || !race) {
    return (
      <div className="min-h-screen bg-black text-white p-8 relative">
        <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="bg-red-900/50 text-red-200 p-4 rounded-md border border-red-700">
            {error || 'Race non trouvée'}
          </div>
          <div className="mt-4">
            <button
              onClick={() => router.push('/wiki/races')}
              className="text-white underline hover:text-gray-300 transition-colors"
            >
              Retour à la liste des races
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
            href="/wiki/races"
            className="text-gray-400 hover:text-white transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux races
          </Link>
        </div>
        
        {/* En-tête */}
        <div className="flex flex-col md:flex-row gap-8 mb-10">
          {/* Image de la race */}
          <div className="w-full md:w-1/3 lg:w-1/4">
            <div className="glass-panel rounded-md overflow-hidden border border-gray-700/50">
              <div className="aspect-[3/4] relative">
                {race.image ? (
                  <Image
                    src={race.image}
                    alt={race.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <span className="text-gray-600 text-6xl font-title">{race.name.charAt(0)}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Actions administrateur */}
            {session?.user && (session.user as any).role === 'ADMIN' && (
              <div className="mt-4 glass-panel rounded-md p-4 border border-gray-700/50">
                <h3 className="text-sm font-title text-gray-400 mb-3">Actions d'administration</h3>
                <div className="flex gap-3">
                  <Link
                    href={`/wiki/races/${race.id}/edit`}
                    className="px-3 py-1.5 bg-blue-900/50 hover:bg-blue-900/70 text-blue-300 rounded text-sm border border-blue-800/50 transition-colors"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="px-3 py-1.5 bg-red-900/50 hover:bg-red-900/70 text-red-300 rounded text-sm border border-red-800/50 transition-colors"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Informations */}
          <div className="flex-1">
            <h1 className="text-4xl font-title font-bold text-white mb-2 flame-effect">{race.name}</h1>
            
            <div className="mb-6 text-gray-500 text-sm">
              Dernière mise à jour: {formatDate(race.updatedAt)}
            </div>
            
            {race.description && (
              <div className="glass-panel rounded-md p-6 border border-gray-700/50 mb-8">
                <h2 className="text-lg font-title text-white mb-4">À propos de cette race</h2>
                <div className="text-gray-300 space-y-4 whitespace-pre-line">
                  {race.description}
                </div>
              </div>
            )}
            
            {/* Personnages de cette race */}
            <div className="glass-panel rounded-md p-6 border border-gray-700/50">
              <h2 className="text-lg font-title text-white mb-4">
                Personnages de cette race 
                <span className="text-gray-500 ml-2 text-sm">
                  ({race.characters.length} {race.characters.length === 1 ? 'personnage' : 'personnages'})
                </span>
              </h2>
              
              {race.characters.length === 0 ? (
                <p className="text-gray-500">Aucun personnage n'appartient à cette race pour le moment.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {race.characters.map(character => (
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 