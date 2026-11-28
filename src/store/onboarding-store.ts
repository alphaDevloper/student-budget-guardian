import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeAsyncStorage } from './storage';

export interface OnboardingState {
  isOnboardingCompleted: boolean;
  hasAddedFirstExpense: boolean;
  _hasHydrated: boolean;

  // Actions
  setHasHydrated: (hydrated: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
  setHasAddedFirstExpense: (added: boolean) => void;
  completeFirstTimeFlow: () => void;
  resetOnboarding: () => void;
}

/**
 * Zustand store with AsyncStorage persistence tracking onboarding completion
 * and first expense requirement.
 */
export const useOnboardingStore = create<OnboardingState>()(
  persist(
    (set) => ({
      isOnboardingCompleted: false,
      hasAddedFirstExpense: false,
      _hasHydrated: false,

      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),

      setOnboardingCompleted: (completed) =>
        set({ isOnboardingCompleted: completed }),

      setHasAddedFirstExpense: (added) =>
        set({ hasAddedFirstExpense: added }),

      completeFirstTimeFlow: () =>
        set({ isOnboardingCompleted: true, hasAddedFirstExpense: true }),

      resetOnboarding: () =>
        set({
          isOnboardingCompleted: false,
          hasAddedFirstExpense: false,
        }),
    }),
    {
      name: 'student-onboarding-v2',
      storage: createJSONStorage(() => safeAsyncStorage),
      partialize: (state) => ({
        isOnboardingCompleted: state.isOnboardingCompleted,
        hasAddedFirstExpense: state.hasAddedFirstExpense,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
