import React from 'react';
import { HistoryItem } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export default function HistoryList({ history, onSelect }: HistoryListProps): React.ReactNode {
  return (
    <div className="flex flex-col h-full bg-white dark:bg-black border border-gray-200 dark:border-gray-800 overflow-hidden">
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <h2 className="text-sm font-black text-black dark:text-white uppercase tracking-widest flex items-center gap-2">
            Archive
        </h2>
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-gray-400 dark:text-gray-600">
                <span className="text-xs font-mono uppercase">No Archives</span>
            </div>
        ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
            {history.map((item) => (
            <div 
                key={item.id} 
                onClick={() => onSelect(item)}
                className="p-4 hover:bg-brand-red hover:text-white group cursor-pointer transition-colors duration-200"
            >
                <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest group-hover:text-white text-gray-400">
                        {item.model === 'Midjourney V7' ? 'MJ-V7' : 'NANO'}
                    </span>
                    <span className="text-[10px] font-mono group-hover:text-white text-gray-400">
                        {new Date(item.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                </div>
                <p className="text-xs font-mono line-clamp-2 opacity-80 group-hover:opacity-100 group-hover:text-white text-black dark:text-gray-300 leading-relaxed">
                    {item.prompt}
                </p>
            </div>
            ))}
            </div>
        )}
      </div>
    </div>
  );
}