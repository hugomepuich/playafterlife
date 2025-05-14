'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function WikiPage() {
  const [randomBg, setRandomBg] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Activer l'animation de chargement
    setIsLoaded(true);
    
    // Liste des images de fond disponibles
    const backgrounds = [
      '/backgrounds/HighresScreenshot00018.png',
      '/backgrounds/HighresScreenshot00021.png',
      '/backgrounds/HighresScreenshot00017.png'
    ];
    
    // Sélectionner une image aléatoire
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setRandomBg(backgrounds[randomIndex]);
  }, []);

  const sections = [
    {
      title: 'Personnages',
      description: 'Découvrez les héros, les antagonistes et les figures emblématiques qui façonnent l\'univers d\'Afterlife',
      href: '/wiki/characters',
      icon: '/images/character-icon.svg',
      bgClass: 'bg-gradient-to-br from-medieval-800/80 to-medieval-900/80'
    },
    {
      title: 'Lieux',
      description: 'Explorez les terres mystérieuses, les cités anciennes et les donjons qui composent le monde d\'Afterlife',
      href: '/wiki/locations',
      icon: '/images/location-icon.svg',
      bgClass: 'bg-gradient-to-br from-medieval-900/80 to-medieval-800/80'
    },
    {
      title: 'Objets & Artefacts',
      description: 'Apprenez sur les armes légendaires, les objets magiques et les équipements uniques du jeu',
      href: '/wiki/items',
      icon: '/images/item-icon.svg',
      bgClass: 'bg-gradient-to-br from-medieval-800/80 to-medieval-900/80'
    },
    {
      title: 'Histoire & Lore',
      description: 'Plongez dans l\'histoire riche, les mythes anciens et les légendes qui constituent le passé du monde',
      href: '/wiki/lore',
      icon: '/images/lore-icon.svg',
      bgClass: 'bg-gradient-to-br from-medieval-900/80 to-medieval-800/80'
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Header avec fond d'image */}
      <div className="relative py-20 mb-12">
        {randomBg && (
          <div className="absolute inset-0 z-0">
            <Image
              src={randomBg}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/80 to-medieval-900/100"></div>
          </div>
        )}
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`max-w-4xl mx-auto transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center">
              <h1 className="text-5xl md:text-6xl font-title font-bold mb-6 text-white flame-effect">Le Codex d'Afterlife</h1>
              <p className="text-xl text-gray-300">
                Explorez les secrets et les connaissances de notre univers médiéval dark fantasy
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <Link
              key={section.title}
              href={section.href}
              className={`${section.bgClass} rounded-lg overflow-hidden shadow-lg border border-gray-700/30 transform transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:border-gray-600/50 group`}
            >
              <div className="p-8 relative">
                {/* Coins décoratifs */}
                <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-400/30"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-400/30"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-400/30"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-400/30"></div>
                
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 flex items-center justify-center rounded-full bg-medieval-900/60 border border-gray-700/50 shadow-inner group-hover:shadow-medieval-glow transition-all">
                    <svg 
                      className="w-8 h-8 text-medieval-highlight"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      {index === 0 && (
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                      )}
                      {index === 1 && (
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                      )}
                      {index === 2 && (
                        <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                      )}
                      {index === 3 && (
                        <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
                      )}
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-title font-bold mb-3 text-white group-hover:text-medieval-highlight transition-colors">
                      {section.title}
                    </h2>
                    <p className="text-gray-300">
                      {section.description}
                    </p>
                    
                    <div className="mt-4 text-medieval-highlight/60 group-hover:text-medieval-highlight text-sm flex items-center transition-colors">
                      Explorer
                      <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Section Contribuer */}
        <div className="mt-16 p-8 rounded-lg glass-panel border border-gray-700/30">
          <h2 className="text-3xl font-title font-bold mb-4 text-white engraved-text">Contribuer au Codex</h2>
          <p className="text-gray-300 mb-6">
            Le Codex d'Afterlife est un projet communautaire en constante évolution. Connectez-vous pour 
            ajouter ou modifier du contenu et aider à enrichir notre base de connaissances collective.
          </p>
          <Link href="/auth/login" className="btn-medieval inline-flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
            </svg>
            Se connecter pour contribuer
          </Link>
        </div>
      </div>
    </div>
  );
} 