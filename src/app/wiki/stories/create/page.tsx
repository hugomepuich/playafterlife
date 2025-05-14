'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import ImageUploader from '@/components/ImageUploader';
import MultipleImageUploader from '@/components/MultipleImageUploader';

interface Character {
  id: string;
  name: string;
  lastName?: string;
  title?: string;
  mainImage?: string;
}

interface Place {
  id: string;
  name: string;
  mainImage?: string;
}

export default function CreateStoryPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [published, setPublished] = useState(false);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [selectedCharacterIds, setSelectedCharacterIds] = useState<string[]>([]);
  const [selectedPlaceIds, setSelectedPlaceIds] = useState<string[]>([]);

  // Générer une classe de fond aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };
  
  const backgroundClass = getBgClass();

  // Charger les personnages et lieux pour la sélection
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Charger les personnages
        const charactersResponse = await fetch('/api/wiki/characters');
        if (charactersResponse.ok) {
          const charactersData = await charactersResponse.json();
          setCharacters(charactersData);
        }

        // Charger les lieux
        const placesResponse = await fetch('/api/wiki/places');
        if (placesResponse.ok) {
          const placesData = await placesResponse.json();
          setPlaces(placesData);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      summary: formData.get('summary'),
      content: formData.get('content'),
      mainImage: mainImage,
      images: JSON.stringify(additionalImages.filter(img => img.trim() !== '')),
      tags: JSON.stringify(tags),
      published: published,
      characterIds: selectedCharacterIds,
      placeIds: selectedPlaceIds
    };

    try {
      const response = await fetch('/api/wiki/stories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Erreur lors de la création de l\'histoire');
      }

      router.push(`/wiki/stories/${responseData.id}`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() !== '' && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleCharacterSelection = (id: string) => {
    if (selectedCharacterIds.includes(id)) {
      setSelectedCharacterIds(selectedCharacterIds.filter(charId => charId !== id));
    } else {
      setSelectedCharacterIds([...selectedCharacterIds, id]);
    }
  };

  const handlePlaceSelection = (id: string) => {
    if (selectedPlaceIds.includes(id)) {
      setSelectedPlaceIds(selectedPlaceIds.filter(placeId => placeId !== id));
    } else {
      setSelectedPlaceIds([...selectedPlaceIds, id]);
    }
  };

  // Vérifier si l'utilisateur est connecté
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black text-white p-8 relative">
        <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95"></div>
        <div className="max-w-4xl mx-auto relative z-10 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-black text-white p-8 relative">
        <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-title font-bold text-white mb-8 flame-effect">Accès refusé</h1>
          <p className="text-gray-400">Vous devez être connecté pour créer une histoire.</p>
          <Link href="/auth/login" className="inline-block mt-4 text-white underline">
            Se connecter
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 relative">
      <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <div className="mb-8">
          <Link
            href="/wiki/stories"
            className="text-gray-400 hover:text-white transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour aux histoires
          </Link>
        </div>
        
        <h1 className="text-4xl font-title font-bold text-white mb-8 flame-effect">Créer une nouvelle histoire</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informations générales */}
          <div className="glass-panel rounded-md p-6 border border-gray-700/30">
            <div className="mb-6">
              <label className="block text-sm font-title mb-2 text-white">Titre *</label>
              <input
                type="text"
                name="title"
                required
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-white"
                placeholder="Titre de l'histoire"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-title mb-2 text-white">Résumé</label>
              <textarea
                name="summary"
                rows={2}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-white"
                placeholder="Un bref résumé de l'histoire (optionnel)"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-title mb-2 text-white">Contenu *</label>
              <textarea
                name="content"
                rows={12}
                required
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-white"
                placeholder="Le contenu de l'histoire..."
              />
            </div>

            <div className="flex items-center mb-2">
              <input
                type="checkbox"
                id="published"
                checked={published}
                onChange={(e) => setPublished(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-800 border-gray-600 rounded focus:ring-blue-500"
              />
              <label htmlFor="published" className="ml-2 text-sm font-title text-gray-300">
                Publier cette histoire immédiatement
              </label>
            </div>
            <p className="text-xs text-gray-500">
              Si non publiée, l'histoire sera enregistrée comme brouillon et ne sera visible que par vous et les administrateurs.
            </p>
          </div>

          {/* Images */}
          <div className="glass-panel rounded-md p-6 border border-gray-700/30">
            <h2 className="text-lg font-title text-white mb-4">Images</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-title mb-2 text-white">Image principale</label>
              <ImageUploader 
                onImageUploaded={setMainImage}
                currentImage={mainImage}
                className="border border-dashed border-gray-700 rounded-md p-4 hover:border-gray-500 transition-colors bg-gray-900/30"
              />
              {mainImage && (
                <div className="mt-2 text-xs text-gray-500">
                  Image téléchargée avec succès
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-title mb-2 text-white">Images supplémentaires</label>
              <MultipleImageUploader 
                onImagesChanged={setAdditionalImages}
                initialImages={[]}
                label=""
              />
            </div>
          </div>

          {/* Personnages liés */}
          <div className="glass-panel rounded-md p-6 border border-gray-700/30">
            <h2 className="text-lg font-title text-white mb-4">Personnages liés</h2>
            
            {characters.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {characters.map(character => (
                  <div 
                    key={character.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedCharacterIds.includes(character.id)
                        ? 'bg-gray-800 border-gray-500'
                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => handleCharacterSelection(character.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-2">
                        <input
                          type="checkbox"
                          checked={selectedCharacterIds.includes(character.id)}
                          onChange={() => {}}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {character.name} {character.lastName && character.lastName}
                        </p>
                        {character.title && (
                          <p className="text-gray-500 text-xs truncate">{character.title}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Aucun personnage disponible.</p>
            )}
          </div>

          {/* Lieux liés */}
          <div className="glass-panel rounded-md p-6 border border-gray-700/30">
            <h2 className="text-lg font-title text-white mb-4">Lieux liés</h2>
            
            {places.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {places.map(place => (
                  <div 
                    key={place.id}
                    className={`p-3 border rounded-md cursor-pointer transition-colors ${
                      selectedPlaceIds.includes(place.id)
                        ? 'bg-gray-800 border-gray-500'
                        : 'bg-gray-900/50 border-gray-700 hover:border-gray-600'
                    }`}
                    onClick={() => handlePlaceSelection(place.id)}
                  >
                    <div className="flex items-center">
                      <div className="flex-shrink-0 mr-2">
                        <input
                          type="checkbox"
                          checked={selectedPlaceIds.includes(place.id)}
                          onChange={() => {}}
                          className="w-4 h-4"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">
                          {place.name}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Aucun lieu disponible.</p>
            )}
          </div>

          {/* Tags */}
          <div className="glass-panel rounded-md p-6 border border-gray-700/30">
            <h2 className="text-lg font-title text-white mb-4">Tags</h2>
            
            <div className="flex mb-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                placeholder="Ajouter un tag..."
                className="flex-1 px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-white"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-4 py-2 bg-gray-700 text-white rounded-r-md border border-gray-600 hover:bg-gray-600 transition-colors"
              >
                Ajouter
              </button>
            </div>
            
            {tags.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag, index) => (
                  <div key={index} className="flex items-center bg-gray-800 text-gray-300 text-xs rounded-full px-3 py-1">
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-2 text-gray-400 hover:text-gray-200"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">Aucun tag ajouté.</p>
            )}
          </div>

          {error && (
            <div className="bg-red-900/50 text-red-200 p-4 rounded-md border border-red-700">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md border border-gray-600 shadow-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer l\'histoire'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 