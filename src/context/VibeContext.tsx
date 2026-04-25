import React, { createContext, useContext, useState, type ReactNode } from 'react';

type Emotion = 'energetic' | 'neutral' | 'tired' | 'frustrated';

interface VibeState {
  emotion: Emotion;
  targetSeconds: number;
  themeClass: string;
  assistantMessageTone: 'encouraging' | 'direct' | 'compassionate' | 'neutral';
}

interface VibeContextType {
  vibe: VibeState;
  setEmotion: (emotion: Emotion, suggestedTargetSeconds?: number) => void;
}

const defaultVibe: VibeState = {
  emotion: 'neutral',
  targetSeconds: 30,
  themeClass: 'theme-neutral',
  assistantMessageTone: 'neutral',
};

const VibeContext = createContext<VibeContextType | undefined>(undefined);

export const VibeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [vibe, setVibe] = useState<VibeState>(defaultVibe);

  const setEmotion = (newEmotion: Emotion, suggestedTargetSeconds?: number) => {
    setVibe((prev) => {
      let targetSeconds = suggestedTargetSeconds || prev.targetSeconds;
      let themeClass = 'theme-neutral';
      let assistantMessageTone: VibeState['assistantMessageTone'] = 'neutral';

      switch (newEmotion) {
        case 'energetic':
          targetSeconds = suggestedTargetSeconds || 45; // Desafio maior
          themeClass = 'theme-energetic'; // Tons de laranja/roxo vibrante
          assistantMessageTone = 'direct';
          break;
        case 'tired':
          targetSeconds = suggestedTargetSeconds || 20; // Mais curto e fácil
          themeClass = 'theme-tired'; // Tons azuis/relaxantes
          assistantMessageTone = 'compassionate';
          break;
        case 'frustrated':
          targetSeconds = suggestedTargetSeconds || 15; // Curtíssimo para dar vitória rápida
          themeClass = 'theme-frustrated'; // Tons mais neutros/acolhedores
          assistantMessageTone = 'encouraging';
          break;
        case 'neutral':
        default:
          targetSeconds = suggestedTargetSeconds || 30;
          themeClass = 'theme-neutral';
          assistantMessageTone = 'neutral';
          break;
      }

      return {
        emotion: newEmotion,
        targetSeconds,
        themeClass,
        assistantMessageTone,
      };
    });
  };

  return (
    <VibeContext.Provider value={{ vibe, setEmotion }}>
      <div className={vibe.themeClass} style={{ width: '100%', height: '100%', display: 'flex' }}>
        {children}
      </div>
    </VibeContext.Provider>
  );
};

export const useVibe = () => {
  const context = useContext(VibeContext);
  if (context === undefined) {
    throw new Error('useVibe must be used within a VibeProvider');
  }
  return context;
};
