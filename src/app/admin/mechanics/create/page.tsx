'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

// Importer notre wrapper pour l'éditeur de texte
import QuillWrapper from '@/components/editor/QuillWrapper';

// Importer un composant d'upload d'image simulé
import ImageUploader from '@/components/ImageUploader';

interface FormData {
  title: string;
  summary: string;
  content: string;
  category: string;
  image: string;
}

export default function CreateMechanicArticlePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState<FormData>({
    title: '',
    summary: '',
    content: '',
    category: searchParams?.get('category') || 'combat',
    image: ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Fonction pour générer un arrière-plan aléatoire
  const getBgClass = () => {
    const bgClasses = ['bg-bg-1', 'bg-bg-2', 'bg-bg-3', 'bg-bg-4', 'bg-bg-5', 'bg-bg-6'];
    const randomIndex = Math.floor(Math.random() * bgClasses.length);
    return bgClasses[randomIndex];
  };

  const backgroundClass = getBgClass();

  useEffect(() => {
    // Rediriger si non connecté ou non admin
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session && !((session.user as any).role === 'ADMIN')) {
      router.push('/');
      return;
    }
  }, [status, session, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content: string) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, image: imageUrl }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      // Vérification basique
      if (!formData.title.trim()) {
        throw new Error('Le titre est requis');
      }
      if (!formData.summary.trim()) {
        throw new Error('Le résumé est requis');
      }
      if (!formData.content.trim()) {
        throw new Error('Le contenu est requis');
      }

      // Simuler un appel API pour sauvegarder l'article
      console.log('Nouvel article:', formData);
      
      // Rediriger vers la page admin de gestion des mécaniques après la création
      router.push('/admin/mechanics');
    } catch (error) {
      console.error('Erreur lors de la création de l\'article:', error);
      setError((error as Error).message || 'Une erreur est survenue lors de la création de l\'article');
    } finally {
      setSaving(false);
    }
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-medieval-900 text-medieval-parchment p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-medieval-800/70 rounded w-1/3 mb-8"></div>
            <div className="h-64 bg-medieval-800/70 rounded-md mb-6"></div>
            <div className="h-10 bg-medieval-800/70 rounded-md mb-4"></div>
            <div className="h-10 bg-medieval-800/70 rounded-md"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-medieval-900 text-medieval-parchment relative">
      {/* Arrière-plan avec image aléatoire et superposition */}
      <div className={`absolute inset-0 ${backgroundClass} bg-cover bg-center bg-fixed opacity-20`}></div>
      <div className="absolute inset-0 bg-gradient-to-b from-medieval-900/95 via-medieval-900/85 to-medieval-900/95"></div>
      
      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl md:text-4xl font-title text-medieval-highlight">Nouvel article de mécanique de jeu</h1>
            <Link 
              href="/admin/mechanics" 
              className="btn-medieval flex items-center rounded-md px-4 py-2 shadow-md hover:shadow-medieval-glow transition-all"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Retour
            </Link>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div className="glass-panel rounded-md border border-medieval-ethereal/20 p-6">
                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label htmlFor="title" className="block text-sm font-title mb-2 text-medieval-parchment">Titre*</label>
                    <input
                      type="text"
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-title mb-2 text-medieval-parchment">Catégorie*</label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                    >
                      <option value="combat">Combat</option>
                      <option value="progression">Progression</option>
                      <option value="crafting">Artisanat</option>
                      <option value="exploration">Exploration</option>
                      <option value="factions">Factions</option>
                      <option value="magic">Magie</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="summary" className="block text-sm font-title mb-2 text-medieval-parchment">Résumé*</label>
                    <textarea
                      id="summary"
                      name="summary"
                      value={formData.summary}
                      onChange={handleChange}
                      rows={3}
                      required
                      className="w-full px-3 py-2 bg-medieval-700/50 border border-medieval-ethereal/20 rounded-md focus:outline-none focus:ring-2 focus:ring-medieval-highlight/50 focus:border-medieval-highlight/50 text-medieval-parchment"
                      placeholder="Un bref résumé de l'article"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="glass-panel rounded-md border border-medieval-ethereal/20 p-6">
                <label className="block text-sm font-title mb-4 text-medieval-parchment">Image principale</label>
                <div className="mb-6">
                  <ImageUploader 
                    onImageUploaded={handleImageUpload}
                    currentImage={formData.image}
                    className="bg-medieval-700/30 rounded-md overflow-hidden"
                    label="Ajouter une image"
                  />
                </div>

                {formData.image && (
                  <div className="relative h-48 w-full md:w-1/2 rounded-md overflow-hidden mb-4">
                    <Image
                      src={formData.image}
                      alt="Aperçu de l'image"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>

              <div className="glass-panel rounded-md border border-medieval-ethereal/20 p-6">
                <label className="block text-sm font-title mb-4 text-medieval-parchment">Contenu*</label>
                <div className="quill-editor-medieval">
                  {typeof window !== 'undefined' && (
                    <QuillWrapper
                      value={formData.content}
                      onChange={handleContentChange}
                      className="text-medieval-parchment bg-medieval-700/30 rounded-md"
                    />
                  )}
                </div>
              </div>

              {error && (
                <div className="bg-red-900/50 border border-red-700 text-red-100 px-4 py-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Link
                  href="/admin/mechanics"
                  className="btn-medieval-secondary px-6 py-2.5 rounded-md border border-medieval-ethereal/30 hover:border-medieval-ethereal/60 transition-colors"
                >
                  Annuler
                </Link>
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
                      <span>Publication...</span>
                    </>
                  ) : (
                    <span>Publier l'article</span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
} 