import Link from 'next/link';
import Image from 'next/image';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    {
      name: 'Twitter',
      url: 'https://twitter.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
        </svg>
      ),
    },
    {
      name: 'Discord',
      url: 'https://discord.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3847-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
        </svg>
      ),
    },
    {
      name: 'YouTube',
      url: 'https://youtube.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
        </svg>
      ),
    },
    {
      name: 'GitHub',
      url: 'https://github.com',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
        </svg>
      ),
    },
  ];

  const navLinks = [
    { name: 'Accueil', href: '/' },
    { name: 'Universe', href: '/wiki' },
    { name: 'Personnages', href: '/wiki/characters' },
    { name: 'Races', href: '/wiki/races' },
    { name: 'Lieux', href: '/wiki/places' },
    { name: 'Histoires', href: '/wiki/stories' },
    { name: 'Mécaniques de jeu', href: '/mechanics' },
    { name: 'Devblog', href: '/devblog' },
  ];

  return (
    <footer className="bg-black border-t border-gray-800 text-gray-300 relative mt-20">
      {/* Élément décoratif en haut du footer */}
      <div className="absolute top-0 left-0 right-0 transform -translate-y-10 flex justify-center pointer-events-none">
        <div className="h-px w-32 bg-gradient-to-r from-transparent via-white to-transparent"></div>
      </div>
      
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* À propos */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <Link href="/" className="flex items-center">
                <span className="text-3xl font-title font-bold text-white hover:text-gray-300 transition-colors tracking-wider flame-effect">
                  AFTERLIFE
                </span>
              </Link>
            </div>
            <p className="text-gray-400 text-base mb-6 max-w-md">
              Plongez dans un univers dark fantasy médiéval où magie ancienne 
              et intrigues politiques façonnent un royaume en péril. Suivez 
              le développement du jeu et explorez son univers riche.
            </p>
            <div className="flex space-x-4 mt-6">
              {socialLinks.map((link) => (
                <a 
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors p-2 rounded-full bg-gray-900 hover:bg-gray-800 border border-gray-700 hover:border-gray-600"
                  aria-label={link.name}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>
          
          {/* Liens utiles */}
          <div>
            <h3 className="text-xl font-title mb-6 text-white">Navigation</h3>
            <ul className="space-y-4">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link 
                    href={link.href} 
                    className="text-gray-400 hover:text-white transition-colors flex items-center group"
                  >
                    <span className="mr-2">&raquo;</span>
                    <span>{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-title mb-6 text-white">Suivre le développement</h3>
            <p className="text-gray-400 mb-4">
              Recevez les dernières actualités sur le développement du jeu.
            </p>
            <form className="space-y-3">
              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input 
                  type="email" 
                  id="email" 
                  placeholder="Votre email" 
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-white/50 focus:border-white text-gray-300"
                />
              </div>
              <button 
                type="submit" 
                className="w-full btn-medieval py-2 px-4 text-sm"
              >
                S'abonner à la newsletter
              </button>
            </form>
          </div>
        </div>
        
        {/* Ligne de séparation */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Afterlife | Tous droits réservés
          </p>
          <div className="flex space-x-6 text-sm text-gray-500">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Politique de confidentialité
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Conditions d'utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 