
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const DAILY_PROMPT_LIMIT = 2;
const STORAGE_KEY = 'chat_prompts_';

interface ChatLimits {
  promptsUsed: number;
  canSendMessage: boolean;
  resetLimits: () => void;
  incrementPrompts: () => void;
}

export const useChatLimits = (): ChatLimits => {
  const { user } = useAuth();
  const [promptsUsed, setPromptsUsed] = useState(0);

  const getStorageKey = () => {
    const today = new Date().toDateString();
    return `${STORAGE_KEY}${user?.id || 'guest'}_${today}`;
  };

  const loadPromptsFromStorage = () => {
    if (typeof window === 'undefined') return 0;
    
    const stored = localStorage.getItem(getStorageKey());
    return stored ? parseInt(stored, 10) : 0;
  };

  const savePromptsToStorage = (count: number) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(getStorageKey(), count.toString());
  };

  useEffect(() => {
    const stored = loadPromptsFromStorage();
    setPromptsUsed(stored);
  }, [user]);

  const incrementPrompts = () => {
    const newCount = promptsUsed + 1;
    setPromptsUsed(newCount);
    savePromptsToStorage(newCount);
  };

  const resetLimits = () => {
    setPromptsUsed(0);
    savePromptsToStorage(0);
  };

  const canSendMessage = promptsUsed < DAILY_PROMPT_LIMIT;

  return {
    promptsUsed,
    canSendMessage,
    resetLimits,
    incrementPrompts
  };
};
