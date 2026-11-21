/**
 * Student Budget Guardian - User Profile Constant
 */

export interface UserProfile {
  id: string;
  name: string;
  greetingTitle: string;
  greetingSubtitle: string;
  currencyPrefix: string;
}

export const CURRENT_USER: UserProfile = {
  id: 'user-001',
  name: 'Abdullah',
  greetingTitle: 'Hello Abdullah 👋',
  greetingSubtitle: "Keep going! You're managing your budget well.",
  currencyPrefix: '$',
};
