import React, { useState, useEffect, useRef } from 'react';
import { AiModel } from '../types';
import { ClipboardIcon, CheckIcon, LoadingSpinner, PhotoIcon, XCircleIcon, SparklesIcon } from './Icons';

interface ResultDisplayProps {
  prompt: string;
  isLoading: boolean;
  selectedModel: AiModel;
  onGenerateImage: (referenceImage: File | null, aspectRatio: string) => void;
  generatedImage: string | null;
  isImageLoading: boolean;
}

export default function ResultDisplay({ 
    prompt, 
    isLoading, 
    selectedModel,
    onGenerateImage,
    generatedImage,
    isImageLoading
}: ResultDisplayProps): React.ReactNode {
  const [copied, setCopied] = useState(false);
  const [referenceImage, setReferenceImage] = useState<File | null>(null);
  const [referencePreview, setReferencePreview] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>("1:1");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (prompt) {
      setCopied(false);
    }
  }, [prompt]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setReferenceImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setReferencePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveReference = () => {
    setReferenceImage(null);
    setReferencePreview(null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 h-full animate-pulse">
        <LoadingSpinner />
        <p className="mt-6 text-sm font-bold tracking-widest text-brand-red uppercase">Processing...</p>
      </div>
    );
  }

  if (!prompt) {
    return (
        <div className="flex-1 flex flex-col items-center justify-center p-6 bg-white dark:bg-black border border-gray-200 dark:border-gray-800 border-dashed h-full">
            <div className="text-center">
                <h3 className="text-xl font-black text-gray-200 dark:text-gray-800 uppercase tracking-tighter">Awaiting Output</h3>
            </div>
        </div>
    ); 
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 overflow-hidden relative animate-fade-in shadow-2xl">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 bg-brand-black text-white border-b border-gray-800 shrink-0">
        <h2 className="text-xs font-bold uppercase tracking-widest text-brand-red">Generated Output</h2>
        <button
            onClick={handleCopy}
            className="hover:text-brand-red transition-colors text-white"
            title="Copy to clipboard"
        >
            {copied ? <CheckIcon /> : <ClipboardIcon />}
        </button>
      </div>
      
      {/* Prompt Text Section - Fixed max height to ensure space for image */}
      <div className="p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto max-h-[150px] border-b border-gray-200 dark:border-gray-800 custom-scrollbar shrink-0">
        <p className="text-black dark:text-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">{prompt}</p>
      </div>

      {selectedModel === AiModel.NANO_BANANA && (
        <div className="flex-1 flex flex-col bg-white dark:bg-black min-h-0">
             {!generatedImage && !isImageLoading ? (
                 <div className="flex flex-col h-full p-6 overflow-y-auto custom-scrollbar">
                     <div className="flex-1 flex flex-col justify-center gap-8">
                         <div className="w-full">
                            <label className="block mb-4 text-[10px] text-gray-400 uppercase font-black tracking-widest text-center">Select Ratio</label>
                            <div className="flex flex-wrap gap-2 justify-center">
                                {["1:1", "3:4", "4:3", "9:16", "16:9"].map((ratio) => (
                                    <button
                                        key={ratio}
                                        onClick={() => setAspectRatio(ratio)}
                                        className={`px-4 py-2 text-xs font-bold transition-all border ${
                                            aspectRatio === ratio
                                                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                                                : 'bg-transparent text-gray-500 hover:text-black dark:hover:text-white border-gray-200 dark:border-gray-800'
                                        }`}
                                    >
                                        {ratio}
                                    </button>
                                ))}
                            </div>
                         </div>

                        <div className="w-full">
                            <label className="block mb-4 text-[10px] text-gray-400 uppercase font-black tracking-widest text-center">
                                Visual Reference
                            </label>
                            
                            {!referencePreview ? (
                                <div className="flex justify-center">
                                    <label htmlFor="ref-upload" className="flex flex-col items-center justify-center w-full max-w-xs h-24 border border-gray-300 dark:border-gray-700 hover:border-brand-red dark:hover:border-brand-red border-dashed cursor-pointer bg-gray-50 dark:bg-gray-900 transition-colors group">
                                        <div className="flex flex-col items-center justify-center">
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 group-hover:text-brand-red">Upload Image</p>
                                        </div>
                                        <input id="ref-upload" type="file" className="hidden" accept="image/*" onChange={handleFileChange} ref={fileInputRef} />
                                    </label>
                                </div>
                            ) : (
                                <div className="relative w-full h-32 flex items-center justify-center">
                                     <div className="relative h-full aspect-square bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden">
                                        <img src={referencePreview} alt="Reference" className="h-full w-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                                        <button 
                                            onClick={handleRemoveReference}
                                            className="absolute top-0 right-0 bg-brand-red text-white p-1 hover:bg-black transition-colors"
                                        >
                                            <XCircleIcon />
                                        </button>
                                     </div>
                                </div>
                            )}
                        </div>
                     </div>

                     <button
                         onClick={() => onGenerateImage(referenceImage, aspectRatio)}
                         className="mt-6 w-full flex items-center justify-center gap-3 px-8 py-4 bg-brand-red text-white font-black uppercase tracking-widest hover:bg-black dark:hover:bg-white dark:hover:text-black transition-all duration-300 text-sm group shrink-0"
                     >
                         <PhotoIcon />
                         Render Visual
                         <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                     </button>
                 </div>
             ) : isImageLoading ? (
                 <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
                     <LoadingSpinner />
                     <p className="mt-4 text-xs font-bold uppercase tracking-widest text-gray-400 animate-pulse">Rendering...</p>
                 </div>
             ) : (
                 <div className="flex flex-col h-full bg-white dark:bg-black">
                     {/* Image Container - takes available space */}
                     <div className="flex-1 relative w-full bg-checkered bg-center flex items-center justify-center overflow-hidden min-h-0">
                         <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 opacity-50 z-0"></div>
                         <img 
                            src={generatedImage!} 
                            alt="Generated result" 
                            className="relative z-10 max-w-full max-h-full object-contain shadow-2xl p-4"
                         />
                     </div>
                     
                     {/* Controls Container - fixed at bottom, distinct background */}
                     <div className="shrink-0 p-4 bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 flex justify-between items-center z-10">
                        <span className="text-[10px] font-mono text-gray-500 uppercase">{aspectRatio} / NANO BANANA</span>
                        <div className="flex gap-2">
                            <a 
                                href={generatedImage!} 
                                download={`nano-banana-${aspectRatio}.png`}
                                className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold uppercase tracking-wider hover:bg-brand-red dark:hover:bg-brand-red hover:text-white dark:hover:text-white transition-colors border border-black dark:border-white"
                            >
                                Save
                            </a>
                            <button 
                                onClick={() => {
                                    onGenerateImage(referenceImage, aspectRatio); 
                                }}
                                className="px-4 py-2 border border-black dark:border-white text-black dark:text-white text-[10px] font-bold uppercase tracking-wider hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                     </div>
                 </div>
             )}
        </div>
      )}
    </div>
  );
}