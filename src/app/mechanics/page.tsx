'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MechanicCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  count?: number;
}

export default function MechanicsPage() {
  const [categories, setCategories] = useState<MechanicCategory[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour générer un arrière-plan aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Remplacer par un appel API réel une fois créé
        const mockCategories: MechanicCategory[] = [
          {
            id: 'combat',
            name: 'Combat',
            description: 'Découvrez le système de combat dynamique et stratégique d\'Afterlife.',
            icon: 'swords',
            count: 4
          },
          {
            id: 'progression',
            name: 'Progression',
            description: 'Explorez comment votre personnage évolue à travers le monde corrompu d\'Afterlife.',
            icon: 'level-up',
            count: 3
          },
          {
            id: 'crafting',
            name: 'Artisanat',
            description: 'Maîtrisez l\'art de créer et d\'améliorer des objets dans un monde en ruines.',
            icon: 'anvil',
            count: 5
          },
          {
            id: 'exploration',
            name: 'Exploration',
            description: 'Naviguez à travers les terres désolées et découvrez des secrets oubliés.',
            icon: 'map',
            count: 7
          },
          {
            id: 'factions',
            name: 'Factions',
            description: 'Interagissez avec les différentes factions qui luttent pour le contrôle du Paradis corrompu.',
            icon: 'flag',
            count: 3
          },
          {
            id: 'magic',
            name: 'Magie',
            description: 'Apprenez les mystères des pouvoirs magiques qui persistent dans ce monde brisé.',
            icon: 'wand',
            count: 6
          }
        ];
        setCategories(mockCategories);
      } catch (error) {
        console.error('Erreur lors du chargement des catégories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const backgroundClass = getBgClass();

  const getIconPath = (iconName: string) => {
    const iconMap: Record<string, string> = {
      'swords': '/icons/swords.svg',
      'level-up': '/icons/level-up.svg',
      'anvil': '/icons/anvil.svg',
      'map': '/icons/map.svg',
      'flag': '/icons/flag.svg',
      'wand': '/icons/wand.svg'
    };
    
    return iconMap[iconName] || '/icons/default.svg';
  };

  return (
    <div className="min-h-screen bg-medieval-900 text-medieval-parchment relative">
      {/* Arrière-plan avec image aléatoire et superposition */}
      <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-medieval-900/95 via-medieval-900/85 to-medieval-900/95"></div>
      
      {/* En-tête */}
      <div className="relative py-16 mb-8 border-b border-medieval-ethereal/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-5xl md:text-6xl font-title font-bold mb-3 text-medieval-highlight flame-effect">Game Mechanics</h1>
            <p className="text-medieval-parchment/90 font-body text-lg">
              Explorez les systèmes et mécaniques qui font d'Afterlife une expérience unique. Plongez dans les détails du gameplay et maîtrisez chaque aspect du jeu.
            </p>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 pb-16 relative z-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="glass-panel animate-pulse h-64 rounded-md border border-medieval-ethereal/20 p-6">
                <div className="h-12 w-12 mb-4 rounded-full bg-medieval-700/70"></div>
                <div className="h-6 bg-medieval-700/70 rounded-md w-1/2 mb-3"></div>
                <div className="h-4 bg-medieval-700/70 rounded-md w-full mb-2"></div>
                <div className="h-4 bg-medieval-700/70 rounded-md w-3/4"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {categories.map((category) => (
              <Link 
                href={`/mechanics/${category.id}`} 
                key={category.id}
                className="glass-panel rounded-md border border-medieval-ethereal/20 p-6 hover:border-medieval-highlight/40 hover:shadow-medieval-glow transition-all h-full flex flex-col"
              >
                <div className="mb-4 bg-medieval-700/50 w-16 h-16 rounded-full flex items-center justify-center">
                  <svg className="w-8 h-8 text-medieval-highlight" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 18a6 6 0 100-12 6 6 0 000 12z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 14a2 2 0 100-4 2 2 0 000 4z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-xl font-title text-medieval-highlight mb-2">{category.name}</h2>
                <p className="text-medieval-parchment/80 font-body mb-4 flex-grow">{category.description}</p>
                <div className="flex justify-between items-center mt-auto pt-4 border-t border-medieval-ethereal/10">
                  <span className="text-sm text-medieval-ethereal">{category.count} articles</span>
                  <span className="text-medieval-highlight flex items-center text-sm">
                    Explorer
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 