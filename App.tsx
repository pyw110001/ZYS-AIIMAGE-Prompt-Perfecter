
import React, { useState, useCallback } from 'react';
import { AiModel } from './types';
import { generatePrompt } from './services/geminiService';
import Header from './components/Header';
import ModelSelector from './components/ModelSelector';
import UserInput from './components/UserInput';
import ResultDisplay from './components/ResultDisplay';
import { SparklesIcon, ExclamationTriangleIcon } from './components/Icons';

export default function App(): React.ReactNode {
  const [textInput, setTextInput] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<AiModel>(AiModel.MIDJOURNEY);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!textInput && !uploadedImage) {
      setError('Please provide a description or upload an image.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');

    try {
      const result = await generatePrompt(selectedModel, textInput, uploadedImage);
      setGeneratedPrompt(result);
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'An unknown error occurred. Please check the console and ensure your API key is configured.');
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel, textInput, uploadedImage]);
  
  const handleImageUpload = (file: File | null) => {
    setUploadedImage(file);
    if(file){
        setTextInput('');
    }
  };

  const isGenerateDisabled = isLoading || (!textInput && !uploadedImage);

  return (
    <div className="min-h-screen bg-gray-900 font-sans text-gray-200 flex flex-col items-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-4xl mx-auto">
        <Header />
        <main className="mt-8 space-y-8">
          <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
            <h2 className="text-xl font-bold text-cyan-400 mb-2">1. Select AI Model</h2>
            <p className="text-gray-400 mb-4">Choose the target AI model to generate a tailored prompt.</p>
            <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
          </div>

          <div className="p-8 bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-2xl border border-gray-700">
            <h2 className="text-xl font-bold text-cyan-400 mb-2">2. Provide Input</h2>
            <p className="text-gray-400 mb-4">Describe your desired image or upload a reference picture for analysis.</p>
            <UserInput
              textInput={textInput}
              onTextInput={setTextInput}
              onImageUpload={handleImageUpload}
              isLoading={isLoading}
            />
          </div>

          <div className="flex justify-center">
            <button
              onClick={handleGenerate}
              disabled={isGenerateDisabled}
              className="flex items-center justify-center gap-2 px-8 py-4 bg-cyan-500 text-gray-900 font-bold rounded-full shadow-lg hover:bg-cyan-400 transition-all duration-300 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transform hover:scale-105 disabled:scale-100 focus:outline-none focus:ring-4 focus:ring-cyan-500/50"
            >
              <SparklesIcon />
              {isLoading ? 'Generating...' : 'Generate Prompt'}
            </button>
          </div>
          
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-900/50 border border-red-700 text-red-300 rounded-lg">
                <ExclamationTriangleIcon />
                <div>
                    <h3 className="font-bold">Error</h3>
                    <p>{error}</p>
                </div>
            </div>
          )}

          <ResultDisplay prompt={generatedPrompt} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
}
