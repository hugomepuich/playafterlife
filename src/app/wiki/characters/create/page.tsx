'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ImageUploader from '@/components/ImageUploader';
import MultipleImageUploader from '@/components/MultipleImageUploader';
import VideoUploader from '@/components/VideoUploader';

export default function CreateCharacterPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [mainImage, setMainImage] = useState('');
  const [headerBackground, setHeaderBackground] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [races, setRaces] = useState<{id: string, name: string}[]>([]);
  const [racesLoading, setRacesLoading] = useState(true);

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
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      lastName: formData.get('lastName'),
      title: formData.get('title'),
      race: formData.get('customRace') || undefined,
      raceId: formData.get('raceId') || undefined,
      class: formData.get('class'),
      faction: formData.get('faction'),
      alignment: formData.get('alignment'),
      background: formData.get('background'),
      description: formData.get('description'),
      mainImage: mainImage,
      headerBackground: headerBackground,
      images: JSON.stringify(additionalImages.filter(img => img.trim() !== '')),
      videos: JSON.stringify(videos.filter(video => video.trim() !== '')),
    };

    try {
      const response = await fetch('/api/wiki/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du personnage');
      }

      router.push('/wiki/characters');
    } catch (error) {
      setError('Une erreur est survenue lors de la création du personnage');
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Accès refusé</h1>
          <p>Vous devez être connecté pour créer un personnage.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Créer un personnage</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">Prénom *</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Nom de famille</label>
              <input
                type="text"
                name="lastName"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Titre</label>
              <input
                type="text"
                name="title"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Race</label>
              <div className="flex flex-col space-y-4">
                <select
                  name="raceId"
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Si vous saisissez une nouvelle race, elle ne sera pas enregistrée dans la base de données des races.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Classe</label>
              <input
                type="text"
                name="class"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Faction</label>
              <input
                type="text"
                name="faction"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Karma</label>
              <select
                name="alignment"
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner...</option>
                <option value="GOOD">Bon</option>
                <option value="NEUTRAL">Neutre</option>
                <option value="EVIL">Mauvais</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <textarea
              name="description"
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Histoire</label>
            <textarea
              name="background"
              rows={4}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <ImageUploader
            onImageUploaded={setMainImage}
            label="Image Principale"
          />

          <ImageUploader
            onImageUploaded={setHeaderBackground}
            label="Image d'arrière-plan de la page"
          />
          <p className="text-sm text-gray-400 mt-1 mb-4">Cette image sera utilisée comme arrière-plan dans l'en-tête de la page de détail du personnage.</p>

          <MultipleImageUploader
            onImagesChanged={setAdditionalImages}
            label="Images Supplémentaires"
          />

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium">Vidéos</label>
              <button 
                type="button" 
                onClick={() => setVideos([...videos, ''])}
                className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              >
                + Ajouter une vidéo
              </button>
            </div>
            
            {videos.length > 0 ? (
              <div className="space-y-4">
                {videos.map((video, index) => (
                  <div key={index} className="flex flex-col gap-2 p-4 bg-gray-800 rounded-lg">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-medium">Vidéo {index + 1}</h3>
                      <button 
                        type="button" 
                        onClick={() => {
                          const newVideos = [...videos];
                          newVideos.splice(index, 1);
                          setVideos(newVideos);
                        }}
                        className="px-2 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        Supprimer
                      </button>
                    </div>
                    
                    <div className="flex gap-2 items-center">
                      <div className="flex-1">
                        <VideoUploader 
                          onVideoUploaded={(url) => {
                            const newVideos = [...videos];
                            newVideos[index] = url;
                            setVideos(newVideos);
                          }}
                          currentVideo={video}
                          label=""
                        />
                      </div>
                      
                      <div className="text-sm text-gray-400 mt-2">
                        {video && `Fichier: ${video.split('/').pop()}`}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <button 
                type="button" 
                onClick={() => setVideos([''])}
                className="w-full px-3 py-2 bg-gray-800 border border-gray-700 border-dashed rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
              >
                + Ajouter une vidéo
              </button>
            )}
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Création...' : 'Créer le personnage'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 