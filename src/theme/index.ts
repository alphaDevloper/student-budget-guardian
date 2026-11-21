/**
 * Student Budget Guardian - Theme Barrel Export
 */

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radius';

import { colors } from './colors';
import { typography, fontFamilies } from './typography';
import { spacing } from './spacing';
import { radius } from './radius';

export const theme = {
  colors,
  typography,
  fontFamilies,
  spacing,
  radius,
} as const;

export default theme;
