'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface MechanicArticle {
  id: string;
  title: string;
  category: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminMechanicsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [articles, setArticles] = useState<MechanicArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  
  // Fonction pour générer un arrière-plan aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };

  const backgroundClass = getBgClass();

  useEffect(() => {
    // Rediriger si non connecté ou non admin
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session && !((session.user as any).role === 'ADMIN')) {
      router.push('/');
      return;
    }

    const fetchArticles = async () => {
      try {
        // Remplacer par un appel API réel une fois créé
        // Simuler les données des articles
        const mockArticles: MechanicArticle[] = [
          {
            id: 'combat-1',
            title: 'Introduction aux mécaniques de combat',
            category: 'combat',
            categoryName: 'Combat',
            createdAt: '2023-10-15T14:30:00Z',
            updatedAt: '2023-10-15T14:30:00Z'
          },
          {
            id: 'combat-2',
            title: 'Compétences avancées de combat',
            category: 'combat',
            categoryName: 'Combat',
            createdAt: '2023-11-05T09:15:00Z',
            updatedAt: '2023-11-08T11:20:00Z'
          },
          {
            id: 'progression-1',
            title: 'Introduction à la progression',
            category: 'progression',
            categoryName: 'Progression',
            createdAt: '2023-10-20T10:00:00Z',
            updatedAt: '2023-10-20T10:00:00Z'
          },
          {
            id: 'crafting-1',
            title: 'Introduction à l\'artisanat',
            category: 'crafting',
            categoryName: 'Artisanat',
            createdAt: '2023-09-12T08:45:00Z',
            updatedAt: '2023-09-15T14:20:00Z'
          },
          {
            id: 'exploration-1',
            title: 'Bases de l\'exploration',
            category: 'exploration',
            categoryName: 'Exploration',
            createdAt: '2023-08-05T16:30:00Z',
            updatedAt: '2023-08-06T09:10:00Z'
          }
        ];

        setArticles(mockArticles);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [status, session, router]);

  const handleDeleteArticle = async (id: string) => {
    // Pour l'instant, on simule juste la suppression côté client
    if (confirm('Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible.')) {
      try {
        // Simuler un appel API pour supprimer l'article
        console.log(`Suppression de l'article: ${id}`);
        
        // Mettre à jour l'interface utilisateur
        setArticles(articles.filter(article => article.id !== id));
      } catch (error) {
        console.error('Erreur lors de la suppression de l\'article:', error);
        alert('Une erreur est survenue lors de la suppression de l\'article.');
      }
    }
  };

  const filteredArticles = articles
    .filter(article => selectedCategory === 'all' || article.category === selectedCategory)
    .filter(article => article.title.toLowerCase().includes(searchTerm.toLowerCase()));

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-medieval-900 text-medieval-parchment p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-medieval-800/70 rounded w-1/4 mb-8"></div>
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <div className="h-10 bg-medieval-800/70 rounded w-full md:w-1/3"></div>
              <div className="h-10 bg-medieval-800/70 rounded w-full md:w-1/4"></div>
            </div>
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="h-16 bg-medieval-800/70 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medieval-900 text-medieval-parchment relative">
      {/* Arrière-plan avec image aléatoire et superposition */}
      <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-medieval-900/95 via-medieval-900/85 to-medieval-900/95"></div>
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <h1 className="text-4xl font-title text-medieval-highlight">Gestion des mécaniques de jeu</h1>
            <Link 
              href="/admin/mechanics/create" 
              className="btn-medieval flex items-center rounded-md px-4 py-2 shadow-md hover:shadow-medieval-glow transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Nouvel article
            </Link>
          </div>

          <div className="glass-panel rounded-md border border-medieval-ethereal/20 p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-1/2">
                <label htmlFor="search" className="block text-sm font-title mb-2 text-medieval-parchment">Rechercher</label>
                <div className="relative">
                  <input
                    type="text"
                    id="search"
                    placeholder="Rechercher un article..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-medieval-ethereal/70"
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
              </div>
              <div className="w-full md:w-1/3">
                <label htmlFor="category" className="block text-sm font-title mb-2 text-medieval-parchment">Catégorie</label>
                <select
                  id="category"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                >
                  <option value="all">Toutes les catégories</option>
                  <option value="combat">Combat</option>
                  <option value="progression">Progression</option>
                  <option value="crafting">Artisanat</option>
                  <option value="exploration">Exploration</option>
                  <option value="factions">Factions</option>
                  <option value="magic">Magie</option>
                </select>
              </div>
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <div className="glass-panel rounded-md border border-medieval-ethereal/20 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-medieval-700/50 text-left">
                      <th className="px-6 py-3 text-sm font-title text-medieval-highlight">Titre</th>
                      <th className="px-6 py-3 text-sm font-title text-medieval-highlight">Catégorie</th>
                      <th className="px-6 py-3 text-sm font-title text-medieval-highlight">Dernière modification</th>
                      <th className="px-6 py-3 text-sm font-title text-medieval-highlight">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-medieval-ethereal/10">
                    {filteredArticles.map((article) => (
                      <tr key={article.id} className="hover:bg-medieval-700/30 transition-colors">
                        <td className="px-6 py-4 text-medieval-parchment">
                          <Link 
                            href={`/mechanics/${article.category}/${article.id}`}
                            className="hover:text-medieval-highlight transition-colors"
                          >
                            {article.title}
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-medieval-parchment">{article.categoryName}</td>
                        <td className="px-6 py-4 text-sm text-medieval-parchment/80">
                          {new Date(article.updatedAt).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <Link
                              href={`/admin/mechanics/${article.id}/edit`}
                              className="text-medieval-ethereal hover:text-medieval-highlight transition-colors"
                              title="Modifier"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                            </Link>
                            <button
                              onClick={() => handleDeleteArticle(article.id)}
                              className="text-red-500 hover:text-red-400 transition-colors"
                              title="Supprimer"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="glass-panel rounded-md border border-medieval-ethereal/20 p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-medieval-ethereal/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <h3 className="text-2xl font-title text-medieval-highlight mb-3">Aucun article trouvé</h3>
              <p className="text-medieval-parchment/80 max-w-lg mx-auto mb-6">
                Aucun article ne correspond à vos critères de recherche ou aucun article n'a encore été créé.
              </p>
              <Link 
                href="/admin/mechanics/create" 
                className="btn-medieval inline-flex items-center rounded-md px-4 py-2 shadow-md hover:shadow-medieval-glow transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Créer un article
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 