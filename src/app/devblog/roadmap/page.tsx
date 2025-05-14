"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  status: string;
  progress: number;
  startDate: string | null;
  targetDate: string | null;
  completedAt: string | null;
  priority: number;
  version: string | null;
  category: string;
  tags: string;
  author: {
    name: string | null;
  };
}

export default function RoadmapPage() {
  const [roadmapItems, setRoadmapItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('TOUS');
  const [activeStatus, setActiveStatus] = useState('TOUS');
  
  useEffect(() => {
    const fetchRoadmap = async () => {
      try {
        const response = await fetch('/api/roadmap');
        if (response.ok) {
          const data = await response.json();
          setRoadmapItems(data);
        } else {
          console.error('Erreur lors du chargement de la roadmap');
        }
      } catch (error) {
        console.error('Erreur:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRoadmap();
  }, []);
  
  // Fonctions utilitaires
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PLANNED': return 'bg-blue-600';
      case 'IN_PROGRESS': return 'bg-amber-500';
      case 'COMPLETED': return 'bg-green-600';
      default: return 'bg-gray-600';
    }
  };
  
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PLANNED': return 'Prévu';
      case 'IN_PROGRESS': return 'En cours';
      case 'COMPLETED': return 'Terminé';
      default: return status;
    }
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'FEATURE': return '✨';
      case 'BUGFIX': return '🐛';
      case 'CONTENT': return '📝';
      case 'UI': return '🎨';
      default: return '📌';
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'FEATURE': return 'Fonctionnalité';
      case 'BUGFIX': return 'Correction';
      case 'CONTENT': return 'Contenu';
      case 'UI': return 'Interface';
      default: return 'Autre';
    }
  };
  
  // Filtrage des items
  const filteredItems = roadmapItems.filter(item => {
    if (activeCategory !== 'TOUS' && item.category !== activeCategory) return false;
    if (activeStatus !== 'TOUS' && item.status !== activeStatus) return false;
    return true;
  });
  
  // Regrouper par version
  const itemsByVersion = filteredItems.reduce((acc, item) => {
    const version = item.version || 'Non classé';
    if (!acc[version]) acc[version] = [];
    acc[version].push(item);
    return acc;
  }, {} as Record<string, RoadmapItem[]>);
  
  // Obtenir toutes les catégories uniques
  const categories = ['TOUS', ...Array.from(new Set(roadmapItems.map(item => item.category)))];
  const statuses = ['TOUS', ...Array.from(new Set(roadmapItems.map(item => item.status)))];
  
  return (
    <div className="min-h-screen relative">
      {/* Header avec titre de section */}
      <div className="relative py-20 mb-12 bg-medieval-900">
        {/* Image de fond avec overlay */}
        <div className="absolute inset-0 bg-[url('/backgrounds/HighresScreenshot00018.png')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-medieval-900/100"></div>
        <div className="absolute inset-0 vignette-effect-intense pointer-events-none"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-title font-bold mb-6 text-white flame-effect">Roadmap</h1>
            <p className="text-xl text-gray-200 max-w-3xl mx-auto">
              Suivez l'évolution du développement d'Afterlife et les fonctionnalités à venir
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-20">
        {/* Filtres */}
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            <div className="bg-medieval-800/40 p-1 rounded-lg flex gap-1">
              {categories.map(category => (
                <button
                  key={category}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeCategory === category
                      ? 'bg-medieval-highlight text-white'
                      : 'text-gray-300 hover:bg-medieval-700/50'
                  }`}
                  onClick={() => setActiveCategory(category)}
                >
                  {category === 'TOUS' ? 'Toutes les catégories' : getCategoryLabel(category)}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <div className="bg-medieval-800/40 p-1 rounded-lg flex gap-1">
              {statuses.map(status => (
                <button
                  key={status}
                  className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                    activeStatus === status
                      ? 'bg-medieval-highlight text-white'
                      : 'text-gray-300 hover:bg-medieval-700/50'
                  }`}
                  onClick={() => setActiveStatus(status)}
                >
                  {status === 'TOUS' ? 'Tous les statuts' : getStatusLabel(status)}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Timeline */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-medieval-highlight"></div>
          </div>
        ) : Object.keys(itemsByVersion).length > 0 ? (
          <div className="space-y-12">
            {Object.entries(itemsByVersion).map(([version, items]) => (
              <div key={version} className="border-l-2 border-medieval-700/50 pl-6 ml-4">
                <div className="relative -ml-8 mb-4">
                  <div className="w-14 h-14 rounded-full bg-medieval-800 border-2 border-medieval-700 flex items-center justify-center">
                    <span className="text-xl font-bold text-medieval-highlight">{version}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 gap-4">
                  {items.map(item => (
                    <div 
                      key={item.id} 
                      className="bg-medieval-800/30 rounded-lg border border-gray-700/30 overflow-hidden shadow-md hover:shadow-lg transition-all"
                    >
                      <div className="p-4 md:p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center">
                            <span className="text-xl mr-2">{getCategoryIcon(item.category)}</span>
                            <h3 className="text-xl font-title font-semibold text-white">{item.title}</h3>
                          </div>
                          <div className={`${getStatusColor(item.status)} px-2 py-1 rounded-md text-xs text-white`}>
                            {getStatusLabel(item.status)}
                          </div>
                        </div>
                        
                        {item.description && (
                          <p className="text-gray-300 mb-4">{item.description}</p>
                        )}
                        
                        {/* Barre de progression */}
                        {item.status !== 'PLANNED' && (
                          <div className="mt-4 mb-2">
                            <div className="flex justify-between text-xs text-gray-400 mb-1">
                              <span>Progrès</span>
                              <span>{item.progress}%</span>
                            </div>
                            <div className="h-2 bg-medieval-900/60 rounded-full overflow-hidden">
                              <div 
                                className={`h-full ${getStatusColor(item.status)}`}
                                style={{ width: `${item.progress}%` }}
                              ></div>
                            </div>
                          </div>
                        )}
                        
                        {/* Métadonnées et dates */}
                        <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-xs text-gray-400">
                          {item.targetDate && (
                            <div className="flex items-center">
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <span>
                                Prévu: {new Date(item.targetDate).toLocaleDateString('fr-FR', {
                                  month: 'short', 
                                  year: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                          
                          {JSON.parse(item.tags).length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {JSON.parse(item.tags).map((tag: string) => (
                                <span key={tag} className="px-2 py-0.5 bg-medieval-900/80 text-gray-300 rounded text-xs">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-title font-bold text-gray-400 mb-2">Aucun élément trouvé</h3>
            <p className="text-gray-500">
              {activeCategory !== 'TOUS' || activeStatus !== 'TOUS' 
                ? "Aucun élément ne correspond à ces filtres. Essayez de modifier vos critères de recherche."
                : "La roadmap sera bientôt disponible."}
            </p>
          </div>
        )}
        
        {/* Légende */}
        <div className="mt-16 bg-medieval-800/40 rounded-lg p-6 border border-gray-700/30">
          <h3 className="text-lg font-title font-bold text-white mb-4">Légende</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Statuts</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-blue-600 mr-2"></span>
                  <span className="text-sm text-gray-300">Prévu</span>
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-amber-500 mr-2"></span>
                  <span className="text-sm text-gray-300">En cours</span>
                </li>
                <li className="flex items-center">
                  <span className="w-3 h-3 rounded-full bg-green-600 mr-2"></span>
                  <span className="text-sm text-gray-300">Terminé</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-sm font-semibold text-gray-300 mb-2">Catégories</h4>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span className="w-6 text-center mr-1">✨</span>
                  <span className="text-sm text-gray-300">Fonctionnalité</span>
                </li>
                <li className="flex items-center">
                  <span className="w-6 text-center mr-1">🐛</span>
                  <span className="text-sm text-gray-300">Correction</span>
                </li>
                <li className="flex items-center">
                  <span className="w-6 text-center mr-1">📝</span>
                  <span className="text-sm text-gray-300">Contenu</span>
                </li>
                <li className="flex items-center">
                  <span className="w-6 text-center mr-1">🎨</span>
                  <span className="text-sm text-gray-300">Interface</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Appel à l'action */}
        <div className="mt-12 text-center">
          <Link href="/devblog" className="btn-medieval">
            Retour au devblog
          </Link>
        </div>
      </div>
    </div>
  );
} 