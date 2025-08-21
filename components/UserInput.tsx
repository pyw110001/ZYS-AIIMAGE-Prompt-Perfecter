
import React, { useState, useRef } from 'react';
import { PhotoIcon, XCircleIcon } from './Icons';

interface UserInputProps {
  textInput: string;
  onTextInput: (value: string) => void;
  onImageUpload: (file: File | null) => void;
  isLoading: boolean;
}

export default function UserInput({ textInput, onTextInput, onImageUpload, isLoading }: UserInputProps): React.ReactNode {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      onImageUpload(file);
    }
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    onImageUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      <textarea
        value={textInput}
        onChange={(e) => onTextInput(e.target.value)}
        placeholder="e.g., a cybernetic fox wandering through a neon-lit ancient forest..."
        className="w-full h-48 p-4 bg-gray-900/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-colors duration-300 resize-none disabled:opacity-50"
        disabled={isLoading || !!imagePreview}
      />
      <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-600 rounded-lg p-4 relative transition-colors duration-300 hover:border-cyan-500">
        {imagePreview ? (
          <>
            <img src={imagePreview} alt="Image preview" className="max-h-full max-w-full object-contain rounded-md" />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-3 -right-3 bg-gray-800 rounded-full text-gray-400 hover:text-white hover:bg-red-600 transition-all"
              aria-label="Remove image"
              disabled={isLoading}
            >
              <XCircleIcon />
            </button>
          </>
        ) : (
          <div className="text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              id="image-upload"
              disabled={isLoading}
            />
            <label htmlFor="image-upload" className={`cursor-pointer ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}>
                <div className="flex flex-col items-center text-gray-400">
                    <PhotoIcon />
                    <p className="mt-2 font-semibold text-cyan-400">Upload an image</p>
                    <p className="text-xs">PNG, JPG, WEBP</p>
                </div>
            </label>
            <p className="mt-2 text-gray-500">or describe it in the text box</p>
          </div>
        )}
      </div>
    </div>
  );
}
