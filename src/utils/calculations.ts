import { Transaction, MonthlyBudget, FinancialSummary } from '@/types/budget';

/**
 * Student Budget Guardian - Financial Calculation Engine
 * Pure, reusable calculations per AGENTS.md rules:
 * - Numbers only, no string math
 * - Zero-safe and empty-list safe
 * - Shared across all dashboard, analytics, and overview components
 */

/**
 * Calculate total income from a list of transactions
 */
export const calculateTotalIncome = (transactions: Transaction[]): number => {
  if (!Array.isArray(transactions) || transactions.length === 0) return 0;
  return transactions
    .filter((tx) => tx.type === 'income')
    .reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0);
};

/**
 * Calculate total expenses from a list of transactions
 */
export const calculateTotalExpenses = (transactions: Transaction[]): number => {
  if (!Array.isArray(transactions) || transactions.length === 0) return 0;
  return transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((sum, tx) => sum + (tx.amount > 0 ? tx.amount : 0), 0);
};

/**
 * Calculate remaining budget given total budget and total expenses
 */
export const calculateRemainingBudget = (
  budget: number,
  expenses: number
): number => {
  const safeBudget = Math.max(0, budget || 0);
  const safeExpenses = Math.max(0, expenses || 0);
  return safeBudget - safeExpenses;
};

/**
 * Calculate budget utilization percentage (0 - 100+%)
 */
export const calculateBudgetUtilization = (
  budget: number,
  expenses: number
): number => {
  if (!budget || budget <= 0) return 0;
  const safeExpenses = Math.max(0, expenses || 0);
  const percentage = (safeExpenses / budget) * 100;
  return Math.round(percentage * 10) / 10; // Round to 1 decimal place
};

/**
 * Calculate savings rate percentage
 */
export const calculateSavingsRate = (
  income: number,
  expenses: number
): number => {
  if (!income || income <= 0) return 0;
  const safeExpenses = Math.max(0, expenses || 0);
  const savings = income - safeExpenses;
  if (savings <= 0) return 0;
  const rate = (savings / income) * 100;
  return Math.round(rate * 10) / 10;
};

/**
 * Calculate daily average spending over a given number of days
 */
export const calculateDailyAverage = (
  expenses: number,
  daysCount: number
): number => {
  if (!daysCount || daysCount <= 0) return 0;
  const safeExpenses = Math.max(0, expenses || 0);
  return Math.round(safeExpenses / daysCount);
};

/**
 * Calculate category-wise breakdown of expenses
 */
export const calculateCategoryBreakdown = (
  transactions: Transaction[]
): Record<string, number> => {
  if (!Array.isArray(transactions)) return {};
  return transactions
    .filter((tx) => tx.type === 'expense')
    .reduce((acc, tx) => {
      const catId = tx.categoryId || 'other';
      acc[catId] = (acc[catId] || 0) + (tx.amount > 0 ? tx.amount : 0);
      return acc;
    }, {} as Record<string, number>);
};

/**
 * Calculate comprehensive financial summary for a month
 */
export const calculateFinancialSummary = (
  budget: MonthlyBudget,
  transactions: Transaction[],
  daysInMonthPassed: number = 21
): FinancialSummary => {
  const totalIncome = calculateTotalIncome(transactions) || budget.totalIncome;
  const totalExpenses = calculateTotalExpenses(transactions);
  const remainingBudget = calculateRemainingBudget(budget.totalBudget, totalExpenses);
  const budgetUtilizationPercentage = calculateBudgetUtilization(budget.totalBudget, totalExpenses);
  const savingsRatePercentage = calculateSavingsRate(totalIncome, totalExpenses);
  const dailyAverageSpending = calculateDailyAverage(totalExpenses, daysInMonthPassed);

  return {
    totalIncome,
    totalExpenses,
    remainingBudget,
    budgetUtilizationPercentage,
    savingsRatePercentage,
    dailyAverageSpending,
    transactionCount: transactions.length,
  };
};
