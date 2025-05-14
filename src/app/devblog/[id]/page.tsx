import { PrismaClient } from '@prisma/client';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const prisma = new PrismaClient();

async function getPost(id: string) {
  const post = await prisma.devblogPost.findUnique({
    where: {
      id,
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  });

  if (!post) {
    notFound();
  }

  return post;
}

// Fonction pour générer un arrière-plan aléatoire
function getBgClass() {
  const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
  const randomIndex = Math.floor(Math.random() * bgClasses.length);
  return bgClasses[randomIndex];
}

export default async function DevblogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const post = await getPost(params.id);
  const backgroundClass = getBgClass();

  // Extraire la première image du contenu HTML si elle existe
  const imageMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
  const imageUrl = imageMatch ? imageMatch[1] : null;
  
  // Formater la date
  const formattedDate = new Date(post.createdAt).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <article className="min-h-screen bg-black/90 text-gray-300 relative">
      {/* Background fixed image */}
      <div className="fixed inset-0 z-0">
        <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/70"></div>
      </div>

      {/* Header with article title and meta */}
      <div className="relative py-16 border-b border-gray-100/50 z-10 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center">
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={post.title}
                fill
                className="object-cover opacity-60"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70"></div>
            </>
          ) : (
            <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center opacity-40`}></div>
          )}
          <div className="absolute inset-0 vignette-effect-intense pointer-events-none"></div>
          <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-[0.05] mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex items-center mb-8">
            <Link href="/devblog" className="flex items-center text-gray-400 hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-title">Retour au Devblog</span>
            </Link>
          </div>
          
          <div className="fade-in py-4">
            <h1 className="text-4xl md:text-5xl font-title font-bold mb-4 text-white flame-effect-intense drop-shadow-lg">{post.title}</h1>
            
            <div className="flex items-center text-gray-400 mb-6">
              <span className="font-body">{formattedDate}</span>
              <span className="mx-3">•</span>
              <span className="font-body">Par {post.author.name}</span>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-8">
              {JSON.parse(post.tags).map((tag: string) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm bg-black/80 text-gray-300 border border-gray-700/50 rounded-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-8 md:py-12 relative z-10">
        <div className="bg-black/80 p-6 md:p-8 border border-gray-300/40 relative fade-in">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gray-200 animated-border-glow"></div>
          <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gray-200 animated-border-glow"></div>
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gray-200 animated-border-glow"></div>
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gray-200 animated-border-glow"></div>
          
          <div className="prose prose-invert prose-lg max-w-none prose-headings:font-title prose-headings:text-white prose-p:text-gray-300 font-body bg-black/80 p-4 md:p-6 border border-gray-300/30 relative">
            <div className="absolute inset-0 bg-[url('/images/parchment-texture.jpg')] bg-cover opacity-5 mix-blend-overlay"></div>
            <div className="relative z-10">
              <div dangerouslySetInnerHTML={{ __html: post.content }} />
            </div>
          </div>
        </div>

        {/* Back link at the bottom */}
        <div className="mt-8 text-center">
          <Link
            href="/devblog"
            className="btn-medieval px-5 py-2.5 animated-border-glow inline-block"
          >
            Retour à la liste des articles
          </Link>
        </div>
      </div>
    </article>
  );
} 