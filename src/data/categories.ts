import { Category } from '@/types/budget';
import { colors } from '@/theme/colors';

/**
 * Centralized Category Definitions
 * Realistic expense & income categories tailored for students in Pakistan (PKR)
 */

export const EXPENSE_CATEGORIES: Category[] = [
  {
    id: 'food',
    name: 'Food & Dining',
    type: 'expense',
    icon: 'utensils',
    color: colors.category.food, // #FF9F43
    badgeBg: colors.badge.warningBg,
    description: 'Campus cafeteria, hostel mess, snacks, chai, and fast food',
    defaultMonthlyBudget: 10000,
  },
  {
    id: 'study',
    name: 'Books & Study',
    type: 'expense',
    icon: 'book-open',
    color: colors.category.study, // #168CFF
    badgeBg: colors.badge.infoBg,
    description: 'Course textbooks, stationary, photocopies, and online learning',
    defaultMonthlyBudget: 4000,
  },
  {
    id: 'transport',
    name: 'Transport',
    type: 'expense',
    icon: 'bus',
    color: colors.category.transport, // #20D997
    badgeBg: colors.badge.successBg,
    description: 'Metro bus, Speedo card, rickshaw, Careem, and bike petrol',
    defaultMonthlyBudget: 6000,
  },
  {
    id: 'bills',
    name: 'Internet & Bills',
    type: 'expense',
    icon: 'wifi',
    color: colors.primary, // #087BFF
    badgeBg: colors.badge.infoBg,
    description: 'Mobile data packages, WiFi share, and utility contributions',
    defaultMonthlyBudget: 3000,
  },
  {
    id: 'entertainment',
    name: 'Entertainment & Outings',
    type: 'expense',
    icon: 'film',
    color: colors.purple, // #965BFF
    badgeBg: colors.badge.purpleBg,
    description: 'Weekend outings, movies, games, and social hangouts',
    defaultMonthlyBudget: 4000,
  },
  {
    id: 'health',
    name: 'Healthcare & Personal',
    type: 'expense',
    icon: 'heart-pulse',
    color: colors.danger, // #FF5B65
    badgeBg: colors.badge.dangerBg,
    description: 'Medicines, hygiene supplies, haircuts, and clinic visits',
    defaultMonthlyBudget: 2000,
  },
  {
    id: 'other',
    name: 'Other Expenses',
    type: 'expense',
    icon: 'more-horizontal',
    color: colors.text.secondary, // #8FA0C0
    badgeBg: 'rgba(143, 160, 192, 0.15)',
    description: 'Miscellaneous student emergency items and repairs',
    defaultMonthlyBudget: 1000,
  },
];

export const INCOME_CATEGORIES: Category[] = [
  {
    id: 'allowance',
    name: 'Monthly Allowance',
    type: 'income',
    icon: 'wallet',
    color: colors.success, // #20D997
    badgeBg: colors.badge.successBg,
    description: 'Monthly pocket money or living stipend from parents/family',
    defaultMonthlyBudget: 25000,
  },
  {
    id: 'tutoring',
    name: 'Home Tuition / Academies',
    type: 'income',
    icon: 'graduation-cap',
    color: colors.brightBlue, // #168CFF
    badgeBg: colors.badge.infoBg,
    description: 'Income from tutoring school students or teaching academies',
    defaultMonthlyBudget: 10000,
  },
  {
    id: 'freelance',
    name: 'Freelancing & Tech Work',
    type: 'income',
    icon: 'laptop',
    color: colors.purple, // #965BFF
    badgeBg: colors.badge.purpleBg,
    description: 'Web development, graphic design, content writing gigs',
    defaultMonthlyBudget: 8000,
  },
  {
    id: 'scholarship',
    name: 'Scholarship & Stipend',
    type: 'income',
    icon: 'award',
    color: colors.primary, // #087BFF
    badgeBg: colors.badge.infoBg,
    description: 'HEC, university merit stipend, or educational financial aid',
    defaultMonthlyBudget: 5000,
  },
  {
    id: 'gifts',
    name: 'Gifts & Eidi',
    type: 'income',
    icon: 'gift',
    color: colors.warning, // #FF9F43
    badgeBg: colors.badge.warningBg,
    description: 'Festival Eidi, celebratory rewards, and birthday gifts',
    defaultMonthlyBudget: 2000,
  },
];

export const ALL_CATEGORIES: Category[] = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
];

export const CATEGORIES_BY_ID: Record<string, Category> = ALL_CATEGORIES.reduce(
  (acc, category) => {
    acc[category.id] = category;
    return acc;
  },
  {} as Record<string, Category>
);

export const getCategoryById = (id: string): Category => {
  return (
    CATEGORIES_BY_ID[id] || {
      id,
      name: 'General Expense',
      type: 'expense',
      icon: 'tag',
      color: colors.text.secondary,
      badgeBg: 'rgba(143, 160, 192, 0.15)',
    }
  );
};
