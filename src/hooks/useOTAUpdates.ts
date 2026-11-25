import * as Updates from "expo-updates";
import { useEffect } from "react";

export function useOTAUpdates() {
  useEffect(() => {
    async function checkUpdate() {
      // Do not run OTA update checks in development or inside Expo Go
      if (__DEV__ || !Updates.isEnabled) {
        return;
      }

      try {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync();
          await Updates.reloadAsync();
        }
      } catch (error) {
        // Silently catch or handle update checking errors in production
        if (__DEV__) {
          console.warn("OTA update check failed:", error);
        }
      }
    }

    checkUpdate();
  }, []);
}
