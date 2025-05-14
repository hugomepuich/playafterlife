'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';

interface MechanicArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: string;
  categoryName: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
  author: {
    name: string;
    image?: string;
  };
  relatedArticles?: {
    id: string;
    title: string;
    category: string;
  }[];
}

export default function MechanicArticlePage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const { category, articleId } = params as { category: string; articleId: string };
  const [article, setArticle] = useState<MechanicArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour générer un arrière-plan aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        // Remplacer par un appel API réel une fois créé
        // Simuler les données de l'article
        const mockArticle: MechanicArticle = {
          id: articleId,
          title: 'Introduction aux mécaniques',
          summary: 'Un aperçu des bases du système et comment il s\'intègre au monde du jeu.',
          content: `
            <h2>Découvrez les mécaniques fondamentales</h2>
            <p>Dans Afterlife, les mécaniques de jeu ont été conçues pour refléter la nature corrompue du Paradis. Chaque système contribue à l'immersion et à la profondeur de l'expérience.</p>
            <p>Ce système de base vous permettra de comprendre comment interagir avec le monde et ses habitants, qu'ils soient amicaux ou hostiles.</p>
            
            <h3>Principes fondamentaux</h3>
            <p>Le jeu est construit autour de trois principes fondamentaux qui guident toutes les mécaniques:</p>
            <ul>
              <li><strong>L'équilibre:</strong> Chaque action a une conséquence, positive ou négative.</li>
              <li><strong>La corruption:</strong> Le monde est imprégné d'une corruption qui affecte tous les aspects du gameplay.</li>
              <li><strong>La rédemption:</strong> Il est toujours possible de se racheter, mais le prix à payer peut être élevé.</li>
            </ul>
            
            <h3>Comment ça marche</h3>
            <p>Les joueurs doivent naviguer dans un système de compétences interconnectées qui évoluent en fonction des choix et des actions. Plus vous utilisez une compétence spécifique, plus elle devient efficace, mais cela peut aussi déverrouiller des voies de corruption ou de purification.</p>
            
            <p>Chaque mécanisme du jeu est soigneusement équilibré pour offrir une expérience immersive qui reflète la dualité du monde d'Afterlife - un paradis corrompu où l'espoir subsiste malgré les ténèbres omniprésentes.</p>
            
            <h3>Pour commencer</h3>
            <p>Nous recommandons aux nouveaux joueurs de se familiariser d'abord avec les bases du système de progression, puis d'explorer les mécaniques de combat et enfin les systèmes d'artisanat. Cette approche progressive vous permettra de maîtriser chaque aspect du jeu avant de vous plonger dans les défis plus complexes.</p>
          `,
          category,
          categoryName: {
            'combat': 'Combat',
            'progression': 'Progression',
            'crafting': 'Artisanat',
            'exploration': 'Exploration',
            'factions': 'Factions',
            'magic': 'Magie'
          }[category] || 'Inconnu',
          image: '/placeholder/mechanics-detail.jpg',
          createdAt: '2023-10-15T14:30:00Z',
          updatedAt: '2023-10-20T09:45:00Z',
          author: {
            name: 'Game Designer',
            image: '/placeholder/author.jpg'
          },
          relatedArticles: [
            {
              id: `${category}-2`,
              title: 'Compétences avancées',
              category
            },
            {
              id: `${category}-3`,
              title: 'Stratégies recommandées',
              category
            }
          ]
        };

        // Vérifier si l'article existe (simulé)
        if (articleId !== `${category}-1` && articleId !== `${category}-2` && articleId !== `${category}-3`) {
          throw new Error('Article non trouvé');
        }

        setArticle(mockArticle);
      } catch (error) {
        console.error('Erreur lors du chargement de l\'article:', error);
        setError((error as Error).message || 'Une erreur est survenue lors du chargement de l\'article');
      } finally {
        setLoading(false);
      }
    };

    if (category && articleId) {
      fetchArticle();
    }
  }, [category, articleId]);

  const backgroundClass = getBgClass();

  if (loading) {
    return (
      <div className="min-h-screen bg-medieval-900 text-medieval-parchment p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-medieval-800/70 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-medieval-800/70 rounded w-1/2 mb-8"></div>
            <div className="h-64 bg-medieval-800/70 rounded-lg mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-medieval-800/70 rounded w-full"></div>
              <div className="h-4 bg-medieval-800/70 rounded w-full"></div>
              <div className="h-4 bg-medieval-800/70 rounded w-3/4"></div>
              <div className="h-4 bg-medieval-800/70 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-medieval-900 text-medieval-parchment p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-title text-medieval-highlight mb-6">Article non trouvé</h1>
          <p className="mb-6">{error || 'L\'article que vous recherchez n\'existe pas.'}</p>
          <Link 
            href={`/mechanics/${category}`} 
            className="text-medieval-ethereal hover:text-medieval-highlight transition-colors font-title flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour à la liste des articles
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
      <div className="relative py-16 border-b border-medieval-ethereal/20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Link 
                href="/mechanics" 
                className="text-medieval-ethereal/80 hover:text-medieval-highlight transition-colors"
              >
                Mécaniques
              </Link>
              <span className="text-medieval-ethereal/50">/</span>
              <Link 
                href={`/mechanics/${category}`} 
                className="text-medieval-ethereal/80 hover:text-medieval-highlight transition-colors"
              >
                {article.categoryName}
              </Link>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-title font-bold text-medieval-highlight flame-effect">{article.title}</h1>
            <p className="text-xl text-medieval-parchment/90 font-body">{article.summary}</p>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-medieval-700/70 overflow-hidden relative">
                  {article.author.image ? (
                    <Image
                      src={article.author.image}
                      alt={article.author.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-medieval-ethereal">
                      {article.author.name[0]}
                    </div>
                  )}
                </div>
                <div>
                  <div className="text-medieval-parchment/90 font-body">{article.author.name}</div>
                  <div className="text-sm text-medieval-ethereal/70">
                    {new Date(article.updatedAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
              
              {session?.user && (session.user as any).role === 'ADMIN' && (
                <Link
                  href={`/admin/mechanics/${articleId}/edit`}
                  className="btn-medieval flex items-center rounded-md px-4 py-2 shadow-md hover:shadow-medieval-glow transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Modifier
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image principale */}
      {article.image && (
        <div className="relative py-8">
          <div className="max-w-5xl mx-auto px-4 md:px-8 relative z-10">
            <div className="glass-panel rounded-md border border-medieval-ethereal/20 overflow-hidden">
              <div className="aspect-[21/9] relative">
                <Image
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <div className="relative py-8">
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-3/4">
              <article className="glass-panel rounded-md border border-medieval-ethereal/20 p-6 md:p-8">
                <div className="prose prose-invert prose-lg max-w-none font-body prose-headings:font-title prose-headings:text-medieval-highlight prose-strong:text-medieval-ethereal">
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
              </article>
            </div>
            
            <div className="w-full md:w-1/4">
              <div className="sticky top-24">
                {article.relatedArticles && article.relatedArticles.length > 0 && (
                  <div className="glass-panel rounded-md border border-medieval-ethereal/20 p-6 mb-6">
                    <h3 className="text-xl font-title text-medieval-highlight mb-4">Articles liés</h3>
                    <ul className="space-y-3">
                      {article.relatedArticles.map((relatedArticle) => (
                        <li key={relatedArticle.id}>
                          <Link
                            href={`/mechanics/${relatedArticle.category}/${relatedArticle.id}`}
                            className="text-medieval-ethereal hover:text-medieval-highlight transition-colors block hover:translate-x-1 transform duration-200"
                          >
                            {relatedArticle.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                <div className="glass-panel rounded-md border border-medieval-ethereal/20 p-6">
                  <h3 className="text-xl font-title text-medieval-highlight mb-4">Catégories</h3>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/mechanics/combat"
                        className={`text-medieval-parchment/80 hover:text-medieval-highlight transition-colors flex items-center ${category === 'combat' ? 'text-medieval-highlight font-medium' : ''}`}
                      >
                        <span className="w-1.5 h-1.5 bg-medieval-highlight rounded-full mr-2"></span>
                        Combat
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/mechanics/progression"
                        className={`text-medieval-parchment/80 hover:text-medieval-highlight transition-colors flex items-center ${category === 'progression' ? 'text-medieval-highlight font-medium' : ''}`}
                      >
                        <span className="w-1.5 h-1.5 bg-medieval-highlight rounded-full mr-2"></span>
                        Progression
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/mechanics/crafting"
                        className={`text-medieval-parchment/80 hover:text-medieval-highlight transition-colors flex items-center ${category === 'crafting' ? 'text-medieval-highlight font-medium' : ''}`}
                      >
                        <span className="w-1.5 h-1.5 bg-medieval-highlight rounded-full mr-2"></span>
                        Artisanat
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/mechanics/exploration"
                        className={`text-medieval-parchment/80 hover:text-medieval-highlight transition-colors flex items-center ${category === 'exploration' ? 'text-medieval-highlight font-medium' : ''}`}
                      >
                        <span className="w-1.5 h-1.5 bg-medieval-highlight rounded-full mr-2"></span>
                        Exploration
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/mechanics/factions"
                        className={`text-medieval-parchment/80 hover:text-medieval-highlight transition-colors flex items-center ${category === 'factions' ? 'text-medieval-highlight font-medium' : ''}`}
                      >
                        <span className="w-1.5 h-1.5 bg-medieval-highlight rounded-full mr-2"></span>
                        Factions
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/mechanics/magic"
                        className={`text-medieval-parchment/80 hover:text-medieval-highlight transition-colors flex items-center ${category === 'magic' ? 'text-medieval-highlight font-medium' : ''}`}
                      >
                        <span className="w-1.5 h-1.5 bg-medieval-highlight rounded-full mr-2"></span>
                        Magie
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation entre articles */}
      <div className="relative py-8 border-t border-medieval-ethereal/20">
        <div className="max-w-4xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex justify-between">
            <Link
              href={`/mechanics/${category}`}
              className="btn-medieval flex items-center rounded-md px-4 py-2 shadow-md hover:shadow-medieval-glow transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 