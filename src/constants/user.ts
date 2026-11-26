/**
 * Student Budget Guardian - User & Greeting Defaults
 * No hardcoded personal names or user IDs.
 */

export const DEFAULT_CURRENCY_PREFIX = '$';
export const DEFAULT_GREETING_SUBTITLE =
  "Keep going! You're managing your budget well.";

export const formatGreetingTitle = (name?: string | null): string => {
  const trimmed = name?.trim();
  return trimmed ? `Hello ${trimmed} 👋` : 'Welcome 👋';
};
