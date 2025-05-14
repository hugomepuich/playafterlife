'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ImageUploader from '@/components/ImageUploader';

export default function CreateRacePage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name'),
      description: formData.get('description'),
      image: image,
    };

    try {
      const response = await fetch('/api/wiki/races', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.message || 'Erreur lors de la création de la race');
      }

      router.push('/wiki/races');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  // Génération d'une classe de fond aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };
  
  const backgroundClass = getBgClass();

  // Vérifier si l'utilisateur est connecté et est un administrateur
  if (!session || (session.user as any).role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-black text-white p-8 relative">
        <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <h1 className="text-4xl font-title font-bold text-white mb-8 flame-effect">Accès refusé</h1>
          <p className="text-gray-400">Vous devez être administrateur pour créer une race.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8 relative">
      <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/85 to-black/95"></div>
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl font-title font-bold text-white mb-8 flame-effect">Créer une nouvelle race</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="glass-panel rounded-md p-6 border border-gray-700/30">
            <div className="mb-6">
              <label className="block text-sm font-title mb-2 text-white">Nom de la race *</label>
              <input
                type="text"
                name="name"
                required
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-white"
                placeholder="ex: Humain, Elfe, Nain..."
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-title mb-2 text-white">Description</label>
              <textarea
                name="description"
                rows={4}
                className="w-full px-3 py-2 bg-gray-900/50 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white text-white"
                placeholder="Décrivez cette race, son histoire, ses caractéristiques..."
              />
            </div>

            <div>
              <label className="block text-sm font-title mb-2 text-white">Image</label>
              <ImageUploader
                onImageUploaded={setImage}
                currentImage={image}
                className="border border-dashed border-gray-700 rounded-md p-4 hover:border-gray-500 transition-colors bg-gray-900/30"
              />
              {image && (
                <div className="mt-2 text-xs text-gray-500">
                  Image téléchargée avec succès
                </div>
              )}
            </div>
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
              {loading ? 'Création...' : 'Créer la race'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 