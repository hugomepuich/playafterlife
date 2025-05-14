'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Character {
  id: string;
  name: string;
  title?: string;
  race?: string;
  class?: string;
  image?: string;
  createdAt: string;
}

export default function AdminCharactersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, router, session]);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('/api/wiki/characters');
        if (response.ok) {
          const data = await response.json();
          setCharacters(Array.isArray(data) ? data : []);
        } else {
          setError('Erreur lors du chargement des personnages');
        }
      } catch (error) {
        console.error("Erreur lors du chargement des personnages:", error);
        setError('Erreur lors du chargement des personnages');
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user && (session.user as any).role === 'ADMIN') {
      fetchCharacters();
    }
  }, [session]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-blue-400">Gestion des personnages</h1>
            <p className="text-gray-400 mt-2">
              Créez, modifiez ou supprimez des personnages
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
            >
              Retour au tableau de bord
            </Link>
            <Link
              href="/wiki/characters/create"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Créer un personnage
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-red-900/20 border border-red-900 text-red-400 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {characters.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-8 text-center">
            <p className="text-xl text-gray-400">Aucun personnage n'a été créé</p>
            <Link
              href="/wiki/characters/create"
              className="mt-4 inline-block px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            >
              Créer votre premier personnage
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Race
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Classe
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {characters.map((character) => (
                  <tr key={character.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="relative h-10 w-10 rounded-full overflow-hidden bg-gray-700">
                        {character.image ? (
                          <Image
                            src={character.image}
                            alt={character.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                            N/A
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-white">{character.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{character.title || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{character.race || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">{character.class || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-300">
                        {new Date(character.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <Link
                          href={`/wiki/characters/${character.id}`}
                          className="text-blue-400 hover:text-blue-300"
                        >
                          Voir
                        </Link>
                        <Link
                          href={`/wiki/characters/${character.id}/edit`}
                          className="text-yellow-400 hover:text-yellow-300"
                        >
                          Modifier
                        </Link>
                        <button
                          className="text-red-400 hover:text-red-300"
                          onClick={() => {
                            if (confirm(`Êtes-vous sûr de vouloir supprimer ${character.name} ?`)) {
                              fetch(`/api/wiki/characters/${character.id}`, { method: 'DELETE' })
                                .then(response => {
                                  if (response.ok) {
                                    setCharacters(characters.filter(c => c.id !== character.id));
                                  } else {
                                    alert('Erreur lors de la suppression du personnage');
                                  }
                                });
                            }
                          }}
                        >
                          Supprimer
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 