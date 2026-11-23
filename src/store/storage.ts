import AsyncStorage from '@react-native-async-storage/async-storage';
import { StateStorage } from 'zustand/middleware';

/**
 * In-memory fallback map to guarantee that the application never crashes
 * even if native storage is unavailable (e.g., in certain Expo Go builds or test environments).
 */
const memoryStore = new Map<string, string>();

/**
 * Safe AsyncStorage wrapper for Zustand stores.
 * Catches any native storage error gracefully and falls back to in-memory caching.
 */
export const safeAsyncStorage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      const value = await AsyncStorage.getItem(name);
      if (value !== null) {
        memoryStore.set(name, value);
        return value;
      }
      return memoryStore.get(name) ?? null;
    } catch (error) {
      // Return cached memory value if native module fails
      return memoryStore.get(name) ?? null;
    }
  },

  setItem: async (name: string, value: string): Promise<void> => {
    try {
      memoryStore.set(name, value);
      await AsyncStorage.setItem(name, value);
    } catch (error) {
      // Memory store is already updated, app continues smoothly
    }
  },

  removeItem: async (name: string): Promise<void> => {
    try {
      memoryStore.delete(name);
      await AsyncStorage.removeItem(name);
    } catch (error) {
      // Memory store is already deleted
    }
  },
};
