import { create } from 'zustand';

export const useFormStore = create((set) => ({
  schema: null,
  aiStatus: 'idle', // idle | loading | success | error
  aiMessage: '',

  setSchema: (schema) => set({ schema }),
  setAiStatus: (aiStatus, aiMessage = '') => set({ aiStatus, aiMessage })
}));
