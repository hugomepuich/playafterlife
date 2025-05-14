import { useState } from 'react';
import Image from 'next/image';
import ImageUploader from './ImageUploader';

interface MultipleImageUploaderProps {
  onImagesChanged: (images: string[]) => void;
  initialImages?: string[];
  className?: string;
  label?: string;
  maxImages?: number;
}

export default function MultipleImageUploader({
  onImagesChanged,
  initialImages = [],
  className = '',
  label = 'Images supplémentaires',
  maxImages = 10
}: MultipleImageUploaderProps) {
  const [images, setImages] = useState<string[]>(initialImages);
  const [error, setError] = useState('');

  const handleAddImage = () => {
    if (images.length >= maxImages) {
      setError(`Vous ne pouvez pas ajouter plus de ${maxImages} images.`);
      return;
    }
    setImages([...images, '']);
    setError('');
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
    onImagesChanged(newImages.filter(img => img !== ''));
    setError('');
  };

  const handleImageUploaded = (index: number, url: string) => {
    const newImages = [...images];
    newImages[index] = url;
    setImages(newImages);
    onImagesChanged(newImages.filter(img => img !== ''));
  };

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <label className="block text-sm font-medium">{label}</label>
        <button 
          type="button" 
          onClick={handleAddImage}
          className="px-2 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          + Ajouter une image
        </button>
      </div>
      
      {images.length > 0 ? (
        <div className="space-y-4">
          {images.map((image, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-800 rounded-lg">
              <div className="w-full md:w-1/3">
                <ImageUploader 
                  currentImage={image}
                  onImageUploaded={(url) => handleImageUploaded(index, url)}
                  label=""
                />
              </div>
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-medium">Image {index + 1}</h3>
                  {image && (
                    <p className="text-xs text-gray-400 truncate mt-1">{image}</p>
                  )}
                </div>
                <button 
                  type="button" 
                  onClick={() => handleRemoveImage(index)}
                  className="self-end px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                >
                  Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <button 
          type="button" 
          onClick={handleAddImage}
          className="w-full px-3 py-2 bg-gray-800 border border-gray-700 border-dashed rounded-lg text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
        >
          + Ajouter une image
        </button>
      )}
      
      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
} 