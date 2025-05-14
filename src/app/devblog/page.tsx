import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import Image from 'next/image';

const prisma = new PrismaClient();

// Définir le type pour les posts incluant les détails de l'auteur
interface PostWithAuthor {
  id: string;
  title: string;
  content: string;
  excerpt?: string; // Champ optionnel
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  authorId: string;
  tags: string;
  author?: {
    name: string | null;
  };
}

async function getPosts() {
  const posts = await prisma.devblogPost.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  return posts as PostWithAuthor[];
}

export default async function DevblogPage() {
  const posts = await getPosts();
  const featuredPost = posts.length > 0 ? posts[0] : null;
  const regularPosts = posts.length > 1 ? posts.slice(1) : [];

  // Extraire la première image du contenu HTML
  const extractFirstImage = (content: string) => {
    const imageMatch = content.match(/<img[^>]+src="([^">]+)"/);
    return imageMatch ? imageMatch[1] : null;
  };

  return (
    <div className="min-h-screen relative">
      {/* Header avec titre de section */}
      <div className="relative py-20 mb-12 bg-medieval-900">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 bg-[url('/backgrounds/HighresScreenshot00091.png')] bg-cover bg-center opacity-20 grayscale"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-medieval-900/100"></div>
        <div className="absolute inset-0 vignette-effect-intense pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-title font-bold mb-6 text-white flame-effect">Devblog</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Suivez le développement d'Afterlife et découvrez les coulisses de la création du jeu
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-20">
        {/* Article à la une */}
        {featuredPost && (
          <div className="mb-16">
            <h2 className="text-3xl font-title font-bold mb-8 text-white inline-block border-b-2 border-medieval-highlight/30 pb-2">
              Dernière mise à jour
            </h2>
            
            <Link href={`/devblog/${featuredPost.id}`} className="group">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-medieval-800/50 rounded-lg p-6 border border-gray-700/30 hover:border-gray-600/40 transition-all shadow-lg hover:shadow-xl">
                <div className="relative h-80 rounded-lg overflow-hidden shadow-md">
                  {extractFirstImage(featuredPost.content) ? (
                    <>
                      <Image
                        src={extractFirstImage(featuredPost.content) as string}
                        alt={featuredPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-medieval-800 to-medieval-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 14h14" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="text-2xl md:text-3xl font-title font-bold mb-4 text-white group-hover:text-medieval-highlight transition-colors">
                      {featuredPost.title}
                    </h3>
                    
                    <div className="flex items-center mb-4 text-sm text-gray-400">
                      <div className="flex items-center">
                        <div className="w-7 h-7 rounded-full bg-medieval-700 flex items-center justify-center text-gray-300 mr-2">
                          {featuredPost.author?.name?.[0] || 'A'}
                        </div>
                        <span>{featuredPost.author?.name || 'Auteur inconnu'}</span>
                      </div>
                      <span className="mx-2">•</span>
                      <span>{new Date(featuredPost.createdAt).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                      })}</span>
                    </div>
                    
                    <div className="text-gray-300 line-clamp-3 mb-4">
                      {featuredPost.excerpt || featuredPost.content.replace(/<[^>]*>/g, '').substring(0, 180) + '...'}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {JSON.parse(featuredPost.tags).map((tag: string) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 text-xs bg-medieval-900/80 text-gray-300 border border-gray-700/50 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <span className="text-medieval-highlight/80 group-hover:text-medieval-highlight inline-flex items-center transition-colors text-sm font-title">
                      Lire l'article complet
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Articles réguliers */}
        <div className="mb-12">
          <h2 className="text-2xl font-title font-bold mb-8 text-white inline-block border-b-2 border-medieval-highlight/30 pb-2">
            Tous les articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <Link
                key={post.id}
                href={`/devblog/${post.id}`}
                className="group bg-medieval-800/30 rounded-lg overflow-hidden border border-gray-700/30 hover:border-gray-600/40 transition-all shadow-md hover:shadow-lg"
              >
                {/* Cadre décoratif */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-500/20 rounded-tl-lg"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-500/20 rounded-tr-lg"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-500/20 rounded-bl-lg"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-500/20 rounded-br-lg"></div>
                
                <div className="relative h-48 bg-medieval-900/50">
                  {extractFirstImage(post.content) ? (
                    <>
                      <Image
                        src={extractFirstImage(post.content) as string}
                        alt={post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-medieval-800 to-medieval-900">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5M5 14h14" />
                      </svg>
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-center text-xs text-gray-400 mb-2">
                    <span>{new Date(post.createdAt).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}</span>
                  </div>
                  
                  <h3 className="text-xl font-title font-bold mb-3 text-white group-hover:text-medieval-highlight transition-colors">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                    {post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...'}
                  </p>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-6 h-6 rounded-full bg-medieval-700 flex items-center justify-center text-gray-300 text-xs">
                        {post.author?.name?.[0] || 'A'}
                      </div>
                      <span className="text-xs text-gray-400 ml-2">{post.author?.name || 'Auteur inconnu'}</span>
                    </div>
                    
                    <span className="text-medieval-highlight/70 group-hover:text-medieval-highlight text-xs flex items-center transition-colors">
                      Lire
                      <svg className="ml-1 w-3 h-3 group-hover:translate-x-0.5 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* Appel à l'action */}
        <div className="bg-medieval-900/80 border border-gray-700/30 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-title font-bold mb-4 text-white">Restez informé du développement</h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Suivez-nous pour ne manquer aucune mise à jour concernant le développement d'Afterlife.
            Découvrez les nouveautés, les fonctionnalités à venir et les coulisses de la création du jeu.
          </p>
          <Link href="/wiki" className="btn-medieval inline-block">
            Explorer le jeu
          </Link>
        </div>
      </div>
    </div>
  );
} 