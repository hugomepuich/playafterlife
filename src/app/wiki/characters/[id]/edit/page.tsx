'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ImageUploader from '@/components/ImageUploader';
import MultipleImageUploader from '@/components/MultipleImageUploader';
import VideoUploader from '@/components/VideoUploader';

interface Character {
  id: string;
  name: string;
  lastName?: string;
  title?: string;
  race?: string;
  raceId?: string;
  class?: string;
  faction?: string;
  alignment?: string;
  background?: string;
  description?: string;
  mainImage?: string;
  headerBackground?: string;
  images: string;
  videos: string;
}

export default function EditCharacterPage() {
  const params = useParams();
  const id = params?.id as string;
  
  const router = useRouter();
  const { data: session } = useSession();
  const [character, setCharacter] = useState<Character | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [headerBackground, setHeaderBackground] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [races, setRaces] = useState<{id: string, name: string}[]>([]);
  const [racesLoading, setRacesLoading] = useState(true);

  // Fonction pour générer un arrière-plan aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };

  const backgroundClass = getBgClass();

  useEffect(() => {
    if (!id) return;
    
    const fetchCharacter = async () => {
      try {
        const response = await fetch(`/api/wiki/characters/${id}`);
        if (!response.ok) {
          throw new Error('Personnage non trouvé');
        }
        const data = await response.json();
        setCharacter(data);
        setMainImage(data.mainImage || '');
        setHeaderBackground(data.headerBackground || '');
        
        // Parse les images et vidéos JSON
        try {
          setAdditionalImages(JSON.parse(data.images || '[]'));
          setVideos(JSON.parse(data.videos || '[]'));
        } catch (e) {
          console.error('Erreur lors du parsing des images ou vidéos', e);
          setAdditionalImages([]);
          setVideos([]);
        }
      } catch (error) {
        setError('Erreur lors du chargement du personnage');
      } finally {
        setLoading(false);
      }
    };

    fetchCharacter();
  }, [id]);

  // Charger les races disponibles
  useEffect(() => {
    const fetchRaces = async () => {
      try {
        const response = await fetch('/api/wiki/races');
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des races');
        }
        const data = await response.json();
        setRaces(data.map((race: any) => ({ id: race.id, name: race.name })));
      } catch (error) {
        console.error('Error loading races:', error);
      } finally {
        setRacesLoading(false);
      }
    };

    fetchRaces();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!id) return;
    
    setSaving(true);
    setError('');

    try {
      const formData = new FormData(e.currentTarget);
      
      // Pour la race, donner la priorité à customRace si elle est remplie
      const customRace = formData.get('customRace');
      let race = undefined;
      let raceId = formData.get('raceId') || undefined;
      
      if (customRace && customRace.toString().trim() !== '') {
        race = customRace;
        raceId = undefined;
      }
      
      const data = {
        name: formData.get('name'),
        lastName: formData.get('lastName') || null,
        title: formData.get('title') || null,
        race,
        raceId,
        class: formData.get('class') || null,
        faction: formData.get('faction') || null,
        alignment: formData.get('alignment') || null,
        background: formData.get('background') || null,
        description: formData.get('description') || null,
        mainImage: mainImage || null,
        headerBackground: headerBackground || null,
        images: JSON.stringify(additionalImages.filter(img => img.trim() !== '')),
        videos: JSON.stringify(videos.filter(video => video.trim() !== '')),
      };

      const response = await fetch(`/api/wiki/characters/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du personnage');
      }

      router.push(`/wiki/characters/${id}`);
    } catch (error) {
      setError('Une erreur est survenue lors de la mise à jour du personnage');
    } finally {
      setSaving(false);
    }
  };

  if (!id) {
    return (
      <div className="min-h-screen bg-medieval-900 text-medieval-parchment p-8 relative">
        <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-medieval-900/95 via-medieval-900/85 to-medieval-900/95"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-title font-bold mb-8 text-medieval-highlight">Erreur</h1>
          <p>ID de personnage manquant</p>
          <button
            onClick={() => router.back()}
            className="text-medieval-ethereal hover:text-medieval-highlight mt-4 inline-block font-title transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-medieval-900 text-medieval-parchment p-8 relative">
        <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-medieval-900/95 via-medieval-900/85 to-medieval-900/95"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="animate-pulse">
            <div className="h-8 bg-medieval-800 rounded w-1/4 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-medieval-800 rounded w-3/4"></div>
              <div className="h-4 bg-medieval-800 rounded w-1/2"></div>
              <div className="h-4 bg-medieval-800 rounded w-2/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-medieval-900 text-medieval-parchment p-8 relative">
        <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-medieval-900/95 via-medieval-900/85 to-medieval-900/95"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-title font-bold mb-8 text-medieval-highlight">Erreur</h1>
          <p>{error || 'Personnage non trouvé'}</p>
          <button
            onClick={() => router.back()}
            className="text-medieval-ethereal hover:text-medieval-highlight mt-4 inline-block font-title transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!session?.user) {
    return (
      <div className="min-h-screen bg-medieval-900 text-medieval-parchment p-8 relative">
        <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-medieval-900/95 via-medieval-900/85 to-medieval-900/95"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-title font-bold mb-8 text-medieval-highlight">Accès refusé</h1>
          <p>Vous devez être connecté pour modifier un personnage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medieval-900 text-medieval-parchment p-8 relative">
      <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-medieval-900/95 via-medieval-900/85 to-medieval-900/95"></div>
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl font-title font-bold mb-8 text-medieval-highlight flame-effect">Modifier {character.name}</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-panel rounded-md p-6 border border-medieval-ethereal/20">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-title mb-2 text-medieval-parchment">Prénom *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={character.name}
                  required
                  className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                />
              </div>

              <div>
                <label className="block text-sm font-title mb-2 text-medieval-parchment">Nom de famille</label>
                <input
                  type="text"
                  name="lastName"
                  defaultValue={character.lastName}
                  className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                />
              </div>

              <div>
                <label className="block text-sm font-title mb-2 text-medieval-parchment">Titre</label>
                <input
                  type="text"
                  name="title"
                  defaultValue={character.title}
                  className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                />
              </div>

              <div>
                <label className="block text-sm font-title mb-2 text-medieval-parchment">Race</label>
                <div className="flex flex-col space-y-4">
                  <select
                    name="raceId"
                    defaultValue={character.raceId || ''}
                    className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                  >
                    <option value="">Sélectionner une race existante...</option>
                    {racesLoading ? (
                      <option disabled>Chargement des races...</option>
                    ) : (
                      races.map(race => (
                        <option key={race.id} value={race.id}>{race.name}</option>
                      ))
                    )}
                  </select>
                  
                  <div className="flex items-center">
                    <span className="text-gray-400 px-2">ou</span>
                    <div className="flex-1 border-t border-gray-700"></div>
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      name="customRace"
                      placeholder="Saisir une nouvelle race..."
                      defaultValue={character.race || ''}
                      className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Si vous saisissez une nouvelle race, elle ne sera pas enregistrée dans la base de données des races.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-title mb-2 text-medieval-parchment">Classe</label>
                <input
                  type="text"
                  name="class"
                  defaultValue={character.class}
                  className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                />
              </div>

              <div>
                <label className="block text-sm font-title mb-2 text-medieval-parchment">Faction</label>
                <input
                  type="text"
                  name="faction"
                  defaultValue={character.faction}
                  className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                />
              </div>

              <div>
                <label className="block text-sm font-title mb-2 text-medieval-parchment">Alignement</label>
                <select
                  name="alignment"
                  defaultValue={character.alignment || ''}
                  className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                >
                  <option value="">Non spécifié</option>
                  <option value="GOOD">Bon</option>
                  <option value="NEUTRAL">Neutre</option>
                  <option value="EVIL">Mauvais</option>
                </select>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-md p-6 border border-medieval-ethereal/20">
            <div>
              <label className="block text-sm font-title mb-2 text-medieval-parchment">Description</label>
              <textarea
                name="description"
                defaultValue={character.description}
                rows={6}
                className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
              ></textarea>
            </div>
          </div>

          <div className="glass-panel rounded-md p-6 border border-medieval-ethereal/20">
            <div>
              <label className="block text-sm font-title mb-2 text-medieval-parchment">Histoire</label>
              <textarea
                name="background"
                defaultValue={character.background}
                rows={10}
                className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
              ></textarea>
            </div>
          </div>

          <div className="glass-panel rounded-md p-6 border border-medieval-ethereal/20">
            <h2 className="text-xl font-title text-medieval-highlight mb-6">Médias</h2>
            
            <div className="mb-8">
              <label className="block text-sm font-title mb-2 text-medieval-parchment">Image principale</label>
              <ImageUploader 
                onImageUploaded={setMainImage}
                currentImage={mainImage}
                className="bg-medieval-700/30 rounded-md overflow-hidden"
                label=""
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-title mb-2 text-medieval-parchment">Image d'arrière-plan de la page</label>
              <ImageUploader 
                onImageUploaded={setHeaderBackground}
                currentImage={headerBackground}
                className="bg-medieval-700/30 rounded-md overflow-hidden"
                label=""
              />
              <p className="text-sm text-medieval-parchment/70 mt-2">Cette image sera utilisée comme arrière-plan dans l'en-tête de la page de détail du personnage.</p>
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-title mb-2 text-medieval-parchment">Images additionnelles</label>
              <MultipleImageUploader 
                onImagesChanged={setAdditionalImages}
                initialImages={additionalImages}
                label=""
              />
            </div>
            
            <div>
              <label className="block text-sm font-title mb-2 text-medieval-parchment">Vidéos</label>
              <VideoUploader 
                onVideoUploaded={(url) => {
                  setVideos(prev => [...prev, url]);
                }}
                currentVideo=""
                label=""
              />
              {videos.length > 0 && (
                <div className="mt-4 space-y-2">
                  {videos.map((video, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-medieval-700/30 rounded-md">
                      <span className="text-sm truncate max-w-lg">{video}</span>
                      <button
                        type="button"
                        onClick={() => {
                          const newVideos = [...videos];
                          newVideos.splice(index, 1);
                          setVideos(newVideos);
                        }}
                        className="text-red-500 hover:text-red-400"
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn-medieval rounded-md px-6 py-2.5 shadow-md hover:shadow-medieval-glow transition-all"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={saving}
              className="btn-medieval rounded-md px-8 py-2.5 shadow-md hover:shadow-medieval-glow transition-all flex items-center space-x-2"
            >
              {saving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Enregistrement...</span>
                </>
              ) : (
                <span>Enregistrer</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 