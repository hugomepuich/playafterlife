'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Character {
  id: string;
  name: string;
  lastName?: string;
  title?: string;
  race?: string;
  class?: string;
  faction?: string;
  mainImage?: string;
}

// Interface pour les données des personnages principaux
interface MainCharacter {
  id: string;
  label?: string;  // Libellé personnalisé (facultatif)
  color?: string;  // Couleur personnalisée (facultatif)
}

// Constantes pour les IDs des personnages importants
// Ces valeurs seraient idéalement stockées dans un fichier de configuration ou une base de données
const MAIN_CHARACTER_IDS: MainCharacter[] = [
  // Exemples d'IDs - à remplacer par les vrais IDs des personnages principaux

  // Ayunae
  { id: 'cmaksdejz000887do425w0zio', label: "The Creator", color: "#74eb34" }, 

  // Azaryiah
  { id: 'cmaks3rrf000487dolv2hhy9w', label: "The Queen", color: "#ff4500" }, 

  // Ivy
  { id: 'cmakr0yni000387do7h7iv2h7', label: "The Companion", color: "#e60be2" },

  // Mayhem
  { id: 'cmaksabta000787dod5jsf2qm', label: "The King", color: "#ad1700" },

  // Light
  { id: 'cmaksx8dk000f87doiyxp16n8', label: "The Hero", color: "#ffdd00" }
];

const IMPORTANT_CHARACTER_IDS: string[] = [
  // Exemples d'IDs - à remplacer par les vrais IDs des personnages importants

  'cmaksgbyy000987docmdw0fcj', 
  'cmaks790z000587doafw0o3i4',
  'cmaks7xmi000687dorb5sp2vt'
];

// Tous les autres personnages seront considérés comme secondaires

// Types d'importance pour les personnages
type CharacterImportance = 'main' | 'important' | 'secondary';

// Fonction pour déterminer l'importance d'un personnage
const getCharacterImportance = (characterId: string): CharacterImportance => {
  if (MAIN_CHARACTER_IDS.some(char => char.id === characterId)) {
    return 'main';
  } else if (IMPORTANT_CHARACTER_IDS.includes(characterId)) {
    return 'important';
  } else {
    return 'secondary';
  }
};

// Fonction pour obtenir les données personnalisées d'un personnage principal
const getMainCharacterData = (characterId: string): MainCharacter | null => {
  return MAIN_CHARACTER_IDS.find(char => char.id === characterId) || null;
};

// Fonction pour déterminer si une couleur doit avoir un texte noir ou blanc
const getContrastColor = (hexColor: string): string => {
  // Enlever le # si présent
  const color = hexColor.startsWith('#') ? hexColor.substring(1) : hexColor;
  
  // Convertir en RGB
  let r = parseInt(color.substring(0, 2), 16);
  let g = parseInt(color.substring(2, 4), 16);
  let b = parseInt(color.substring(4, 6), 16);
  
  // Calculer la luminosité
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  
  // Retourner blanc pour les couleurs sombres, noir pour les couleurs claires
  return luminance > 0.5 ? '#000000' : '#ffffff';
};

