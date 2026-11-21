/**
 * Student Budget Guardian - Typography Tokens
 * Inter: Modern • Clean • Readable
 */

export const fontFamilies = {
  regular: 'Inter_400Regular',
  medium: 'Inter_500Medium',
  semiBold: 'Inter_600SemiBold',
  bold: 'Inter_700Bold',
} as const;

export const typography = {
  display: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: fontFamilies.bold,
    fontWeight: '700' as const,
  },
  heading1: {
    fontSize: 26,
    lineHeight: 34,
    fontFamily: fontFamilies.bold,
    fontWeight: '700' as const,
  },
  heading2: {
    fontSize: 22,
    lineHeight: 28,
    fontFamily: fontFamilies.semiBold,
    fontWeight: '600' as const,
  },
  heading3: {
    fontSize: 18,
    lineHeight: 24,
    fontFamily: fontFamilies.semiBold,
    fontWeight: '600' as const,
  },
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: fontFamilies.regular,
    fontWeight: '400' as const,
  },
  body: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamilies.regular,
    fontWeight: '400' as const,
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamilies.regular,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fontFamilies.medium,
    fontWeight: '500' as const,
  },
  button: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: fontFamilies.semiBold,
    fontWeight: '600' as const,
  },
} as const;

export type TypographyPreset = keyof typeof typography;
