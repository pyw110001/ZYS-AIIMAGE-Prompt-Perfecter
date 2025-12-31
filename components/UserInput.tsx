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
    <div className="flex flex-col gap-0 h-full min-h-0 border border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
      <textarea
        value={textInput}
        onChange={(e) => onTextInput(e.target.value)}
        placeholder="TYPE YOUR VISION HERE..."
        className="flex-1 w-full p-4 bg-transparent border-b border-gray-200 dark:border-gray-800 text-black dark:text-white placeholder-gray-400 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-900 transition-colors duration-300 resize-none disabled:opacity-50 text-sm font-mono leading-relaxed min-h-[150px] rounded-none"
        disabled={isLoading || !!imagePreview}
      />
      
      <div className={`relative transition-all duration-300 ${imagePreview ? 'h-40' : 'h-16 hover:bg-gray-50 dark:hover:bg-gray-900'}`}>
        {imagePreview ? (
          <div className="w-full h-full p-0 relative group">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-brand-red text-white p-1 hover:bg-red-700 transition-colors shadow-none rounded-none"
              aria-label="Remove image"
              disabled={isLoading}
            >
              <XCircleIcon />
            </button>
            <div className="absolute bottom-0 left-0 bg-brand-red text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                Reference Active
            </div>
          </div>
        ) : (
          <div className="w-full h-full">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              id="image-upload"
              disabled={isLoading}
            />
            <label htmlFor="image-upload" className={`cursor-pointer w-full h-full flex items-center justify-center gap-2 text-gray-500 hover:text-brand-red dark:hover:text-brand-red transition-colors ${isLoading ? 'cursor-not-allowed opacity-50' : ''}`}>
                <PhotoIcon />
                <span className="text-xs font-bold uppercase tracking-widest">Upload Reference</span>
            </label>
          </div>
        )}
      </div>
    </div>
  );
}