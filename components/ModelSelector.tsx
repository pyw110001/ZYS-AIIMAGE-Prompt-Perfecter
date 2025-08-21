
import React from 'react';
import { AiModel } from '../types';

interface ModelSelectorProps {
  selectedModel: AiModel;
  onSelectModel: (model: AiModel) => void;
}

export default function ModelSelector({ selectedModel, onSelectModel }: ModelSelectorProps): React.ReactNode {
  const models = [AiModel.MIDJOURNEY, AiModel.FLUX];

  return (
    <div className="flex flex-col sm:flex-row gap-4 bg-gray-900/50 p-2 rounded-xl border border-gray-700">
      {models.map((model) => (
        <button
          key={model}
          onClick={() => onSelectModel(model)}
          className={`w-full text-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500/80 ${
            selectedModel === model
              ? 'bg-cyan-500 text-gray-900 shadow-lg'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {model}
        </button>
      ))}
    </div>
  );
}
