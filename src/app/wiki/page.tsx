'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function UniversePage() {
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

    // Initialiser AOS
    AOS.init({
      duration: 800,
      once: false,
      offset: 100,
      easing: 'ease-in-out',
      delay: 0,
    });
  }, []);

  const categories = [
    {
      title: 'Characters',
      description: 'Discover the heroes, allies, and darker figures whose destinies intertwine in the world of Afterlife',
      href: '/wiki/characters',
      icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z',
      bgImage: '/backgrounds/HighresScreenshot00082.png',
      delay: 0
    },
    {
      title: 'Places',
      description: 'Explore the fallen kingdoms, ancient sanctuaries, and cursed lands that await your discovery',
      href: '/wiki/places',
      icon: 'M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z',
      bgImage: '/backgrounds/HighresScreenshot00017.png',
      delay: 100
    },
    {
      title: 'Races',
      description: 'Learn about the diverse peoples that inhabit this realm, each with their own history and secrets',
      href: '/wiki/races',
      icon: 'M9 11.75c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zm6 0c-.69 0-1.25.56-1.25 1.25s.56 1.25 1.25 1.25 1.25-.56 1.25-1.25-.56-1.25-1.25-1.25zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8 0-.29.02-.58.05-.86 2.36-1.05 4.23-2.98 5.21-5.37C11.07 8.33 14.05 10 17.42 10c.78 0 1.53-.09 2.25-.26.21.71.33 1.47.33 2.26 0 4.41-3.59 8-8 8z',
      bgImage: '/backgrounds/HighresScreenshot00021.png',
      delay: 200
    },
    {
      title: 'Stories',
      description: 'Uncover the myths, legends, and forgotten tales that shaped the world of Afterlife',
      href: '/wiki/stories',
      icon: 'M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z',
      bgImage: '/backgrounds/HighresScreenshot00018.png',
      delay: 300
    },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden bg-black">
      {/* Hero Header avec fond d'image */}
      <section className="relative py-28 md:py-32 mb-16">
        {randomBg && (
          <div className="absolute inset-0 z-0">
            <Image
              src={randomBg}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
          </div>
        )}
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`max-w-4xl mx-auto transition-all duration-700 transform ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="text-center">
              <h1 className="text-5xl md:text-7xl font-title font-bold mb-6 text-white flame-effect">
                Universe of Afterlife
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
                Explore the world beyond life, where gods have abandoned their creations and darkness festers in forgotten corners
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-20">
          {categories.map((category, index) => (
            <Link
              key={category.title}
              href={category.href}
              className="block group"
              data-aos="fade-up"
              data-aos-delay={category.delay}
            >
              <div className="overflow-hidden rounded-lg glass-panel border border-gray-700/30 hover:border-gray-600/50 transition-all duration-500 shadow-lg hover:shadow-xl">
                <div className="relative h-60 overflow-hidden">
                  <Image 
                    src={category.bgImage} 
                    alt={category.title} 
                    fill 
                    className="object-cover transform group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/80"></div>
                  <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full bg-black/60 border border-gray-600/30 flex items-center justify-center group-hover:shadow-medieval-glow transition-all duration-500">
                      <svg 
                        className="w-10 h-10 text-medieval-highlight"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d={category.icon} />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-2xl font-title font-bold text-white group-hover:text-medieval-highlight transition-colors">
                      {category.title}
                    </h2>
                    <div className="w-10 h-10 rounded-full bg-black/60 border border-gray-700/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-medieval-highlight group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-gray-300">
                    {category.description}
                  </p>
                  
                  <div className="mt-4 text-medieval-highlight/60 group-hover:text-medieval-highlight text-sm flex items-center transition-colors">
                    Explore
                    <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Section Contribuer */}
        <div className="relative rounded-lg overflow-hidden" data-aos="fade-up" data-aos-delay="400">
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-[0.05] mix-blend-overlay"></div>
          </div>
          
          <div className="p-10 glass-panel border border-gray-700/30 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-title font-bold mb-6 text-white flame-effect">Contribute to the Universe</h2>
              <p className="text-lg text-gray-300 mb-8">
                The Universe of Afterlife is an evolving world. Sign in to add or modify content and help enrich our collective knowledge of this dark fantasy realm.
              </p>
              <Link href="/auth/login" className="btn-medieval inline-flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
                Sign in to contribute
              </Link>
            </div>
            
            {/* Coins décoratifs */}
            <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-gray-400/30"></div>
            <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-gray-400/30"></div>
            <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-gray-400/30"></div>
            <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-gray-400/30"></div>
          </div>
        </div>
      </section>
    </div>
  );
} 