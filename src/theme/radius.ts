/**
 * Student Budget Guardian - Border Radius Tokens
 * Matching exact Design System specs
 */

export const radius = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  full: 9999,
} as const;

export type RadiusToken = keyof typeof radius;
