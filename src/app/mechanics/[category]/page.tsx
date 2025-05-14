'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface MechanicArticle {
  id: string;
  title: string;
  summary: string;
  category: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
  };
}

interface CategoryInfo {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export default function MechanicCategoryPage() {
  const params = useParams();
  const categoryId = params?.category as string;
  const { data: session } = useSession();
  const [articles, setArticles] = useState<MechanicArticle[]>([]);
  const [categoryInfo, setCategoryInfo] = useState<CategoryInfo | null>(null);
  const [loading, setLoading] = useState(true);

  // Fonction pour générer un arrière-plan aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };

  useEffect(() => {
    const fetchCategoryAndArticles = async () => {
      try {
        // Remplacer par des appels API réels une fois créés
        // Simuler les informations de catégorie
        const categoriesMap: Record<string, CategoryInfo> = {
          'combat': {
            id: 'combat',
            name: 'Combat',
            description: 'Découvrez le système de combat dynamique et stratégique d\'Afterlife.',
            icon: 'swords'
          },
          'progression': {
            id: 'progression',
            name: 'Progression',
            description: 'Explorez comment votre personnage évolue à travers le monde corrompu d\'Afterlife.',
            icon: 'level-up'
          },
          'crafting': {
            id: 'crafting',
            name: 'Artisanat',
            description: 'Maîtrisez l\'art de créer et d\'améliorer des objets dans un monde en ruines.',
            icon: 'anvil'
          },
          'exploration': {
            id: 'exploration',
            name: 'Exploration',
            description: 'Naviguez à travers les terres désolées et découvrez des secrets oubliés.',
            icon: 'map'
          },
          'factions': {
            id: 'factions',
            name: 'Factions',
            description: 'Interagissez avec les différentes factions qui luttent pour le contrôle du Paradis corrompu.',
            icon: 'flag'
          },
          'magic': {
            id: 'magic',
            name: 'Magie',
            description: 'Apprenez les mystères des pouvoirs magiques qui persistent dans ce monde brisé.',
            icon: 'wand'
          }
        };

        setCategoryInfo(categoriesMap[categoryId] || null);

        // Simuler les articles pour cette catégorie
        const mockArticles: MechanicArticle[] = [
          {
            id: `${categoryId}-1`,
            title: 'Introduction aux mécaniques',
            summary: 'Un aperçu des bases du système et comment il s\'intègre au monde du jeu.',
            category: categoryId,
            image: '/placeholder/mechanics-1.jpg',
            createdAt: '2023-10-15T14:30:00Z',
            updatedAt: '2023-10-15T14:30:00Z',
            author: { name: 'Game Designer' }
          },
          {
            id: `${categoryId}-2`,
            title: 'Compétences avancées',
            summary: 'Maîtrisez les techniques les plus puissantes pour surmonter les défis les plus difficiles.',
            category: categoryId,
            image: '/placeholder/mechanics-2.jpg',
            createdAt: '2023-11-05T09:15:00Z',
            updatedAt: '2023-11-08T11:20:00Z',
            author: { name: 'Game Designer' }
          },
          {
            id: `${categoryId}-3`,
            title: 'Stratégies recommandées',
            summary: 'Conseils et astuces pour tirer le meilleur parti de ces systèmes de jeu.',
            category: categoryId,
            image: '/placeholder/mechanics-3.jpg',
            createdAt: '2023-12-01T16:45:00Z',
            updatedAt: '2023-12-01T16:45:00Z',
            author: { name: 'Game Designer' }
          }
        ];

        setArticles(mockArticles);
      } catch (error) {
        console.error('Erreur lors du chargement des articles:', error);
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategoryAndArticles();
    }
  }, [categoryId]);

  const backgroundClass = getBgClass();

  if (loading) {
    return (
      <div className="min-h-screen bg-medieval-900 text-medieval-parchment p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-12 bg-medieval-800/70 rounded w-1/3 mb-8"></div>
            <div className="h-6 bg-medieval-800/70 rounded w-2/3 mb-12"></div>
            
            <div className="space-y-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="glass-panel h-40 rounded-md border border-medieval-ethereal/20 p-6 flex">
                  <div className="w-1/4 bg-medieval-800/70 rounded-md mr-6"></div>
                  <div className="w-3/4 space-y-3">
                    <div className="h-6 bg-medieval-800/70 rounded-md w-1/2"></div>
                    <div className="h-4 bg-medieval-800/70 rounded-md w-full"></div>
                    <div className="h-4 bg-medieval-800/70 rounded-md w-3/4"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!categoryInfo) {
    return (
      <div className="min-h-screen bg-medieval-900 text-medieval-parchment p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-title text-medieval-highlight mb-6">Catégorie non trouvée</h1>
          <p className="mb-6">La catégorie de mécaniques que vous recherchez n'existe pas.</p>
          <Link 
            href="/mechanics" 
            className="text-medieval-ethereal hover:text-medieval-highlight transition-colors font-title flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux mécaniques de jeu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medieval-900 text-medieval-parchment relative">
      {/* Arrière-plan avec image aléatoire et superposition */}
      <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-medieval-900/95 via-medieval-900/85 to-medieval-900/95"></div>
      
      {/* En-tête */}
      <div className="relative py-16 mb-8 border-b border-medieval-ethereal/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-4 mb-3">
                <div className="bg-medieval-700/50 w-16 h-16 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-medieval-highlight" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h1 className="text-5xl md:text-6xl font-title font-bold text-medieval-highlight flame-effect">{categoryInfo.name}</h1>
              </div>
              <p className="text-medieval-parchment/90 font-body text-lg">
                {categoryInfo.description}
              </p>
            </div>
            <div className="flex space-x-2">
              <Link
                href="/mechanics"
                className="btn-medieval flex items-center rounded-md px-4 py-2 shadow-md hover:shadow-medieval-glow transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Retour
              </Link>
              {session?.user && (session.user as any).role === 'ADMIN' && (
                <Link
                  href={`/admin/mechanics/create?category=${categoryId}`}
                  className="btn-medieval flex items-center rounded-md px-4 py-2 shadow-md hover:shadow-medieval-glow transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nouvel article
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 relative z-10">
        {articles.length > 0 ? (
          <div className="space-y-6 fade-in">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/mechanics/${categoryId}/${article.id}`}
                className="glass-panel block rounded-md border border-medieval-ethereal/20 hover:border-medieval-highlight/40 hover:shadow-medieval-glow transition-all overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/4 h-48 md:h-auto bg-medieval-700/50">
                    {article.image ? (
                      <div className="absolute inset-0">
                        <Image
                          src={article.image}
                          alt={article.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-16 h-16 text-medieval-ethereal/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:w-3/4">
                    <h2 className="text-2xl font-title text-medieval-highlight mb-2 group-hover:text-medieval-ethereal transition-colors flex items-center">
                      {article.title}
                      <svg className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform translate-x-0 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </h2>
                    <p className="text-medieval-parchment/80 font-body mb-4">{article.summary}</p>
                    <div className="flex justify-between text-sm text-medieval-ethereal/70">
                      <span>Par {article.author.name}</span>
                      <span>{new Date(article.updatedAt).toLocaleDateString('fr-FR')}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-md border border-medieval-ethereal/20 p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-medieval-ethereal/30 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 className="text-2xl font-title text-medieval-highlight mb-3">Pas encore d'articles</h3>
            <p className="text-medieval-parchment/80 max-w-lg mx-auto">
              Aucun article n'a encore été publié dans cette catégorie. Revenez bientôt pour découvrir du contenu sur cette mécanique de jeu.
            </p>
            {session?.user && (session.user as any).role === 'ADMIN' && (
              <Link
                href={`/admin/mechanics/create?category=${categoryId}`}
                className="mt-6 inline-block btn-medieval px-5 py-2.5 rounded-md shadow-lg"
              >
                Créer le premier article
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 