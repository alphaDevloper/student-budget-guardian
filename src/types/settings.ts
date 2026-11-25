export type AppearanceMode = 'dark' | 'light';

export interface UserSettingsProfile {
  name: string;
  role: string;
  currencyPrefix: string;
}

export interface SettingsPreferences {
  notificationsEnabled: boolean;
  appearanceMode: AppearanceMode;
  profile: UserSettingsProfile;
}