// Styles spécifiques pour l'effet de cartes
const cardStyles = `
  .grid-container {
    position: relative;
    padding: 2rem 0;
    width: 100%;
    overflow: visible;
    display: flex;
    justify-content: center;
  }
  
  .characters-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1rem;
    padding: 1rem 0;
    width: 100%;
    max-width: 1200px;
    overflow: visible;
  }
  
  .character-card {
    position: relative;
    transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
    transform-origin: center;
    will-change: transform;
    z-index: 10;
    overflow: visible;
  }
  
  /* S'assurer que la carte survolée est toujours au-dessus des autres */
  .character-card:hover {
    transform: translateY(-1rem) scale(1.07);
    z-index: 50 !important;
    filter: drop-shadow(0 15px 15px rgba(0, 0, 0, 0.7));
  }
  
  /* Styles pour les couleurs personnalisées au survol */
  .hover\:border-custom:hover .card-inner {
    border-color: var(--custom-color) !important;
    opacity: 0.8;
  }
  
  .hover\:shadow-custom:hover .card-inner {
    box-shadow: 0 15px 35px var(--custom-color) !important;
    opacity: 0.4;
  }
  
  .card-inner {
    box-shadow: 0 5px 15px rgba(0,0,0,0.5);
    transition: all 500ms cubic-bezier(0.19, 1, 0.22, 1);
    transform: perspective(1000px) rotateY(0);
    height: 100%;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background-color: rgba(0, 0, 0, 0.7);
    overflow: hidden;
    display: flex;
    flex-direction: column;
  }
  
  /* Styles pour les types d'importance */
  /* Style de base pour les personnages principaux - sera remplacé par des styles inline si personnalisé */
  .character-main .card-inner {
    border: 1px solid rgba(255, 215, 0, 0.3);
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.15);
  }
  
  .character-main:hover .card-inner {
    border-color: rgba(255, 215, 0, 0.5);
    box-shadow: 0 15px 35px rgba(255, 215, 0, 0.25);
  }
  
  .character-main .importance-indicator {
    background-color: rgba(255, 215, 0, 0.8);
    color: #000;
  }
  
  .character-important .card-inner {
    border: 1px solid rgba(192, 192, 192, 0.3);
    box-shadow: 0 5px 15px rgba(192, 192, 192, 0.15);
  }
  
  .character-important:hover .card-inner {
    border-color: rgba(192, 192, 192, 0.5);
    box-shadow: 0 15px 35px rgba(192, 192, 192, 0.25);
  }
  
  .character-important .importance-indicator {
    background-color: rgba(192, 192, 192, 0.8);
    color: #000;
  }
  
  .character-secondary .importance-indicator {
    background-color: rgba(128, 128, 128, 0.8);
    color: #fff;
  }
  
  .importance-indicator {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 2px 8px;
    border-radius: 3px;
    font-size: 0.65rem;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    z-index: 10;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  .character-card:hover .card-inner {
    box-shadow: 0 15px 35px rgba(0,0,0,0.7);
    transform: perspective(1000px);
    border-color: rgba(255, 255, 255, 0.3);
  }
  
  /* Animation de l'image lors du survol */
  .character-card:hover .card-image {
    transform: scale(1.1);
    filter: grayscale(0.7);
  }

  /* Styles pour les écrans moyens */
  @media (max-width: 1280px) {
    .characters-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
  
  /* Styles pour les écrans moyens */
  @media (max-width: 992px) {
    .characters-grid {
      grid-template-columns: repeat(3, 1fr);
    }
  }
  
  /* Styles pour les petits écrans */
  @media (max-width: 768px) {
    .characters-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  /* Styles pour les très petits écrans */
  @media (max-width: 480px) {
    .characters-grid {
      grid-template-columns: repeat(1, 1fr);
    }
  }
`;

