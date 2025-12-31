
export enum AiModel {
  MIDJOURNEY = 'Midjourney V7',
  NANO_BANANA = 'Nano Banana Pro',
}

export interface HistoryItem {
  id: string;
  model: AiModel;
  prompt: string;
  translation?: string;
  originalInput: string;
  timestamp: number;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }

  interface Window {
    aistudio?: AIStudio;
  }
}
