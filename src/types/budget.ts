/**
 * Student Budget Guardian - Financial & Budget Data Types
 * Strongly-typed definitions for categories, transactions, budgets, limits, and goals.
 */

export type TransactionType = 'expense' | 'income';

export type CategoryType = 'expense' | 'income';

export type PeriodType = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type PaymentMethod =
  | 'Cash'
  | 'Easypaisa'
  | 'JazzCash'
  | 'Nayapay'
  | 'Sadapay'
  | 'Bank Transfer'
  | 'Debit Card'
  | 'Other';

/**
 * Category definition for expense and income classification
 */
export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  icon: string; // Identifier or symbol representation
  color: string; // Hex color code
  badgeBg: string; // Transparent background tint
  description?: string;
  defaultMonthlyBudget?: number; // In minor units or whole PKR
  isCustom?: boolean;
}

/**
 * Transaction record (Expense or Income)
 * Conforms to AGENTS.md requirements
 */
export interface Transaction {
  id: string;
  title: string;
  amount: number; // Stored as positive number in PKR
  type: TransactionType;
  categoryId: string;
  date: string; // ISO 8601 string or YYYY-MM-DD
  note?: string;
  paymentMethod?: PaymentMethod;
  tags?: string[];
  createdAt: string;
}

/**
 * Category-specific budget allocation and current progress
 */
export interface CategoryBudget {
  categoryId: string;
  allocatedAmount: number; // In PKR
  spentAmount: number; // In PKR
  warningThresholdPercentage?: number; // Defaults to 80%
}

/**
 * Monthly Budget overview
 */
export interface MonthlyBudget {
  id: string;
  month: number; // 1-12
  year: number; // e.g. 2026
  currency: 'PKR';
  totalIncome: number; // Total monthly student income in PKR
  totalBudget: number; // Total planned monthly budget limit
  categoryBudgets: CategoryBudget[];
  notes?: string;
}

/**
 * Spending limit constraint (Daily, Weekly, Monthly)
 */
export interface SpendingLimit {
  id: string;
  title: string;
  period: PeriodType;
  limitAmount: number; // In PKR
  currentSpent: number; // In PKR
  alertThreshold: number; // Percentage (e.g. 80 for 80%)
  isActive: boolean;
}

/**
 * Financial Goal tracking (e.g., Semester fees, Laptop fund)
 */
export interface FinancialGoal {
  id: string;
  title: string;
  description?: string;
  targetAmount: number; // In PKR
  currentAmount: number; // In PKR
  deadline: string; // ISO Date YYYY-MM-DD
  icon: string;
  color: string;
  isCompleted: boolean;
  category?: string;
}

/**
 * Practical budgeting tips and financial guidance for students
 */
export interface FinancialTip {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: 'saving' | 'budgeting' | 'student-life' | 'smart-spending';
  readTimeMinutes: number;
  icon: string;
  actionableStep?: string;
}

/**
 * Calculated financial summary output for dashboards and analytics
 */
export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  remainingBudget: number;
  budgetUtilizationPercentage: number;
  savingsRatePercentage: number;
  dailyAverageSpending: number;
  transactionCount: number;
}
