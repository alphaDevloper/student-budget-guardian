/**
 * Student Budget Guardian - Color Palette Tokens
 * Extracted directly from Design System v1.0
 */

export const colors = {
  // Brand & Core Palette
  primary: '#087BFF',
  brightBlue: '#168CFF',
  deepBlue: '#0645A8',
  navy: '#071329',
  darkNavy: '#050D1C', // Main canvas & background

  // Surfaces & Borders
  surface: '#111D35',
  surfaceElevated: '#192743',
  border: '#263754',
  borderLight: '#354B72',

  // Status & Feedback
  success: '#20D997',
  warning: '#FF9F43',
  danger: '#FF5B65',
  purple: '#965BFF',

  // Text Colors
  text: {
    primary: '#FFFFFF',
    secondary: '#8FA0C0',
    tertiary: '#5C7194',
    disabled: '#4A5D7E',
    inverse: '#050D1C',
  },

  // Category Colors
  category: {
    food: '#FF9F43', // Food & Dining (Warning / Orange)
    study: '#168CFF', // Books & Study (Bright Blue)
    transport: '#20D997', // Transport (Success / Green)
    other: '#965BFF', // Other Expenses (Purple)
    bills: '#087BFF', // Bills & Utilities (Primary Blue)
  },

  // Status Badge Background Tints
  badge: {
    successBg: 'rgba(32, 217, 151, 0.15)',
    warningBg: 'rgba(255, 159, 67, 0.15)',
    dangerBg: 'rgba(255, 91, 101, 0.15)',
    infoBg: 'rgba(8, 123, 255, 0.15)',
    purpleBg: 'rgba(150, 91, 255, 0.15)',
  },

  // Gradient definitions (start -> end)
  gradients: {
    primary: ['#087BFF', '#168CFF'] as const,
    card: ['#111D35', '#071329'] as const,
    surfaceElevated: ['#192743', '#111D35'] as const,
    budgetProgress: ['#168CFF', '#20D997'] as const,
  },
} as const;

export type ColorToken = keyof typeof colors;
