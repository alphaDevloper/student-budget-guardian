import { DEFAULT_CURRENCY_PREFIX } from "@/constants/user";
import { AppearanceMode, UserSettingsProfile } from "@/types/settings";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { safeAsyncStorage } from "./storage";

export interface SettingsState {
  notificationsEnabled: boolean;
  appearanceMode: AppearanceMode;
  profile: UserSettingsProfile;
  _hasHydrated: boolean;

  setHasHydrated: (hydrated: boolean) => void;
  setNotificationsEnabled: (enabled: boolean) => void;
  toggleNotifications: () => void;
  setAppearanceMode: (mode: AppearanceMode) => void;
  toggleAppearanceMode: () => void;
  updateProfile: (updates: Partial<UserSettingsProfile>) => void;
  resetSettingsToDefault: () => void;
}

const DEFAULT_PROFILE: UserSettingsProfile = {
  name: "",
  role: "Student",
  currencyPrefix: DEFAULT_CURRENCY_PREFIX,
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      notificationsEnabled: true,
      appearanceMode: "dark",
      profile: DEFAULT_PROFILE,
      _hasHydrated: false,

      setHasHydrated: (hydrated) => set({ _hasHydrated: hydrated }),

      setNotificationsEnabled: (enabled) =>
        set({ notificationsEnabled: enabled }),

      toggleNotifications: () =>
        set((state) => ({
          notificationsEnabled: !state.notificationsEnabled,
        })),

      setAppearanceMode: (mode) => set({ appearanceMode: mode }),

      toggleAppearanceMode: () =>
        set((state) => ({
          appearanceMode: state.appearanceMode === "dark" ? "light" : "dark",
        })),

      updateProfile: (updates) =>
        set((state) => ({
          profile: {
            ...state.profile,
            ...updates,
          },
        })),

      resetSettingsToDefault: () =>
        set({
          notificationsEnabled: true,
          appearanceMode: "dark",
          profile: DEFAULT_PROFILE,
        }),
    }),
    {
      name: "student-settings-v2",
      storage: createJSONStorage(() => safeAsyncStorage),
      partialize: (state) => ({
        notificationsEnabled: state.notificationsEnabled,
        appearanceMode: state.appearanceMode,
        profile: state.profile,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
