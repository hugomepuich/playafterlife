"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [randomBg, setRandomBg] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  useEffect(() => {
    // Activer l'animation après le chargement
    setIsVisible(true);
    
    // Liste des images de fond disponibles
    const backgrounds = [
      '/backgrounds/HighresScreenshot00097.png',
      '/backgrounds/HighresScreenshot00091.png',
      '/backgrounds/HighresScreenshot00082.png',
      '/backgrounds/HighresScreenshot00018.png',
      '/backgrounds/HighresScreenshot00021.png',
      '/backgrounds/HighresScreenshot00017.png'
    ];
    
    // Sélectionner une image aléatoire
    const randomIndex = Math.floor(Math.random() * backgrounds.length);
    setRandomBg(backgrounds[randomIndex]);
  }, []);

  // Features du jeu
  const gameFeatures = [
    {
      title: "Monde immersif", 
      description: "Explorez un univers dark fantasy médiéval aux secrets envoûtants et aux paysages captivants.",
      icon: "🗺️"
    },
    {
      title: "Combats tactiques", 
      description: "Maîtrisez un système de combat stratégique où chaque décision influence votre survie.",
      icon: "⚔️"
    },
    {
      title: "Narration riche", 
      description: "Découvrez une histoire profonde et des personnages complexes dans un monde en évolution.",
      icon: "📜"
    },
    {
      title: "Progression unique", 
      description: "Développez votre personnage selon votre style de jeu à travers des choix significatifs.",
      icon: "🔮"
    }
  ];

  return (
    <div className="relative overflow-x-hidden">
      {/* Section héro avec vidéo/image de fond */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Fond dynamique */}
        {randomBg && (
          <div className="absolute inset-0 z-0">
            <Image
              src={randomBg}
              alt="Afterlife background"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
          </div>
        )}
        
        {/* Contenu principal héro */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

            
            <h1 className="font-title text-5xl sm:text-6xl md:text-7xl font-bold mb-4 text-white tracking-wider">
              <span className="block flame-effect">AFTERLIFE</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              What lies beyond death is yet for you to discover
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#game-overview" className="btn-medieval text-lg px-8 py-4 flex items-center justify-center">
                <span>Discover the project</span>
                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
              </a>
              <Link href="/devblog" className="btn-medieval-secondary text-lg px-8 py-4 flex items-center justify-center">
                <span>Follow the journey</span>
                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Flèche de défilement */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </section>
      
      {/* Section Aperçu du jeu */}
      <section id="game-overview" className="py-16 md:py-24 bg-medieval-900 relative">
        <div className="absolute inset-0 bg-[url('/images/stone-texture.jpg')] bg-repeat opacity-5 pointer-events-none"></div>
        
        {/* Fond d'image qui prend la moitié gauche */}
        <div className="absolute left-0 top-0 bottom-0 w-full md:w-1/2 overflow-hidden">
          <div className="relative w-full h-full">
            <Image 
              src="/backgrounds/HighresScreenshot00082.png" 
              alt="Afterlife gameplay" 
              fill 
              className="object-cover"
              priority
            />
            {/* Nouveau gradient de fondu plus marqué */}
            <div className="absolute inset-0 md:bg-gradient-to-r md:from-transparent md:via-medieval-900/80 md:to-medieval-900 pointer-events-none"></div>
            {/* Overlay pour mobile */}
            <div className="absolute inset-0 md:hidden bg-medieval-900/70"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Première colonne vide pour laisser place à l'image en background */}
            <div className="hidden md:block"></div>
            
            {/* Titre et contenu textuel dans la seconde colonne */}
            <div className="space-y-8 relative z-10 text-right">
              <div>
                <h2 className="text-3xl md:text-4xl font-title font-bold mb-4 text-white flame-effect">Embrace your eternity</h2>
                <p className="text-lg text-gray-300">
                  Afterlife is a dark fantasy RPG, where you will uncover the tragedy that took place in the world of the dead.
                </p>
              </div>
              
              <div className="space-y-6">
                <h3 className="text-2xl md:text-3xl font-title font-bold text-white">Un monde à explorer</h3>
                <p className="text-gray-300">
                  Parcourez des terres vastes et diversifiées, des forêts mystiques aux cités fortifiées en ruines. 
                  Chaque lieu recèle son lot de défis, de trésors et de secrets à découvrir.
                </p>
                <h3 className="text-2xl md:text-3xl font-title font-bold text-white">Une histoire captivante</h3>
                <p className="text-gray-300">
                  Plongez dans une narration riche et complexe où vos choix influencent le déroulement de l'histoire. 
                  Rencontrez des personnages mémorables dont les destins s'entremêlent avec le vôtre.
                </p>
                <div className="pt-4">
                  <Link href="/wiki" className="btn-medieval-secondary">
                    Explorer le codex
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Caractéristiques */}
      <section className="py-16 md:py-24 bg-medieval-800 relative">
        <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-[0.05] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-title font-bold mb-6 text-white flame-effect">CARACTÉRISTIQUES DU JEU</h2>
            <p className="text-lg text-gray-300">
              Découvrez ce qui rend Afterlife unique et immersif
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {gameFeatures.map((feature, index) => (
              <div key={index} className="bg-medieval-900/80 p-6 rounded-lg glass-panel border border-gray-700/30 hover:border-gray-600/40 transition-all">
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-title font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Section Devblog et Wiki */}
      <section className="py-16 md:py-24 bg-medieval-900 relative">
        <div className="absolute inset-0 bg-[url('/images/stone-texture.jpg')] bg-repeat opacity-5 pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Devblog */}
            <div>
              <h2 className="text-3xl font-title font-bold mb-6 text-white flame-effect">DEVBLOG</h2>
              <p className="text-lg text-gray-300 mb-6">
                Suivez le développement du jeu et découvrez les coulisses de sa création. Nous partageons régulièrement 
                des articles sur l'avancement du projet, les décisions de design et les défis rencontrés.
              </p>
              <Link href="/devblog" className="btn-medieval">
                Lire le devblog
              </Link>
            </div>
            
            {/* Wiki/Codex */}
            <div>
              <h2 className="text-3xl font-title font-bold mb-6 text-white flame-effect">CODEX</h2>
              <p className="text-lg text-gray-300 mb-6">
                Explorez l'univers d'Afterlife à travers notre wiki détaillé. Découvrez les personnages, les lieux, 
                les objets et l'histoire riche qui constituent le monde du jeu.
              </p>
              <Link href="/wiki" className="btn-medieval">
                Explorer le codex
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Suivez le développement */}
      <section className="py-16 md:py-24 bg-medieval-800 relative">
        <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-[0.05] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-title font-bold mb-6 text-white flame-effect">SUIVEZ LE DÉVELOPPEMENT</h2>
            <p className="text-lg text-gray-300">
              Restez informé de l'avancement du projet et plongez au cœur de l'univers d'Afterlife
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Roadmap */}
            <div className="bg-medieval-900/70 rounded-lg overflow-hidden border border-gray-700/30 group hover:border-gray-600/50 transition-all shadow-lg hover:shadow-xl">
              <div className="relative h-52">
                <Image 
                  src="/backgrounds/HighresScreenshot00018.png" 
                  alt="Roadmap" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                <div className="absolute bottom-0 p-5">
                  <div className="w-12 h-12 rounded-full bg-medieval-800/90 border border-medieval-highlight/30 flex items-center justify-center text-2xl mb-3">
                    🗺️
                  </div>
                  <h3 className="text-2xl font-title font-bold text-white">Roadmap</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-300 mb-4">
                  Découvrez les fonctionnalités prévues et suivez l'évolution du développement d'Afterlife.
                </p>
                <Link href="/devblog/roadmap" className="inline-flex items-center text-medieval-highlight/90 hover:text-medieval-highlight transition-colors">
                  <span>Voir la roadmap</span>
                  <svg className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Galerie */}
            <div className="bg-medieval-900/70 rounded-lg overflow-hidden border border-gray-700/30 group hover:border-gray-600/50 transition-all shadow-lg hover:shadow-xl">
              <div className="relative h-52">
                <Image 
                  src="/backgrounds/HighresScreenshot00017.png" 
                  alt="Galerie" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                <div className="absolute bottom-0 p-5">
                  <div className="w-12 h-12 rounded-full bg-medieval-800/90 border border-medieval-highlight/30 flex items-center justify-center text-2xl mb-3">
                    🖼️
                  </div>
                  <h3 className="text-2xl font-title font-bold text-white">Galerie</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-300 mb-4">
                  Explorez les visuels du jeu avec notre collection d'images, artworks et captures d'écran.
                </p>
                <Link href="/galerie" className="inline-flex items-center text-medieval-highlight/90 hover:text-medieval-highlight transition-colors">
                  <span>Voir la galerie</span>
                  <svg className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* FAQ */}
            <div className="bg-medieval-900/70 rounded-lg overflow-hidden border border-gray-700/30 group hover:border-gray-600/50 transition-all shadow-lg hover:shadow-xl">
              <div className="relative h-52">
                <Image 
                  src="/backgrounds/HighresScreenshot00021.png" 
                  alt="FAQ" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent"></div>
                <div className="absolute bottom-0 p-5">
                  <div className="w-12 h-12 rounded-full bg-medieval-800/90 border border-medieval-highlight/30 flex items-center justify-center text-2xl mb-3">
                    ❓
                  </div>
                  <h3 className="text-2xl font-title font-bold text-white">FAQ</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-300 mb-4">
                  Trouvez les réponses à vos questions sur le jeu, son univers et son développement.
                </p>
                <Link href="/faq" className="inline-flex items-center text-medieval-highlight/90 hover:text-medieval-highlight transition-colors">
                  <span>Voir les questions fréquentes</span>
                  <svg className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section Personnages */}
      <section className="py-16 md:py-24 bg-medieval-800 relative">
        <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-[0.05] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-title font-bold mb-6 text-white flame-effect">RENCONTREZ LES PERSONNAGES</h2>
            <p className="text-lg text-gray-300 mb-8">
              Découvrez les protagonistes et antagonistes qui peuplent le monde d'Afterlife
            </p>
            <Link href="/wiki/characters" className="btn-medieval inline-flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
              Voir tous les personnages
            </Link>
          </div>
        </div>
      </section>
      
      {/* Section CTA */}
      <section className="py-16 bg-medieval-900 relative">
        <div className="absolute inset-0 bg-[url('/images/stone-texture.jpg')] bg-repeat opacity-5 pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-title font-bold mb-6 text-white flame-effect">REJOIGNEZ L'AVENTURE</h2>
            <p className="text-lg text-gray-300 mb-8">
              Suivez le développement d'Afterlife et soyez parmi les premiers à découvrir les nouveautés
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/devblog" className="btn-medieval text-lg px-8 py-4">
                Suivre le devblog
              </Link>
              <Link href="/wiki" className="btn-medieval-secondary text-lg px-8 py-4">
                Explorer le codex
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
