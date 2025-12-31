import React, { useState, useCallback, useEffect } from 'react';
import { AiModel, HistoryItem } from './types';
import { generatePrompt, generateImage } from './services/geminiService';
import Header from './components/Header';
import ModelSelector from './components/ModelSelector';
import UserInput from './components/UserInput';
import ResultDisplay from './components/ResultDisplay';
import HistoryList from './components/HistoryList';
import { SparklesIcon, ExclamationTriangleIcon } from './components/Icons';

export default function App(): React.ReactNode {
  const [textInput, setTextInput] = useState<string>('');
  const [uploadedImage, setUploadedImage] = useState<File | null>(null);
  const [selectedModel, setSelectedModel] = useState<AiModel>(AiModel.MIDJOURNEY);
  const [generatedPrompt, setGeneratedPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(false);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Initialize Dark Mode based on preference or default to true
  useEffect(() => {
    if (localStorage.getItem('theme') === 'light') {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(prev => {
      const newMode = !prev;
      if (newMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return newMode;
    });
  };

  // Add scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .custom-scrollbar::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }
      .custom-scrollbar::-webkit-scrollbar-track {
        background: transparent;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb {
        background: #333;
        border-radius: 0;
      }
      .custom-scrollbar::-webkit-scrollbar-thumb:hover {
        background: #FF3B30;
      }
      .bg-checkered {
        background-image: 
          linear-gradient(45deg, #1a1a1a 25%, transparent 25%), 
          linear-gradient(-45deg, #1a1a1a 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #1a1a1a 75%), 
          linear-gradient(-45deg, transparent 75%, #1a1a1a 75%);
        background-size: 20px 20px;
        background-position: 0 0, 0 10px, 10px -10px, -10px 0px;
      }
      html.dark .bg-checkered {
         background-image: 
          linear-gradient(45deg, #111 25%, transparent 25%), 
          linear-gradient(-45deg, #111 25%, transparent 25%), 
          linear-gradient(45deg, transparent 75%, #111 75%), 
          linear-gradient(-45deg, transparent 75%, #111 75%);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!textInput && !uploadedImage) {
      setError('Input Required');
      return;
    }

    setIsLoading(true);
    setError(null);
    setGeneratedPrompt('');
    setGeneratedImage(null);

    try {
      const result = await generatePrompt(selectedModel, textInput, uploadedImage);
      setGeneratedPrompt(result);

      // Add to history
      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        model: selectedModel,
        prompt: result,
        originalInput: textInput || (uploadedImage ? 'Visual Analysis' : ''),
        timestamp: Date.now(),
      };
      setHistory(prev => [newItem, ...prev]);

    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : 'Unknown Error');
    } finally {
      setIsLoading(false);
    }
  }, [selectedModel, textInput, uploadedImage]);

  const handleImageGeneration = async (referenceImage: File | null, aspectRatio: string) => {
    if (!generatedPrompt) return;

    setIsImageLoading(true);
    setError(null);
    
    try {
        if (window.aistudio && window.aistudio.hasSelectedApiKey) {
            const hasKey = await window.aistudio.hasSelectedApiKey();
            if (!hasKey && window.aistudio.openSelectKey) {
                await window.aistudio.openSelectKey();
            }
        }

        const imageBase64 = await generateImage(generatedPrompt, referenceImage, aspectRatio);
        setGeneratedImage(imageBase64);
    } catch (e: any) {
        console.error(e);
        if (e.message && e.message.includes("Requested entity was not found")) {
             if (window.aistudio && window.aistudio.openSelectKey) {
                 await window.aistudio.openSelectKey();
                 setError("Authorization Failed: Select API Key");
             } else {
                 setError("Error: Key Not Found");
             }
        } else {
            setError(e instanceof Error ? e.message : 'Generation Failed');
        }
    } finally {
        setIsImageLoading(false);
    }
  };
  
  const handleImageUpload = (file: File | null) => {
    setUploadedImage(file);
    if(file){
        setTextInput('');
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
      setGeneratedPrompt(item.prompt);
      setSelectedModel(item.model);
      setGeneratedImage(null); // Reset image on history select
      if (item.originalInput !== 'Visual Analysis') {
          setTextInput(item.originalInput);
      }
  };

  const isGenerateDisabled = isLoading || (!textInput && !uploadedImage);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'dark bg-brand-black' : 'bg-brand-white'}`}>
      {/* Top Header */}
      <div className="shrink-0 z-10">
        <Header isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      </div>

      {/* Main Content Grid */}
      <main className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-0 p-0 min-h-0 bg-gray-100 dark:bg-black">
        
        {/* Left Column: Input & Controls (3/12 cols) */}
        <div className="lg:col-span-3 flex flex-col min-h-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-black">
            <div className="p-6 flex flex-col h-full overflow-y-auto custom-scrollbar">
                <div className="space-y-8 flex-1">
                    <div>
                        <h2 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">01. Model Selection</h2>
                        <ModelSelector selectedModel={selectedModel} onSelectModel={setSelectedModel} />
                    </div>
                    
                    <div className="flex-1 flex flex-col">
                        <h2 className="text-[10px] font-black text-gray-400 mb-3 uppercase tracking-widest">02. Creative Input</h2>
                        <UserInput
                            textInput={textInput}
                            onTextInput={setTextInput}
                            onImageUpload={handleImageUpload}
                            isLoading={isLoading}
                        />
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-800">
                     <button
                        onClick={handleGenerate}
                        disabled={isGenerateDisabled}
                        className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest hover:bg-brand-red dark:hover:bg-brand-red dark:hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs group"
                        >
                        <SparklesIcon />
                        {isLoading ? 'Processing...' : 'Execute Prompt'}
                    </button>
                    {error && (
                        <div className="mt-4 flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold">
                            <ExclamationTriangleIcon />
                            <p className="uppercase tracking-wide">{error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Middle Column: Output (7/12 cols) */}
        <div className="lg:col-span-7 flex flex-col min-h-0 bg-gray-50 dark:bg-[#080808]">
             <div className="h-full p-6">
                <ResultDisplay 
                    prompt={generatedPrompt} 
                    isLoading={isLoading} 
                    selectedModel={selectedModel}
                    onGenerateImage={handleImageGeneration}
                    generatedImage={generatedImage}
                    isImageLoading={isImageLoading}
                />
             </div>
        </div>

        {/* Right Column: History (2/12 cols) */}
        <div className="lg:col-span-2 flex flex-col min-h-0 border-l border-gray-200 dark:border-gray-800">
            <HistoryList history={history} onSelect={handleSelectHistory} />
        </div>

      </main>
    </div>
  );
}