export default function CharactersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRace, setSelectedRace] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedFaction, setSelectedFaction] = useState('');
  const [selectedImportance, setSelectedImportance] = useState<CharacterImportance | ''>('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  // Possibilités pour le filtre d'importance
  const importanceOptions = [
    { value: 'main', label: 'Principaux' },
    { value: 'important', label: 'Importants' },
    { value: 'secondary', label: 'Secondaires' }
  ];
  
  // Extract unique values for filters
  const races = Array.from(new Set(characters.map(c => c.race).filter(Boolean) as string[])).sort();
  const classes = Array.from(new Set(characters.map(c => c.class).filter(Boolean) as string[])).sort();
  const factions = Array.from(new Set(characters.map(c => c.faction).filter(Boolean) as string[])).sort();

  const handleDeleteCharacter = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce personnage ?')) {
      return;
    }

    try {
      const response = await fetch(`/api/wiki/characters/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      // Mise à jour de la liste des personnages après suppression
      setCharacters(characters.filter(character => character.id !== id));
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Une erreur est survenue';
      alert(`Erreur: ${message}`);
    }
  };

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        const response = await fetch('/api/wiki/characters');
        const data = await response.json();
        setCharacters(data);
      } catch (error) {
        console.error('Error loading characters:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacters();
  }, []);

  // Filter characters
  const filteredCharacters = characters.filter(character => {
    const matchesSearch = 
      searchTerm === '' ||
      character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (character.lastName && character.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (character.title && character.title.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRace = selectedRace === '' || character.race === selectedRace;
    const matchesClass = selectedClass === '' || character.class === selectedClass;
    const matchesFaction = selectedFaction === '' || character.faction === selectedFaction;
    const matchesImportance = selectedImportance === '' || getCharacterImportance(character.id) === selectedImportance;
    
    return matchesSearch && matchesRace && matchesClass && matchesFaction && matchesImportance;
  });

  // Regrouper les personnages par importance
  const groupedCharacters = {
    main: filteredCharacters.filter(character => getCharacterImportance(character.id) === 'main'),
    important: filteredCharacters.filter(character => getCharacterImportance(character.id) === 'important'),
    secondary: filteredCharacters.filter(character => getCharacterImportance(character.id) === 'secondary')
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setSelectedRace('');
    setSelectedClass('');
    setSelectedFaction('');
    setSelectedImportance('');
  };

  // Define filter option style
  const filterButtonStyle = (isActive: boolean) => 
    `px-3 py-1.5 text-sm font-title ${
      isActive 
        ? 'bg-gradient-to-r from-gray-700 to-gray-800 text-white border border-gray-600 shadow-md' 
        : 'bg-black/70 text-gray-400 hover:bg-gray-800/50 hover:text-white border border-gray-700/30 hover:border-gray-600'
    } transition-all`;

  // Fonction pour obtenir le libellé d'importance d'un personnage
  const getCharacterImportanceLabel = (characterId: string): string => {
    const importance = getCharacterImportance(characterId);
    
    // Pour les personnages principaux, utiliser le libellé personnalisé s'il existe
    if (importance === 'main') {
      const mainCharData = getMainCharacterData(characterId);
      if (mainCharData && mainCharData.label) {
        return mainCharData.label;
      }
    }
    
    // Sinon, utiliser le libellé par défaut
    return importanceOptions.find(opt => opt.value === importance)?.label || '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-gray-300 p-4 md:p-8 overflow-visible">
        <div className="max-w-7xl mx-auto overflow-visible">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-4xl font-title text-white">Characters</h1>
            <div className="animate-pulse h-10 w-40 bg-gray-800/70"></div>
          </div>
          
          <div className="animate-pulse h-12 w-full bg-gray-800/70 mb-8"></div>
          
          <div className="grid-container">
            <div className="characters-grid">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i} 
                  className="character-card animate-pulse"
                >
                  <div className="card-inner">
                    <div className="aspect-[3/4] bg-gray-800/50 relative"></div>
                    <div className="p-4 space-y-2 bg-gray-900/50">
                      <div className="h-5 bg-gray-800/70 w-3/4 rounded-sm"></div>
                      <div className="h-4 bg-gray-800/70 w-1/2 rounded-sm"></div>
                      <div className="h-4 bg-gray-800/70 w-1/3 rounded-sm"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-gray-300 overflow-visible">
      {/* Injecter les styles CSS personnalisés */}
      <style jsx global>{cardStyles}</style>
      
      {/* Header with section title and create button */}
      <div className="relative py-16 mb-8 border-b border-gray-700/50 overflow-visible">
        <div className="absolute inset-0">
          <Image
            src="/headers/character_header.png"
            alt="Characters header"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/70"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-title font-bold mb-3 text-white flame-effect-intense">Characters</h1>
              <p className="text-gray-400 font-body text-lg">
                Discover the heroes and villains of the Afterlife world, each with their own unique story and abilities.
              </p>
            </div>
            {session?.user && (
              <Link
                href="/wiki/characters/create"
                className="btn-medieval flex items-center px-5 py-3 shadow-lg hover:shadow-md transition-all animated-border-glow"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 00-1 1v5H4a1 1 0 100 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Create Character
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 mb-16 overflow-visible">
        {/* Search bar and filters */}
        <div className="mb-8 space-y-5 fade-in">
          {/* Search bar with toggle button */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Search for a character..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 pl-12 pr-4 glass-panel bg-black/50 border border-gray-700/30 focus:outline-none focus:ring-2 focus:ring-gray-400/30 text-gray-300 font-body"
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            
            {/* Collapse toggle button */}
            <button
              onClick={() => setIsFilterExpanded(!isFilterExpanded)}
              className="glass-panel p-1.5 border border-gray-700/30 flex items-center px-3 text-gray-400 hover:text-white transition-colors"
              title={isFilterExpanded ? "Hide filters" : "Show filters"}
            >
              <span className="mr-2 font-title text-sm">Filters</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-5 w-5 transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Display options */}
            <div className="flex items-center space-x-2 glass-panel p-1.5 border border-gray-700/30">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-700/70 text-white' : 'hover:bg-gray-800/70 text-gray-400'} transition-colors`}
                title="Grid view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-700/70 text-white' : 'hover:bg-gray-800/70 text-gray-400'} transition-colors`}
                title="List view"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>

          {/* Filters - collapsible */}
          {isFilterExpanded && (
            <div className="glass-panel p-5 border border-gray-700/30 animate-fadeIn">
              <div className="flex flex-wrap gap-5 justify-between">
                <div className="flex flex-wrap gap-3">
                  {/* Race filters */}
                  {races.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-sm text-gray-500 font-title">Race:</span>
                      <button
                        onClick={() => setSelectedRace('')}
                        className={filterButtonStyle(selectedRace === '')}
                      >
                        All
                      </button>
                      {races.map(race => (
                        <button
                          key={race}
                          onClick={() => setSelectedRace(race)}
                          className={filterButtonStyle(selectedRace === race)}
                        >
                          {race}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Class filters */}
                  {classes.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center mt-2 sm:mt-0">
                      <span className="text-sm text-gray-500 font-title">Class:</span>
                      <button
                        onClick={() => setSelectedClass('')}
                        className={filterButtonStyle(selectedClass === '')}
                      >
                        All
                      </button>
                      {classes.map(classType => (
                        <button
                          key={classType}
                          onClick={() => setSelectedClass(classType)}
                          className={filterButtonStyle(selectedClass === classType)}
                        >
                          {classType}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Faction filters */}
                  {factions.length > 0 && (
                    <div className="flex flex-wrap gap-2 items-center mt-2 sm:mt-0">
                      <span className="text-sm text-gray-500 font-title">Faction:</span>
                      <button
                        onClick={() => setSelectedFaction('')}
                        className={filterButtonStyle(selectedFaction === '')}
                      >
                        All
                      </button>
                      {factions.map(faction => (
                        <button
                          key={faction}
                          onClick={() => setSelectedFaction(faction)}
                          className={filterButtonStyle(selectedFaction === faction)}
                        >
                          {faction}
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Importance filters */}
                  <div className="flex flex-wrap gap-2 items-center mt-2 sm:mt-0">
                    <span className="text-sm text-gray-500 font-title">Importance:</span>
                    <button
                      onClick={() => setSelectedImportance('')}
                      className={filterButtonStyle(selectedImportance === '')}
                    >
                      All
                    </button>
                    {importanceOptions.map(option => (
                      <button
                        key={option.value}
                        onClick={() => setSelectedImportance(option.value as CharacterImportance)}
                        className={filterButtonStyle(selectedImportance === option.value)}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset filters button */}
                {(searchTerm !== '' || selectedRace !== '' || selectedClass !== '' || selectedFaction !== '' || selectedImportance !== '') && (
                  <button
                    onClick={resetFilters}
                    className="text-white hover:text-gray-300 flex items-center font-title text-sm bg-black/60 hover:bg-gray-800/60 py-1.5 px-3 border border-gray-700/30 hover:border-gray-600 transition-all"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Reset filters
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6 text-gray-400 font-body text-sm">
          {filteredCharacters.length} {filteredCharacters.length === 1 ? 'character' : 'characters'} found
          {filteredCharacters.length > 0 && (
            <span className="ml-1">
              ({groupedCharacters.main.length} principaux, {groupedCharacters.important.length} importants, {groupedCharacters.secondary.length} secondaires)
            </span>
          )}
        </div>

        {/* Character grid/list */}
        {filteredCharacters.length === 0 ? (
          <div className="glass-panel p-10 text-center fade-in border border-gray-700/30">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-700 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-2xl font-title text-white mb-3 flame-effect">No Characters Found</h3>
            <p className="text-gray-400 max-w-md mx-auto">
              No characters match your current search criteria. Try adjusting your filters or create a new character.
            </p>
            {session?.user && (
              <Link
                href="/wiki/characters/create"
                className="mt-6 inline-block btn-medieval px-5 py-2.5 shadow-lg animated-border-glow"
              >
                Create Character
              </Link>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          <div className="space-y-12">
            {/* Personnages principaux */}
            {groupedCharacters.main.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-title text-white mb-6 pl-4 border-l-4 border-white/70">
                  Personnages principaux
                </h2>
                <div className="grid-container fade-in overflow-visible">
                  <div className="characters-grid">
                    {groupedCharacters.main.map((character) => {
                      const importance = getCharacterImportance(character.id);
                      const importanceLabel = getCharacterImportanceLabel(character.id);
                      const mainCharData = getMainCharacterData(character.id);
                      
                      // Préparer les styles personnalisés
                      const customCardStyle = mainCharData?.color ? {
                        borderColor: `${mainCharData.color}50`, // Ajouter la transparence
                        boxShadow: `0 5px 15px ${mainCharData.color}30` // Ajouter la transparence
                      } : {};
                      
                      const customCardHoverClass = mainCharData?.color ? 
                        "hover:border-custom hover:shadow-custom" : "";
                        
                      const customIndicatorStyle = mainCharData?.color ? {
                        backgroundColor: `${mainCharData.color}CC`, // Ajouter la transparence
                        color: getContrastColor(mainCharData.color)
                      } : {};
                      
                      return (
                        <Link
                          key={character.id}
                          href={`/wiki/characters/${character.id}`}
                          className={`group character-card character-${importance} ${customCardHoverClass}`}
                          style={{"--custom-color": mainCharData?.color} as any}
                        >
                          <div className="card-inner" style={customCardStyle}>
                            {/* Image du personnage */}
                            <div className="aspect-[3/4] bg-black/50 relative overflow-hidden">
                              {/* Indicateur d'importance */}
                              <div className="importance-indicator" style={customIndicatorStyle}>
                                {importanceLabel}
                              </div>
                              
                              {character.mainImage ? (
                                <>
                                  {/* Cadre décoratif */}
                                  <div className="absolute inset-0 border border-gray-700/50"></div>
                                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute inset-0 vignette-effect pointer-events-none"></div>
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40 mix-blend-overlay"></div>
                                  <div className="vertical-scan"></div>
                                  <Image
                                    src={character.mainImage}
                                    alt={character.name}
                                    fill
                                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                                    className="object-cover object-center transition-all duration-700 grayscale card-image"
                                    loading="lazy"
                                  />
                                </>
                              ) : (
                                <>
                                  {/* Cadre décoratif */}
                                  <div className="absolute inset-0 border border-gray-700/50"></div>
                                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute inset-0 vignette-effect pointer-events-none"></div>
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40 mix-blend-overlay"></div>
                                  <div className="vertical-scan"></div>
                                  <Image
                                    src="/images/default-character.png"
                                    alt={character.name}
                                    fill
                                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                                    className="object-cover object-center transition-all duration-700 grayscale card-image"
                                    loading="lazy"
                                  />
                                </>
                              )}
                              {/* Gradient de fondu en bas de l'image */}
                              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
                            </div>

                            {/* Contenu de la carte */}
                            <div className="p-4 flex-grow flex flex-col bg-black/90 relative">
                              <h3 className="font-title text-lg text-white mb-0.5 group-hover:text-gray-300 transition-colors line-clamp-1">{character.name}</h3>
                              {character.lastName && (
                                <p className="font-title text-base text-gray-400 mb-1.5 -mt-0.5 line-clamp-1">{character.lastName}</p>
                              )}
                              {character.title && (
                                <p className="text-gray-400 font-body italic mb-2 text-sm line-clamp-1">{character.title}</p>
                              )}
                              {/* Afficher l'ID pour les administrateurs */}
                              {session?.user && (session.user as any).role === 'ADMIN' && (
                                <p className="text-xs text-gray-500 mb-2">ID: {character.id}</p>
                              )}
                              <div className="mt-auto pt-3 flex flex-wrap gap-1.5 text-xs">
                                {character.race && (
                                  <span className="inline-block px-2 py-0.5 rounded-sm bg-black/80 text-gray-300 border border-gray-700/50 line-clamp-1 text-xs">
                                    {character.race}
                                  </span>
                                )}
                                {character.class && (
                                  <span className="inline-block px-2 py-0.5 rounded-sm bg-black/80 text-gray-300 border border-gray-700/50 line-clamp-1 text-xs">
                                    {character.class}
                                  </span>
                                )}
                                {character.faction && (
                                  <span className="inline-block px-2 py-0.5 rounded-sm bg-black/80 text-gray-300 border border-gray-700/50 line-clamp-1 text-xs">
                                    {character.faction}
                                  </span>
                                )}
                              </div>
                              {session?.user && (session.user as any).role === 'ADMIN' && (
                                <div className="mt-auto pt-3 border-t border-gray-700/30 flex justify-between items-center">
                                  <div className="flex gap-3">
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push(`/wiki/characters/${character.id}/edit`);
                                      }}
                                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Modifier
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteCharacter(character.id);
                                      }}
                                      className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Supprimer
                                    </button>
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-xs text-white bg-black/60 border border-gray-700/50 px-3 py-1 rounded-sm inline-flex items-center">
                                      Voir
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                              )}
                              {!session?.user && (
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <span className="text-xs text-white bg-black/60 border border-gray-700/50 px-3 py-1 rounded-sm inline-flex items-center">
                                    Voir
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Personnages importants */}
            {groupedCharacters.important.length > 0 && (
              <div className="mb-12">
                <h2 className="text-2xl font-title text-white mb-6 pl-4 border-l-4 border-gray-400/70">
                  Personnages importants
                </h2>
                <div className="grid-container fade-in overflow-visible">
                  <div className="characters-grid">
                    {groupedCharacters.important.map((character) => {
                      const importance = getCharacterImportance(character.id);
                      const importanceLabel = getCharacterImportanceLabel(character.id);
                      
                      return (
                        <Link
                          key={character.id}
                          href={`/wiki/characters/${character.id}`}
                          className={`group character-card character-${importance}`}
                        >
                          <div className="card-inner">
                            {/* Image du personnage */}
                            <div className="aspect-[3/4] bg-black/50 relative overflow-hidden">
                              {/* Indicateur d'importance */}
                              <div className="importance-indicator">
                                {importanceLabel}
                              </div>
                              
                              {character.mainImage ? (
                                <>
                                  {/* Cadre décoratif */}
                                  <div className="absolute inset-0 border border-gray-700/50"></div>
                                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute inset-0 vignette-effect pointer-events-none"></div>
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40 mix-blend-overlay"></div>
                                  <div className="vertical-scan"></div>
                                  <Image
                                    src={character.mainImage}
                                    alt={character.name}
                                    fill
                                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                                    className="object-cover object-center transition-all duration-700 grayscale card-image"
                                    loading="lazy"
                                  />
                                </>
                              ) : (
                                <>
                                  {/* Cadre décoratif */}
                                  <div className="absolute inset-0 border border-gray-700/50"></div>
                                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute inset-0 vignette-effect pointer-events-none"></div>
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-40 mix-blend-overlay"></div>
                                  <div className="vertical-scan"></div>
                                  <Image
                                    src="/images/default-character.png"
                                    alt={character.name}
                                    fill
                                    sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 992px) 33vw, (max-width: 1280px) 25vw, (max-width: 1536px) 20vw, 16vw"
                                    className="object-cover object-center transition-all duration-700 grayscale card-image"
                                    loading="lazy"
                                  />
                                </>
                              )}
                              {/* Gradient de fondu en bas de l'image */}
                              <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
                            </div>

                            {/* Contenu de la carte */}
                            <div className="p-4 flex-grow flex flex-col bg-black/90 relative">
                              <h3 className="font-title text-lg text-white mb-0.5 group-hover:text-gray-300 transition-colors line-clamp-1">{character.name}</h3>
                              {character.lastName && (
                                <p className="font-title text-base text-gray-400 mb-1.5 -mt-0.5 line-clamp-1">{character.lastName}</p>
                              )}
                              {character.title && (
                                <p className="text-gray-400 font-body italic mb-2 text-sm line-clamp-1">{character.title}</p>
                              )}
                              {/* Afficher l'ID pour les administrateurs */}
                              {session?.user && (session.user as any).role === 'ADMIN' && (
                                <p className="text-xs text-gray-500 mb-2">ID: {character.id}</p>
                              )}
                              <div className="mt-auto pt-3 flex flex-wrap gap-1.5 text-xs">
                                {character.race && (
                                  <span className="inline-block px-2 py-0.5 rounded-sm bg-black/80 text-gray-300 border border-gray-700/50 line-clamp-1 text-xs">
                                    {character.race}
                                  </span>
                                )}
                                {character.class && (
                                  <span className="inline-block px-2 py-0.5 rounded-sm bg-black/80 text-gray-300 border border-gray-700/50 line-clamp-1 text-xs">
                                    {character.class}
                                  </span>
                                )}
                                {character.faction && (
                                  <span className="inline-block px-2 py-0.5 rounded-sm bg-black/80 text-gray-300 border border-gray-700/50 line-clamp-1 text-xs">
                                    {character.faction}
                                  </span>
                                )}
                              </div>
                              {session?.user && (session.user as any).role === 'ADMIN' && (
                                <div className="mt-auto pt-3 border-t border-gray-700/30 flex justify-between items-center">
                                  <div className="flex gap-3">
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push(`/wiki/characters/${character.id}/edit`);
                                      }}
                                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Modifier
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteCharacter(character.id);
                                      }}
                                      className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Supprimer
                                    </button>
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-xs text-white bg-black/60 border border-gray-700/50 px-3 py-1 rounded-sm inline-flex items-center">
                                      Voir
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                              )}
                              {!session?.user && (
                                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <span className="text-xs text-white bg-black/60 border border-gray-700/50 px-3 py-1 rounded-sm inline-flex items-center">
                                    Voir
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Personnages secondaires */}
            {groupedCharacters.secondary.length > 0 && (
              <div>
                <h2 className="text-2xl font-title text-white mb-6 pl-4 border-l-4 border-gray-700/70">
                  Personnages secondaires
                </h2>
                <div className="grid-container fade-in overflow-visible">
                  <div className="characters-grid">
                    {groupedCharacters.secondary.map((character) => {
                      const importance = getCharacterImportance(character.id);
                      const importanceLabel = getCharacterImportanceLabel(character.id);
                      
                      return (
                        <Link
                          key={character.id}
                          href={`/wiki/characters/${character.id}`}
                          className={`group character-card character-${importance}`}
                        >
                          <div className="card-inner">
                            {/* Image du personnage */}
                            <div className="aspect-[3/4] bg-black/50 relative overflow-hidden">
                              {/* Indicateur d'importance */}
                              <div className="importance-indicator">
                                {importanceLabel}
                              </div>
                              
                              {character.mainImage ? (
                                <>
                                  {/* Cadre décoratif */}
                                  <div className="absolute inset-0 border border-gray-700/50"></div>
                                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute inset-0 vignette-effect pointer-events-none"></div>
                                  <Image
                                    src={character.mainImage}
                                    alt={character.name}
                                    fill
                                    sizes="(max-width: 768px) 96px, 128px"
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-[70%]"
                                  />
                                </>
                              ) : (
                                <>
                                  {/* Cadre décoratif */}
                                  <div className="absolute inset-0 border border-gray-700/50"></div>
                                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-gray-600"></div>
                                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-gray-600"></div>
                                  <div className="absolute inset-0 vignette-effect pointer-events-none"></div>
                                  <Image
                                    src="/images/default-character.png"
                                    alt={character.name}
                                    fill
                                    sizes="(max-width: 768px) 96px, 128px"
                                    className="object-cover object-center group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-[70%]"
                                  />
                                </>
                              )}
                              {/* Gradient de fondu en bas de l'image */}
                              <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
                            </div>

                            {/* Contenu de la carte */}
                            <div className="p-5 flex-grow flex flex-col justify-center">
                              <h3 className="font-title text-xl text-white group-hover:text-gray-200 transition-colors flex items-center">
                                {character.name}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-500 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                              </h3>
                              {character.lastName && (
                                <p className="font-title text-lg text-gray-400 -mt-0.5 mb-1">
                                  {character.lastName}
                                </p>
                              )}
                              {character.title && (
                                <p className="text-gray-400 font-body italic mb-2">{character.title}</p>
                              )}
                              {/* Afficher l'ID pour les administrateurs */}
                              {session?.user && (session.user as any).role === 'ADMIN' && (
                                <p className="text-xs text-gray-500 mb-2">ID: {character.id}</p>
                              )}
                              <div className="flex flex-wrap gap-2 text-xs mt-2">
                                {character.race && (
                                  <span className="inline-block px-2.5 py-1 rounded-sm bg-black/70 text-gray-300 border border-gray-700/50">
                                    {character.race}
                                  </span>
                                )}
                                {character.class && (
                                  <span className="inline-block px-2.5 py-1 rounded-sm bg-black/70 text-gray-300 border border-gray-700/50">
                                    {character.class}
                                  </span>
                                )}
                                {character.faction && (
                                  <span className="inline-block px-2.5 py-1 rounded-sm bg-black/70 text-gray-300 border border-gray-700/50">
                                    {character.faction}
                                  </span>
                                )}
                              </div>
                              {session?.user && (session.user as any).role === 'ADMIN' && (
                                <div className="mt-4 pt-3 border-t border-gray-700/30 flex justify-between items-center">
                                  <div className="flex gap-3">
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.push(`/wiki/characters/${character.id}/edit`);
                                      }}
                                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                      </svg>
                                      Modifier
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        handleDeleteCharacter(character.id);
                                      }}
                                      className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center"
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Supprimer
                                    </button>
                                  </div>
                                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <span className="text-xs text-white bg-black/60 border border-gray-700/50 px-3 py-1 rounded-sm inline-flex items-center">
                                      Voir
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </span>
                                  </div>
                                </div>
                              )}
                              {!session?.user && (
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                                  <span className="text-xs text-white bg-black/60 border border-gray-700/50 px-3 py-1 rounded-sm inline-flex items-center">
                                    Voir
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4 fade-in max-w-4xl mx-auto">
            {filteredCharacters.map(character => {
              const importance = getCharacterImportance(character.id);
              const importanceLabel = getCharacterImportanceLabel(character.id);
              
              return (
                <Link
                  key={character.id}
                  href={`/wiki/characters/${character.id}`}
                  className={`block group character-${importance}`}
                >
                  <div className="glass-panel hover:bg-black/40 border border-gray-700/30 hover:border-gray-500/50 rounded-sm overflow-hidden transition-all duration-300 flex shadow-md hover:shadow-lg">
                    <div className="w-24 sm:w-32 aspect-[3/4] bg-black/50 relative overflow-hidden flex-shrink-0">
                      {/* Indicateur d'importance */}
                      <div className="importance-indicator">
                        {importanceLabel}
                      </div>
                      
                      {character.mainImage ? (
                        <>
                          {/* Cadre décoratif */}
                          <div className="absolute inset-0 border border-gray-700/50"></div>
                          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-600"></div>
                          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-600"></div>
                          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-600"></div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-600"></div>
                          <div className="absolute inset-0 vignette-effect pointer-events-none"></div>
                          <Image
                            src={character.mainImage}
                            alt={character.name}
                            fill
                            sizes="(max-width: 768px) 96px, 128px"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-[70%]"
                          />
                        </>
                      ) : (
                        <>
                          {/* Cadre décoratif */}
                          <div className="absolute inset-0 border border-gray-700/50"></div>
                          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-gray-600"></div>
                          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-gray-600"></div>
                          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-gray-600"></div>
                          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-gray-600"></div>
                          <div className="absolute inset-0 vignette-effect pointer-events-none"></div>
                          <Image
                            src="/images/default-character.png"
                            alt={character.name}
                            fill
                            sizes="(max-width: 768px) 96px, 128px"
                            className="object-cover object-center group-hover:scale-105 transition-transform duration-500 grayscale group-hover:grayscale-[70%]"
                          />
                        </>
                      )}
                      {/* Gradient de fondu en bas de l'image */}
                      <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/90 to-transparent pointer-events-none"></div>
                    </div>

                    <div className="p-5 flex-grow flex flex-col justify-center">
                      <h3 className="font-title text-xl text-white group-hover:text-gray-200 transition-colors flex items-center">
                        {character.name}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 text-gray-500 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </h3>
                      {character.lastName && (
                        <p className="font-title text-lg text-gray-400 -mt-0.5 mb-1">
                          {character.lastName}
                        </p>
                      )}
                      {character.title && (
                        <p className="text-gray-400 font-body italic mb-2">{character.title}</p>
                      )}
                      {/* Afficher l'ID pour les administrateurs */}
                      {session?.user && (session.user as any).role === 'ADMIN' && (
                        <p className="text-xs text-gray-500 mb-2">ID: {character.id}</p>
                      )}
                      <div className="flex flex-wrap gap-2 text-xs mt-2">
                        {character.race && (
                          <span className="inline-block px-2.5 py-1 rounded-sm bg-black/70 text-gray-300 border border-gray-700/50">
                            {character.race}
                          </span>
                        )}
                        {character.class && (
                          <span className="inline-block px-2.5 py-1 rounded-sm bg-black/70 text-gray-300 border border-gray-700/50">
                            {character.class}
                          </span>
                        )}
                        {character.faction && (
                          <span className="inline-block px-2.5 py-1 rounded-sm bg-black/70 text-gray-300 border border-gray-700/50">
                            {character.faction}
                          </span>
                        )}
                      </div>
                      {session?.user && (session.user as any).role === 'ADMIN' && (
                        <div className="mt-4 pt-3 border-t border-gray-700/30 flex justify-between items-center">
                          <div className="flex gap-3">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                router.push(`/wiki/characters/${character.id}/edit`);
                              }}
                              className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Modifier
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteCharacter(character.id);
                              }}
                              className="text-xs text-red-400 hover:text-red-300 transition-colors flex items-center"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                              Supprimer
                            </button>
                          </div>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-xs text-white bg-black/60 border border-gray-700/50 px-3 py-1 rounded-sm inline-flex items-center">
                              Voir
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                          </div>
                        </div>
                      )}
                      {!session?.user && (
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 mt-2">
                          <span className="text-xs text-white bg-black/60 border border-gray-700/50 px-3 py-1 rounded-sm inline-flex items-center">
                            Voir
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 ml-1 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
} 