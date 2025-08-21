
import React, { useState, useEffect } from 'react';
import { ClipboardIcon, CheckIcon, LoadingSpinner } from './Icons';

interface ResultDisplayProps {
  prompt: string;
  isLoading: boolean;
}

export default function ResultDisplay({ prompt, isLoading }: ResultDisplayProps): React.ReactNode {
  const [copied, setCopied] = useState(false);

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

  if (isLoading) {
    return (
      <div className="w-full min-h-[150px] flex flex-col items-center justify-center p-6 bg-gray-800/50 rounded-2xl border border-gray-700">
        <LoadingSpinner />
        <p className="mt-4 text-lg text-cyan-400 animate-pulse">Crafting your masterpiece...</p>
      </div>
    );
  }

  if (!prompt) {
    return null; // Don't render anything if there's no prompt and not loading
  }

  return (
    <div className="w-full p-6 bg-gray-800/50 rounded-2xl border border-gray-700 relative group">
      <h2 className="text-xl font-bold text-cyan-400 mb-4">3. Generated Prompt</h2>
      <div className="p-4 bg-gray-900 rounded-lg text-gray-300 font-mono text-base whitespace-pre-wrap break-words">
        {prompt}
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-4 right-4 p-2 bg-gray-700 rounded-lg text-gray-400 hover:bg-cyan-500 hover:text-gray-900 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
        aria-label="Copy prompt"
      >
        {copied ? <CheckIcon /> : <ClipboardIcon />}
      </button>
    </div>
  );
}
