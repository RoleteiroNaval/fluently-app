import { create } from 'zustand';

interface AliceMetrics {
  pronunciation: number;
  vocabulary: number;
  grammar: number;
  fluency: number;
  filler_words: number;
  cefr_level: string;
}

interface AliceState {
  // Onboarding
  onboardingData: {
    perceivedLevel: string;
    goals: string[];
    usage: string[];
  };
  setOnboardingData: (data: Partial<AliceState['onboardingData']>) => void;

  // Assessment (A Meta dos 30 Segundos)
  assessmentSeconds: number;
  isAssessmentComplete: boolean;
  addAssessmentSecond: () => void;
  resetAssessment: () => void;
  setAssessmentComplete: (status: boolean) => void;

  // Results
  metrics: AliceMetrics | null;
  setMetrics: (metrics: AliceMetrics) => void;

  // UI State
  currentStep: 'onboarding' | 'assessment' | 'results' | 'practice';
  setCurrentStep: (step: AliceState['currentStep']) => void;
}

export const useAliceStore = create<AliceState>((set) => ({
  onboardingData: {
    perceivedLevel: '',
    goals: [],
    usage: [],
  },
  setOnboardingData: (data) => set((state) => ({
    onboardingData: { ...state.onboardingData, ...data }
  })),

  assessmentSeconds: 0,
  isAssessmentComplete: false,
  addAssessmentSecond: () => set((state) => ({
    assessmentSeconds: Math.min(state.assessmentSeconds + 1, 30)
  })),
  resetAssessment: () => set({ assessmentSeconds: 0, isAssessmentComplete: false }),
  setAssessmentComplete: (status) => set({ isAssessmentComplete: status }),

  metrics: null,
  setMetrics: (metrics) => set({ metrics }),

  currentStep: 'assessment', // Iniciando em assessment para manter o fluxo atual, mas pode ser 'onboarding'
  setCurrentStep: (step) => set({ currentStep: step }),
}));
