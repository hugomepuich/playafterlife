'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [backgroundClass, setBackgroundClass] = useState('bg-bg-1');

  // Fonction pour générer un arrière-plan aléatoire
  useEffect(() => {
    const getBgClass = () => {
      const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
      const randomIndex = Math.floor(Math.random() * bgClasses.length);
      return bgClasses[randomIndex];
    };
    
    setBackgroundClass(getBgClass());
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
    if (!session?.user || (session.user as any).role !== 'ADMIN') {
      router.push('/');
    }
  }, [status, router, session]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-medieval-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medieval-highlight"></div>
      </div>
    );
  }

  const adminModules = [
    {
      title: 'Devblog',
      description: 'Créer et gérer des articles du devblog',
      icon: '📝',
      href: '/admin/devblog',
    },
    {
      title: 'Personnages',
      description: 'Créer et gérer des personnages dans le wiki',
      icon: '👥',
      href: '/admin/characters',
    },
    {
      title: 'Mécaniques de jeu',
      description: 'Créer et gérer des articles sur les mécaniques de jeu',
      icon: '🎮',
      href: '/admin/mechanics',
    },
    {
      title: 'Lieux',
      description: 'Gérer les lieux et régions du monde',
      icon: '🗺️',
      href: '/admin/locations',
    },
    {
      title: 'Objets',
      description: 'Gérer les objets et artefacts',
      icon: '⚔️',
      href: '/admin/items',
    },
  ];

  return (
    <div className="min-h-screen bg-medieval-900 text-medieval-parchment relative">
      {/* Arrière-plan avec image aléatoire et superposition */}
      <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-medieval-900/95 via-medieval-900/85 to-medieval-900/95"></div>
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-title font-bold mb-2 text-medieval-highlight flame-effect">Throne Room</h1>
          <p className="text-medieval-parchment/80 mb-8 font-body">
            Bienvenue dans le panneau d'administration d'Afterlife
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {adminModules.map((module) => (
              <Link
                key={module.title}
                href={module.href}
                className="glass-panel rounded-lg p-6 border border-medieval-ethereal/20 hover:border-medieval-highlight/40 hover:shadow-medieval-glow transition-all group"
              >
                <div className="flex items-start gap-4">
                  <div className="text-4xl group-hover:scale-110 transition-transform">
                    {module.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-title font-bold mb-2 text-medieval-highlight">{module.title}</h2>
                    <p className="text-medieval-parchment/80 font-body">{module.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="glass-panel p-6 rounded-lg border border-medieval-ethereal/20">
            <h2 className="text-2xl font-title font-bold mb-4 text-medieval-highlight">Statistiques</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-medieval-700/50 p-4 rounded-lg">
                <p className="text-medieval-parchment/70 text-sm font-title">Nombre d'articles</p>
                <p className="text-2xl font-bold text-medieval-ethereal">--</p>
              </div>
              <div className="bg-medieval-700/50 p-4 rounded-lg">
                <p className="text-medieval-parchment/70 text-sm font-title">Personnages</p>
                <p className="text-2xl font-bold text-medieval-ethereal">--</p>
              </div>
              <div className="bg-medieval-700/50 p-4 rounded-lg">
                <p className="text-medieval-parchment/70 text-sm font-title">Lieux</p>
                <p className="text-2xl font-bold text-medieval-ethereal">--</p>
              </div>
              <div className="bg-medieval-700/50 p-4 rounded-lg">
                <p className="text-medieval-parchment/70 text-sm font-title">Utilisateurs</p>
                <p className="text-2xl font-bold text-medieval-ethereal">--</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 