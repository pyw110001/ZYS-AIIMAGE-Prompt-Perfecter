import React from 'react';
import { AiModel } from '../types';

interface ModelSelectorProps {
  selectedModel: AiModel;
  onSelectModel: (model: AiModel) => void;
}

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps): React.ReactNode {
  const models = [AiModel.MIDJOURNEY, AiModel.NANO_BANANA];

  return (
    <div className="flex flex-col sm:flex-row gap-0 border border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-black">
      {models.map((model, index) => (
        <button
          key={model}
          onClick={() => onSelectModel(model)}
          className={`flex-1 text-center px-4 py-4 font-bold text-sm tracking-wide uppercase transition-all duration-300 focus:outline-none 
            ${selectedModel === model
              ? 'bg-brand-red text-white'
              : 'bg-transparent text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-900'
            }
            ${index === 0 ? 'border-b sm:border-b-0 sm:border-r border-gray-200 dark:border-gray-800' : ''}
          `}
        >
          {model === AiModel.MIDJOURNEY ? 'Midjourney V7' : 'Nano Banana'}
        </button>
      ))}
    </div>
  );
}