import { MonthlyBudget, SpendingLimit, FinancialGoal } from '@/types/budget';
import { colors } from '@/theme/colors';

/**
 * Default Student Monthly Budget in PKR
 * Total income: PKR 35,000 (PKR 25,000 parent allowance + PKR 10,000 tutoring)
 * Total budget allocated: PKR 30,000
 * Planned savings: PKR 5,000 (14.3%)
 */
export const SAMPLE_MONTHLY_BUDGET: MonthlyBudget = {
  id: 'budget-2026-11',
  month: 11,
  year: 2026,
  currency: 'PKR',
  totalIncome: 35000,
  totalBudget: 30000,
  categoryBudgets: [
    {
      categoryId: 'food',
      allocatedAmount: 10000,
      spentAmount: 6480, // 64.8% used
      warningThresholdPercentage: 80,
    },
    {
      categoryId: 'transport',
      allocatedAmount: 6000,
      spentAmount: 3950, // 65.8% used
      warningThresholdPercentage: 80,
    },
    {
      categoryId: 'study',
      allocatedAmount: 4000,
      spentAmount: 2650, // 66.3% used
      warningThresholdPercentage: 85,
    },
    {
      categoryId: 'bills',
      allocatedAmount: 3000,
      spentAmount: 2450, // 81.7% used (warning trigger)
      warningThresholdPercentage: 80,
    },
    {
      categoryId: 'entertainment',
      allocatedAmount: 4000,
      spentAmount: 2900, // 72.5% used
      warningThresholdPercentage: 75,
    },
    {
      categoryId: 'health',
      allocatedAmount: 2000,
      spentAmount: 820, // 41.0% used
      warningThresholdPercentage: 90,
    },
    {
      categoryId: 'other',
      allocatedAmount: 1000,
      spentAmount: 450, // 45.0% used
      warningThresholdPercentage: 90,
    },
  ],
  notes: 'Fall Semester midterm month. Need to maintain 15% savings buffer for final term book projects.',
};

/**
 * Realistic Student Spending Limits
 */
export const SAMPLE_SPENDING_LIMITS: SpendingLimit[] = [
  {
    id: 'limit-daily',
    title: 'Daily Out-of-Pocket Cap',
    period: 'daily',
    limitAmount: 1200,
    currentSpent: 630, // Today's spending
    alertThreshold: 80,
    isActive: true,
  },
  {
    id: 'limit-weekly',
    title: 'Weekly Allowance Pacing',
    period: 'weekly',
    limitAmount: 7500,
    currentSpent: 4850,
    alertThreshold: 80,
    isActive: true,
  },
  {
    id: 'limit-weekend',
    title: 'Weekend Social Cap',
    period: 'weekly',
    limitAmount: 2500,
    currentSpent: 1500,
    alertThreshold: 75,
    isActive: true,
  },
];

/**
 * Student Financial Goals
 * Concrete targets that encourage long-term financial discipline
 */
export const SAMPLE_FINANCIAL_GOALS: FinancialGoal[] = [
  {
    id: 'goal-semester-fee',
    title: 'Final Term Exam & Lab Fees',
    description: 'Upcoming semester examination registration and lab supply charges',
    targetAmount: 15000,
    currentAmount: 11000,
    deadline: '2026-12-20',
    icon: 'graduation-cap',
    color: colors.brightBlue, // #168CFF
    isCompleted: false,
    category: 'study',
  },
  {
    id: 'goal-laptop-upgrade',
    title: 'Coding Laptop Upgrade Fund',
    description: 'Upgrading RAM & SSD for programming projects and final year design project',
    targetAmount: 45000,
    currentAmount: 28500,
    deadline: '2027-02-15',
    icon: 'laptop',
    color: colors.purple, // #965BFF
    isCompleted: false,
    category: 'study',
  },
  {
    id: 'goal-emergency-cushion',
    title: 'Medical & Hostel Emergency Cushion',
    description: '1-month emergency living buffer in Nayapay/Sadapay digital wallet',
    targetAmount: 15000,
    currentAmount: 15000,
    deadline: '2026-10-31',
    icon: 'shield-check',
    color: colors.success, // #20D997
    isCompleted: true,
    category: 'other',
  },
];
