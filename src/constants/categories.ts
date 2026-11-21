/**
 * Student Budget Guardian - Category Definitions
 * Centralized category constants per AGENTS.md
 */

import { colors } from '../theme/colors';

export interface CategoryDefinition {
  id: string;
  name: string;
  color: string;
  badgeBg: string;
  iconName: string;
}

export const CATEGORIES: Record<string, CategoryDefinition> = {
  food: {
    id: 'food',
    name: 'Food & Dining',
    color: colors.category.food,
    badgeBg: colors.badge.warningBg,
    iconName: 'utensils',
  },
  study: {
    id: 'study',
    name: 'Books & Study',
    color: colors.category.study,
    badgeBg: colors.badge.infoBg,
    iconName: 'book-open',
  },
  transport: {
    id: 'transport',
    name: 'Transport',
    color: colors.category.transport,
    badgeBg: colors.badge.successBg,
    iconName: 'bus',
  },
  other: {
    id: 'other',
    name: 'Other Expenses',
    color: colors.category.other,
    badgeBg: colors.badge.purpleBg,
    iconName: 'more-horizontal',
  },
  bills: {
    id: 'bills',
    name: 'Bills & Utilities',
    color: colors.category.bills,
    badgeBg: colors.badge.infoBg,
    iconName: 'zap',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);
