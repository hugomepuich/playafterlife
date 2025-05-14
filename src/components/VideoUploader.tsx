import { useState, useRef, ChangeEvent } from 'react';

interface VideoUploaderProps {
  onVideoUploaded: (videoUrl: string) => void;
  currentVideo?: string;
  className?: string;
  label?: string;
}

export default function VideoUploader({
  onVideoUploaded,
  currentVideo = '',
  className = '',
  label = 'Télécharger une vidéo'
}: VideoUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(currentVideo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Vérifier le type de fichier
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
    if (!validTypes.includes(file.type)) {
      setError('Type de fichier non pris en charge. Utilisez MP4, WEBM, OGG ou MOV.');
      return;
    }

    // Créer une URL pour la prévisualisation si possible
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setError('');

    // Uploader le fichier
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || 'Erreur lors du téléchargement');
      }

      const result = await response.json();
      onVideoUploaded(result.url);
    } catch (error) {
      console.error('Erreur:', error);
      setError(error instanceof Error ? error.message : 'Erreur lors du téléchargement');
    } finally {
      setIsUploading(false);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveVideo = () => {
    setPreview('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onVideoUploaded('');
  };

  return (
    <div className={`w-full ${className}`}>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <div className="flex flex-col items-center">
        {preview ? (
          <div className="relative w-full mb-4">
            <video 
              src={preview} 
              controls 
              className="w-full rounded-lg"
            />
            <button
              type="button"
              onClick={handleRemoveVideo}
              className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full"
              aria-label="Supprimer la vidéo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div
            onClick={handleButtonClick}
            className="w-full h-48 border-2 border-dashed border-gray-700 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-gray-500 transition-colors mb-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 w-12 text-gray-500 mb-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            <p className="text-gray-500 text-sm">Cliquez pour télécharger une vidéo</p>
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          accept="video/mp4,video/webm,video/ogg,video/quicktime"
          className="hidden"
          onChange={handleFileChange}
        />

        {!preview && (
          <button
            type="button"
            onClick={handleButtonClick}
            disabled={isUploading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? 'Téléchargement...' : 'Sélectionner une vidéo'}
          </button>
        )}

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>
    </div>
  );
} 