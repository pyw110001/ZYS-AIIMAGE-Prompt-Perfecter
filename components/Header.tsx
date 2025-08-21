
import React from 'react';
import { BrainCircuitIcon } from './Icons';

export default function Header(): React.ReactNode {
  return (
    <header className="text-center">
        <div className="inline-flex items-center justify-center gap-4">
            <BrainCircuitIcon />
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-teal-500">
                AI Art Prompt Architect
            </h1>
        </div>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Craft the perfect prompt for your AI masterpieces. Turn simple ideas or reference images into detailed instructions for Midjourney & Flux.
      </p>
    </header>
  );
}
