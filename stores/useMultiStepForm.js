// stores/useMultiStepForm.js
import { create } from "zustand";

export const useMultiStepForm = create((set) => ({
  step: 1,
  data: {},
  setStep: (step) => set({ step }),
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
  setFormData: (newData) =>
    set((state) => ({ data: { ...state.data, ...newData } })),
}));
