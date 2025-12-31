import React from 'react';
import { BrainCircuitIcon, SunIcon, MoonIcon } from './Icons';

interface HeaderProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Header({ isDarkMode, toggleTheme }: HeaderProps): React.ReactNode {
  return (
    <header className="flex items-center justify-between px-6 py-4 bg-white dark:bg-brand-black border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center gap-3">
            <div className="bg-brand-red p-1">
                <BrainCircuitIcon className="w-8 h-8 text-white" />
            </div>
            <div>
                <h1 className="text-2xl font-black tracking-tighter uppercase text-black dark:text-white leading-none">
                    Z<span className="text-brand-red">.</span>AI
                </h1>
                <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500 uppercase mt-0.5">Prompt Architecture Studio</p>
            </div>
        </div>
        
        <button 
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-black dark:text-white"
            aria-label="Toggle theme"
        >
            {isDarkMode ? <SunIcon /> : <MoonIcon />}
        </button>
    </header>
  );
}