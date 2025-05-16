"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const embraceVideoRef = useRef<HTMLVideoElement>(null);
  const destinyVideoRef = useRef<HTMLVideoElement>(null);
  
  const handleVideoEnded = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoError = (e: any) => {
    console.error('Erreur de lecture vidéo:', e);
    if (videoRef.current) {
      videoRef.current.load();
      videoRef.current.play();
    }
  };

  const handleEmbraceVideoEnded = () => {
    if (embraceVideoRef.current) {
      embraceVideoRef.current.play();
    }
  };

  const handleEmbraceVideoError = (e: any) => {
    console.error('Erreur de lecture vidéo embrace:', e);
    if (embraceVideoRef.current) {
      embraceVideoRef.current.load();
      embraceVideoRef.current.play();
    }
  };

  const handleDestinyVideoEnded = () => {
    if (destinyVideoRef.current) {
      destinyVideoRef.current.play();
    }
  };

  const handleDestinyVideoError = (e: any) => {
    console.error('Erreur de lecture vidéo destiny:', e);
    if (destinyVideoRef.current) {
      destinyVideoRef.current.load();
      destinyVideoRef.current.play();
    }
  };

  const scrollToNextSection = () => {
    const gameOverview = document.getElementById('game-overview');
    if (gameOverview) {
      const navbarHeight = 80; // hauteur approximative de la navbar
      const additionalOffset = 120; // décalage supplémentaire pour positionner plus haut
      const topOffset = gameOverview.getBoundingClientRect().top + window.scrollY - navbarHeight - additionalOffset;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    // Activer l'animation après le chargement
    setIsVisible(true);

    // S'assurer que la vidéo joue
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error('Erreur lors de la lecture initiale:', error);
      });
    }
    
    // Initialiser AOS avec des paramètres sécurisés
    AOS.init({
      duration: 800,
      once: false,
      offset: 100,
      easing: 'ease-in-out',
      delay: 0,
      startEvent: 'DOMContentLoaded'
    });
    
    // Rafraîchir AOS après le chargement complet
    window.addEventListener('load', () => {
      AOS.refresh();
    });
    
    return () => {
      window.removeEventListener('load', () => {
        AOS.refresh();
      });
    };
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
    <div className="relative overflow-hidden">
      {/* Section héro avec vidéo/image de fond */}
      <section className="relative h-[calc(100vh-5rem)] md:h-[calc(100vh-5rem)] flex items-center justify-center overflow-hidden">
        {/* Fond vidéo */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            onEnded={handleVideoEnded}
            onError={handleVideoError}
            className="absolute w-full h-full object-cover"
            preload="auto"
          >
            <source src="/videos/herosite.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px]"></div>
          {/* Gradient de transition en bas du hero */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black to-transparent"></div>
        </div>
        
        {/* Contenu principal héro */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex items-center justify-center h-full -mt-16 md:-mt-20">
          <div className={`max-w-4xl mx-auto text-center opacity-100 animate-fadeIn`}>
            <h1 className="font-title text-5xl sm:text-6xl md:text-7xl font-bold mb-4 text-white tracking-wider">
              <span className="block flame-effect heroking-font">AFTERLIFE</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto">
              What lies beyond death is yet for you to discover
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button onClick={scrollToNextSection} className="btn-medieval-secondary text-lg px-8 py-4 flex items-center justify-center cursor-pointer">
                <span>Discover the project</span>
                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
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
        <button 
          onClick={scrollToNextSection}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce cursor-pointer group z-20"
        >
          <div className="relative p-4">
            <div className="absolute inset-0 rounded-full border-2 border-white/0 group-hover:border-white/80 transition-all duration-300"></div>
            <svg className="w-8 h-8 text-white/80 group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </button>
      </section>
      
      {/* Espace de transition entre le héro et la section suivante */}
      <div className="h-16 bg-black"></div>
      
      {/* Section Aperçu du jeu */}
      <section id="game-overview" className="py-16 md:py-24 bg-black relative">
        {/* Fond vidéo qui prend la moitié gauche */}
        <div className="absolute left-0 top-0 bottom-0 w-full md:w-3/5 overflow-hidden">
          <div className="relative w-full h-full">
            <video
              ref={embraceVideoRef}
              autoPlay
              loop
              muted
              playsInline
              onEnded={handleEmbraceVideoEnded}
              onError={handleEmbraceVideoError}
              className="absolute w-full h-full object-cover"
              preload="auto"
            >
              <source src="/videos/mini-pres-video.mp4" type="video/mp4" />
            </video>
            {/* Gradient de fondu moins intense pour ne pas trop assombrir la vidéo */}
            <div className="absolute inset-0 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-black/90 pointer-events-none"></div>
            {/* Gradient pour fondre la vidéo avec l'espace noir du dessus */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent"></div>
            {/* Gradient pour fondre la vidéo en bas */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
            {/* Gradient pour fondre la vidéo sur sa gauche */}
            <div className="absolute top-0 bottom-0 left-0 w-24 bg-gradient-to-r from-black/70 to-transparent"></div>
            {/* Overlay pour mobile */}
            <div className="absolute inset-0 md:hidden bg-black/70"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            {/* Première colonne vide pour laisser place à la vidéo en background */}
            <div className="hidden md:block md:col-span-3"></div>
            
            {/* Titre et contenu textuel dans la seconde colonne */}
            <div className="space-y-8 relative z-10 text-center md:col-span-2" data-aos="fade-left">
              <div>
                <h2 className="text-3xl md:text-4xl font-title font-bold mb-4 text-white flame-effect">Embrace your eternity</h2>
                <p className="text-lg text-gray-300">
                  Afterlife is a dark fantasy RPG, where you will uncover the tragedy that took place in the world of the dead.
                </p>
              </div>
              
              <div className="space-y-6">
                <p className="text-gray-300">
                You awaken in a place unknown to you, with only one feeling anchoring your soul—the unshakable need to find someone dear to you.
                With the help of Ivy, you will journey through shattered realms, each scarred by a cataclysm whose cause remains hidden in shadow.
                </p>

                <div className="pt-4">
                  <Link href="/wiki" className="btn-medieval text-lg px-8 py-4 flex items-center justify-center">
                    <span>Explore the story</span>
                    <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Espace de transition entre sections */}
      <div className="h-16 bg-black"></div>
      
      {/* Section Aperçu du jeu version 2 */}
      <section className="py-16 md:py-24 bg-black relative">
        {/* Fond vidéo qui prend la moitié droite (inversé par rapport à la section précédente) */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 overflow-hidden">
          <div className="relative w-full h-full">
            <video
              ref={destinyVideoRef}
              autoPlay
              loop
              muted
              playsInline
              onEnded={handleDestinyVideoEnded}
              onError={handleDestinyVideoError}
              className="absolute w-full h-full object-cover"
              preload="auto"
            >
              <source src="/videos/mini-pres-video-2.mp4" type="video/mp4" />
            </video>
            {/* Gradient de fondu moins intense pour ne pas trop assombrir la vidéo */}
            <div className="absolute inset-0 md:bg-gradient-to-l md:from-transparent md:via-transparent md:to-black/90 pointer-events-none"></div>
            {/* Gradient pour fondre la vidéo avec l'espace noir du dessus */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent"></div>
            {/* Gradient pour fondre la vidéo en bas */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent"></div>
            {/* Gradient pour fondre la vidéo sur sa droite */}
            <div className="absolute top-0 bottom-0 right-0 w-24 bg-gradient-to-l from-black/70 to-transparent"></div>
            {/* Overlay pour mobile */}
            <div className="absolute inset-0 md:hidden bg-black/70"></div>
          </div>
        </div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-center">
            {/* Titre et contenu textuel dans la première colonne (inversé par rapport à la section précédente) */}
            <div className="space-y-8 relative z-10 text-center md:col-span-2" data-aos="fade-right">
              <div>
                <h2 className="text-3xl md:text-4xl font-title font-bold mb-4 text-white flame-effect">Discover Your True Self</h2>
                <p className="text-lg text-gray-300">
                  The Gods left this place a long time ago, no one is there to punish you. 
                </p>
              </div>
              
              <div className="space-y-6">
              <p className="text-gray-300">
              It is up to you to walk the path of light—or descend into darkness.
Your relationships, your choices, and your actions will shape the fate of the world around you.
Every bond forged, every life spared or taken, leaves a mark.
                </p>
                <p className="text-gray-300">
                In the end, it will be your will that shapes the fate of this world—
                to help it rise from the ashes… or to deliver the final blow.
                </p>
                <div className="pt-4">
                  <Link href="/wiki/characters" className="btn-medieval text-lg px-8 py-4 flex items-center justify-center">
                    <span>Explore characters</span>
                    <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Colonne vide pour laisser place à la vidéo en background */}
            <div className="hidden md:block md:col-span-3"></div>
          </div>
        </div>
      </section>
      
      {/* Espace de transition entre sections */}
      <div className="h-16 bg-black"></div>
      
      {/* Section Caractéristiques */}
      <section className="py-16 md:py-24 bg-black relative">
        <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-[0.05] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-title font-bold mb-6 text-white flame-effect">CARACTÉRISTIQUES DU JEU</h2>
            <p className="text-lg text-gray-300">
              Découvrez ce qui rend Afterlife unique et immersif
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {gameFeatures.map((feature, index) => (
              <div key={index} className="bg-black/80 p-6 rounded-lg glass-panel border border-gray-700/30 hover:border-gray-600/40 transition-all" data-aos="fade-up" data-aos-delay={index * 100}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-title font-bold mb-3 text-white">{feature.title}</h3>
                <p className="text-gray-300">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Espace de transition entre sections */}
      <div className="h-16 bg-black"></div>
      
      {/* Section Devblog et Wiki */}
      <section className="py-16 md:py-24 bg-black relative">
        <div className="absolute inset-0 bg-[url('/images/stone-texture.jpg')] bg-repeat opacity-5 pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Devblog */}
            <div data-aos="fade-right">
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
            <div data-aos="fade-left">
              <h2 className="text-3xl font-title font-bold mb-6 text-white flame-effect">CODEX</h2>
              <p className="text-lg text-gray-300 mb-6">
                Explorez l'univers d'Afterlife à travers notre wiki détaillé. Découvrez les personnages, les lieux, 
                les objets et l'histoire riche qui constituent le monde du jeu.
              </p>
              <Link href="/wiki" className="btn-medieval text-lg px-8 py-4 flex items-center justify-center">
                <span>Explorer le codex</span>
                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Espace de transition entre sections */}
      <div className="h-16 bg-black"></div>
      
      {/* Section Suivez le développement */}
      <section className="py-16 md:py-24 bg-black relative">
        <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-[0.05] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-title font-bold mb-6 text-white flame-effect">SUIVEZ LE DÉVELOPPEMENT</h2>
            <p className="text-lg text-gray-300">
              Restez informé de l'avancement du projet et plongez au cœur de l'univers d'Afterlife
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Roadmap */}
            <div className="bg-black/80 rounded-lg overflow-hidden border border-gray-700/30 group hover:border-gray-600/40 transition-all shadow-lg hover:shadow-xl" data-aos="fade-up" data-aos-delay="100">
              <div className="relative h-52">
                <Image 
                  src="/backgrounds/HighresScreenshot00018.png" 
                  alt="Roadmap" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-black/70 to-transparent"></div>
                <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 p-5 z-10">
                  <div className="w-12 h-12 rounded-full bg-black/90 border border-gray-700/30 flex items-center justify-center text-2xl mb-3">
                    🗺️
                  </div>
                  <h3 className="text-2xl font-title font-bold text-white">Roadmap</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-300 mb-4">
                  Découvrez les fonctionnalités prévues et suivez l'évolution du développement d'Afterlife.
                </p>
                <Link href="/devblog/roadmap" className="inline-flex items-center text-gray-300 hover:text-gray-200 transition-colors">
                  <span>Voir la roadmap</span>
                  <svg className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* Galerie */}
            <div className="bg-black/80 rounded-lg overflow-hidden border border-gray-700/30 group hover:border-gray-600/40 transition-all shadow-lg hover:shadow-xl" data-aos="fade-up" data-aos-delay="200">
              <div className="relative h-52">
                <Image 
                  src="/backgrounds/HighresScreenshot00017.png" 
                  alt="Galerie" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-black/70 to-transparent"></div>
                <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 p-5 z-10">
                  <div className="w-12 h-12 rounded-full bg-black/90 border border-gray-700/30 flex items-center justify-center text-2xl mb-3">
                    🖼️
                  </div>
                  <h3 className="text-2xl font-title font-bold text-white">Galerie</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-300 mb-4">
                  Explorez les visuels du jeu avec notre collection d'images, artworks et captures d'écran.
                </p>
                <Link href="/galerie" className="inline-flex items-center text-gray-300 hover:text-gray-200 transition-colors">
                  <span>Voir la galerie</span>
                  <svg className="ml-1 w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
            </div>
            
            {/* FAQ */}
            <div className="bg-black/80 rounded-lg overflow-hidden border border-gray-700/30 group hover:border-gray-600/40 transition-all shadow-lg hover:shadow-xl" data-aos="fade-up" data-aos-delay="300">
              <div className="relative h-52">
                <Image 
                  src="/backgrounds/HighresScreenshot00021.png" 
                  alt="FAQ" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/90 to-transparent"></div>
                <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-black/70 to-transparent"></div>
                <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-black/70 to-transparent"></div>
                <div className="absolute bottom-0 p-5 z-10">
                  <div className="w-12 h-12 rounded-full bg-black/90 border border-gray-700/30 flex items-center justify-center text-2xl mb-3">
                    ❓
                  </div>
                  <h3 className="text-2xl font-title font-bold text-white">FAQ</h3>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-300 mb-4">
                  Trouvez les réponses à vos questions sur le jeu, son univers et son développement.
                </p>
                <Link href="/faq" className="inline-flex items-center text-gray-300 hover:text-gray-200 transition-colors">
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
      
      {/* Espace de transition entre sections */}
      <div className="h-16 bg-black"></div>
      
      {/* Section Personnages */}
      <section className="py-16 md:py-24 bg-black relative">
        <div className="absolute inset-0 bg-[url('/images/noise-texture.png')] opacity-[0.05] mix-blend-overlay"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center mb-12" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-title font-bold mb-6 text-white flame-effect">RENCONTREZ LES PERSONNAGES</h2>
            <p className="text-lg text-gray-300 mb-8">
              Découvrez les protagonistes et antagonistes qui peuplent le monde d'Afterlife
            </p>
            <Link href="/wiki/characters" className="btn-medieval inline-flex items-center" data-aos="zoom-in" data-aos-anchor-placement="top-bottom">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
              </svg>
              Voir tous les personnages
            </Link>
          </div>
        </div>
      </section>
      
      {/* Espace de transition entre sections */}
      <div className="h-16 bg-black"></div>
      
      {/* Section CTA */}
      <section className="py-16 bg-black relative">
        <div className="absolute inset-0 bg-[url('/images/stone-texture.jpg')] bg-repeat opacity-5 pointer-events-none"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto text-center" data-aos="fade-up">
            <h2 className="text-3xl md:text-4xl font-title font-bold mb-6 text-white flame-effect">REJOIGNEZ L'AVENTURE</h2>
            <p className="text-lg text-gray-300 mb-8">
              Suivez le développement d'Afterlife et soyez parmi les premiers à découvrir les nouveautés
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center" data-aos="fade-up" data-aos-delay="200">
              <Link href="/devblog" className="btn-medieval text-lg px-8 py-4">
                Suivre le devblog
              </Link>
              <Link href="/wiki" className="btn-medieval text-lg px-8 py-4 flex items-center justify-center">
                <span>Explorer le codex</span>
                <svg className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
