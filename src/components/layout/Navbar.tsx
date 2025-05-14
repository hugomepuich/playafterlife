'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  
  // Référence pour fermer les dropdown lors du clic à l'extérieur
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Gestion du scroll pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Structure du menu avec sous-menus
  const menuStructure = [
    { name: 'Accueil', href: '/' },
    { 
      name: 'Univers',
      children: [
        { name: 'Codex', href: '/wiki' },
        { name: 'Personnages', href: '/wiki/characters' },
        { name: 'Races', href: '/wiki/races' },
        { name: 'Lieux', href: '/wiki/places' },
        { name: 'Histoires', href: '/wiki/stories' },
      ]
    },
    { name: 'Mécaniques', href: '/mechanics' },
    { 
      name: 'Développement',
      children: [
        { name: 'Devblog', href: '/devblog' },
        { name: 'Roadmap', href: '/devblog/roadmap' },
        { name: 'FAQ', href: '/faq' },
      ]
    },
    { name: 'Galerie', href: '/galerie' },
  ];
  
  // Gestion du hover avec délai
  const handleMouseEnter = (itemName: string) => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setOpenDropdown(itemName);
  };
  
  const handleMouseLeave = (itemName: string) => {
    const timeout = setTimeout(() => {
      if (openDropdown === itemName) {
        setOpenDropdown(null);
      }
    }, 300);
    setHoverTimeout(timeout);
  };
  
  // Fermer dropdown au clic extérieur
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  // Liste plate des éléments de menu pour la version mobile
  const flatMenuItems = menuStructure.flatMap(item => 
    item.children ? [{ name: item.name, href: item.children[0].href }, ...item.children] : [item]
  );
  
  const isChildActive = (children: { name: string, href: string }[]) => {
    return children.some(child => 
      pathname === child.href || (child.href !== '/' && pathname?.startsWith(child.href))
    );
  };
  
  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/95 backdrop-blur-md shadow-xl' : 'bg-black/70'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-title font-bold text-white hover:text-medieval-highlight transition-colors tracking-wider flame-effect">
                AFTERLIFE
              </span>
            </Link>
          </div>
          
          {/* Navigation principale (desktop) */}
          <div className="hidden md:ml-8 md:flex md:space-x-8" ref={dropdownRef}>
            {menuStructure.map((item) => (
              <div key={item.name} className="relative group">
                {item.children ? (
                  <>
                    <div 
                      className="flex items-center h-full"
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={() => handleMouseLeave(item.name)}
                    >
                      <button
                        className={`font-title text-base transition-all border-b-2 px-1 py-6 flex items-center ${
                          isChildActive(item.children)
                            ? 'text-white border-white'
                            : 'text-gray-300 border-transparent hover:text-white hover:border-white/50'
                        }`}
                        onClick={() => setOpenDropdown(openDropdown === item.name ? null : item.name)}
                      >
                        {item.name}
                        <svg 
                          className={`ml-1 h-4 w-4 transition-transform ${openDropdown === item.name ? 'rotate-180' : ''}`} 
                          xmlns="http://www.w3.org/2000/svg" 
                          viewBox="0 0 20 20" 
                          fill="currentColor"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                      
                      {/* Dropdown menu avec zone étendue pour éviter les problèmes de hover */}
                      <div 
                        className={`absolute top-full left-1/2 transform -translate-x-1/2 mt-0 w-60 rounded-md shadow-xl glass-panel border border-gray-700/50 transition-all duration-200 z-50
                          ${openDropdown === item.name ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                        style={{ marginTop: '1px' }}
                      >
                        {/* Triangle de flèche pour l'alignement visuel */}
                        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-black/70 rotate-45 border-t border-l border-gray-700/50"></div>
                        
                        <div className="py-3 relative">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              href={child.href}
                              className={`block px-5 py-2.5 text-sm font-title transition-colors ${
                                pathname === child.href || (child.href !== '/' && pathname?.startsWith(child.href))
                                  ? 'text-medieval-highlight'
                                  : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                              }`}
                              onClick={() => setOpenDropdown(null)}
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className={`font-title text-base transition-all border-b-2 px-1 py-6 flex items-center ${
                      pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                        ? 'text-white border-white'
                        : 'text-gray-300 border-transparent hover:text-white hover:border-white/50'
                    }`}
                  >
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </div>
          
          {/* Bouton utilisateur (desktop) */}
          <div className="hidden md:flex md:items-center">
            {status === 'loading' ? (
              <div className="w-8 h-8 rounded-full bg-gray-800/50 animate-pulse" />
            ) : session?.user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 focus:outline-none group"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/30 flex items-center justify-center text-white uppercase shadow-md group-hover:shadow-medieval-glow transition-all">
                    {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                  </div>
                  <span className="text-gray-300 group-hover:text-white transition-colors">{session.user.name || 'Aventurier'}</span>
                  <svg 
                    className={`ml-1 h-5 w-5 text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-xl glass-panel fade-in border border-gray-700/50">
                    <div className="py-1" role="menu">
                      {(session.user as any).role === 'ADMIN' && (
                        <Link
                          href="/admin"
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white font-title transition-colors"
                          role="menuitem"
                          onClick={() => setUserMenuOpen(false)}
                        >
                          Salle du trône
                        </Link>
                      )}
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          signOut();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white font-title transition-colors"
                        role="menuitem"
                      >
                        Déconnexion
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth/login"
                className="btn-medieval-secondary flex items-center"
              >
                <span>Connexion</span>
                <svg className="w-4 h-4 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                </svg>
              </Link>
            )}
          </div>
          
          {/* Menu hamburger (mobile) */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-medieval-highlight focus:outline-none"
              aria-expanded={isMenuOpen}
            >
              <span className="sr-only">Ouvrir le menu</span>
              {!isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Menu mobile */}
      {isMenuOpen && (
        <div className="md:hidden glass-panel border-t border-b border-gray-700/50">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Affichage des groupes comme sections */}
            {menuStructure.map((group) => (
              <div key={group.name} className="py-2">
                {group.children ? (
                  <>
                    <div className="px-3 py-1 text-sm font-semibold text-medieval-highlight font-title uppercase border-b border-gray-700/30 mb-2">
                      {group.name}
                    </div>
                    <div className="pl-4 space-y-1">
                      {group.children.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className={`block px-3 py-2 rounded-md font-title ${
                            pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href))
                              ? 'bg-gray-900 text-white'
                              : 'text-gray-300 hover:bg-gray-900/50 hover:text-white'
                          }`}
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={group.href}
                    className={`block px-3 py-2 rounded-md font-title ${
                      pathname === group.href || (group.href !== '/' && pathname?.startsWith(group.href))
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-300 hover:bg-gray-900/50 hover:text-white'
                    }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {group.name}
                  </Link>
                )}
              </div>
            ))}
            
            {/* Section utilisateur mobile */}
            <div className="pt-4 pb-3 border-t border-gray-700/50">
              {status === 'loading' ? (
                <div className="flex items-center px-5">
                  <div className="w-8 h-8 rounded-full bg-gray-800/50 animate-pulse" />
                  <div className="ml-3 w-24 h-4 bg-gray-800/50 animate-pulse rounded" />
                </div>
              ) : session?.user ? (
                <>
                  <div className="flex items-center px-5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gray-700 to-black border border-white/30 flex items-center justify-center text-white uppercase shadow-md">
                      {session.user.name?.[0] || session.user.email?.[0] || 'U'}
                    </div>
                    <div className="ml-3">
                      <div className="text-base font-medium text-gray-300">{session.user.name}</div>
                      <div className="text-sm font-medium text-gray-400">{session.user.email}</div>
                    </div>
                  </div>
                  <div className="mt-3 px-2">
                    {(session.user as any).role === 'ADMIN' && (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 rounded-md text-base font-title text-gray-300 hover:bg-gray-900 hover:text-white"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Salle du trône
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        setIsMenuOpen(false);
                        signOut();
                      }}
                      className="block w-full text-left px-3 py-2 rounded-md text-base font-title text-gray-300 hover:bg-gray-900 hover:text-white"
                    >
                      Déconnexion
                    </button>
                  </div>
                </>
              ) : (
                <div className="px-2">
                  <Link
                    href="/auth/login"
                    className="block px-3 py-2 rounded-md text-base font-title text-gray-300 hover:bg-gray-900 hover:text-white"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Connexion
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar; 