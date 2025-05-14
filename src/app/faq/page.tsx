"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  author: {
    name: string | null;
  };
}

export default function FAQPage() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('TOUS');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        const response = await fetch('/api/faq');
        if (response.ok) {
          const data = await response.json();
          setFaqs(data);
        } else {
          console.error('Erreur lors du chargement des FAQs');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFAQs();
  }, []);
  
  // Fonctions utilitaires
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'GENERAL': return 'Général';
      case 'GAMEPLAY': return 'Gameplay';
      case 'STORY': return 'Histoire';
      case 'TECHNICAL': return 'Technique';
      default: return category;
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'GENERAL': return '📌';
      case 'GAMEPLAY': return '🎮';
      case 'STORY': return '📖';
      case 'TECHNICAL': return '⚙️';
      default: return '❓';
    }
  };
  
  const toggleQuestion = (id: string) => {
    setActiveIndex(activeIndex === id ? null : id);
  };
  
  // Filtrage des questions
  const filteredFaqs = faqs.filter(faq => {
    if (activeCategory !== 'TOUS' && faq.category !== activeCategory) return false;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return faq.question.toLowerCase().includes(query) || 
             faq.answer.toLowerCase().includes(query);
    }
    return true;
  });
  
  // Regrouper par catégorie
  const faqByCategory = filteredFaqs.reduce((acc, faq) => {
    if (!acc[faq.category]) acc[faq.category] = [];
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);
  
  // Obtenir toutes les catégories uniques
  const categories = ['TOUS', ...Array.from(new Set(faqs.map(faq => faq.category)))];
  
  return (
    <div className="min-h-screen relative">
      {/* Header avec titre de section */}
      <div className="relative py-20 mb-12 bg-medieval-900">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 bg-[url('/backgrounds/HighresScreenshot00021.png')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-medieval-900/100"></div>
        <div className="absolute inset-0 vignette-effect-intense pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-title font-bold mb-6 text-white flame-effect">Questions fréquentes</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Trouvez les réponses à vos questions sur Afterlife
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-20">
        {/* Barre de recherche et filtres */}
        <div className="mb-10 space-y-4">
          <div className="relative max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-3 border border-gray-700/50 bg-medieval-800/50 text-white rounded-lg focus:ring-1 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50"
              placeholder="Rechercher une question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {categories.map(category => (
              <button
                key={category}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeCategory === category
                    ? 'bg-medieval-highlight text-white'
                    : 'bg-medieval-800/50 text-gray-300 hover:bg-medieval-700/60'
                }`}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'TOUS' ? 'Toutes les catégories' : (
                  <span className="flex items-center">
                    <span className="mr-2">{getCategoryIcon(category)}</span>
                    {getCategoryLabel(category)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Liste des FAQs */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medieval-highlight"></div>
          </div>
        ) : Object.keys(faqByCategory).length > 0 ? (
          <div className="max-w-3xl mx-auto space-y-8">
            {Object.entries(faqByCategory).map(([category, items]) => (
              <div key={category} className="space-y-4">
                <h2 className="text-2xl font-title font-bold text-white flex items-center">
                  <span className="mr-3 text-xl">{getCategoryIcon(category)}</span>
                  {getCategoryLabel(category)}
                </h2>
                
                <div className="divide-y divide-gray-700/20">
                  {items.map((faq) => (
                    <div key={faq.id} className="py-4">
                      <button
                        className="w-full flex justify-between items-start text-left"
                        onClick={() => toggleQuestion(faq.id)}
                      >
                        <h3 className="text-lg font-semibold text-white pr-8">{faq.question}</h3>
                        <span className="text-lg text-gray-400">
                          {activeIndex === faq.id ? '−' : '+'}
                        </span>
                      </button>
                      
                      {activeIndex === faq.id && (
                        <div className="mt-4 text-gray-300 prose prose-sm max-w-none prose-invert">
                          <div 
                            dangerouslySetInnerHTML={{ 
                              __html: faq.answer
                                .replace(/\n/g, '<br>')
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                            }} 
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto mb-4 text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-title font-bold text-gray-400 mb-2">
              {searchQuery ? "Aucun résultat trouvé" : "Aucune question disponible"}
            </h3>
            <p className="text-gray-500">
              {searchQuery 
                ? "Essayez de modifier votre recherche ou de sélectionner une autre catégorie."
                : "Notre FAQ sera bientôt disponible."}
            </p>
          </div>
        )}
        
        {/* Appel à l'action */}
        <div className="mt-16 max-w-3xl mx-auto p-6 bg-medieval-800/40 rounded-lg text-center border border-gray-700/30">
          <h3 className="text-xl font-title font-bold text-white mb-3">Vous ne trouvez pas votre réponse ?</h3>
          <p className="text-gray-300 mb-6">
            Consultez notre wiki pour plus d'informations sur le monde d'Afterlife ou suivez le développement du jeu sur notre devblog.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/wiki" className="btn-medieval-secondary">
              Explorer le wiki
            </Link>
            <Link href="/devblog" className="btn-medieval">
              Lire le devblog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 