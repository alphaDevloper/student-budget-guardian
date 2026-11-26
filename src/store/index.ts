export * from './budget-store';
export * from './expense-store';
export * from './income-store';
export * from './onboarding-store';
export * from './settings-store';
export * from './storage';

import { useBudgetStore } from './budget-store';
import { useExpenseStore } from './expense-store';
import { useIncomeStore } from './income-store';
import {
  calculateRemainingBudget,
  calculateBudgetUtilization,
  calculateSavingsRate,
  calculateCategoryBreakdown,
  calculateDailyAverage,
  calculateWeeklySpending,
  calculateSpendingTrajectory,
  calculateSpendingTrend,
  getPeakSpendingDay,
} from '@/utils/calculations';

/**
 * Custom hook to get real-time derived financial statistics
 * Automatically re-computes whenever expenses, incomes, or budget settings change
 */
export const useFinancialMetrics = () => {
  const monthlyBudget = useBudgetStore((state) => state.monthlyBudget);
  const expenses = useExpenseStore((state) => state.expenses);
  const incomes = useIncomeStore((state) => state.incomes);

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0) || (monthlyBudget?.totalIncome || 0);
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalBudget = monthlyBudget?.totalBudget || 0;
  const remainingBudget = calculateRemainingBudget(totalBudget, totalExpenses);
  const utilization = calculateBudgetUtilization(totalBudget, totalExpenses);
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);
  const categorySpending = calculateCategoryBreakdown(expenses);
  const currentDay = new Date().getDate();
  const dailyAverage = calculateDailyAverage(totalExpenses, Math.max(1, currentDay));
  const weeklySpending = calculateWeeklySpending(expenses);
  const spendingTrajectory = calculateSpendingTrajectory(expenses);
  const spendingTrend = calculateSpendingTrend(expenses);
  const peakDay = getPeakSpendingDay(expenses);

  return {
    monthlyBudget,
    totalIncome,
    totalExpenses,
    remainingBudget,
    utilization,
    savingsRate,
    categorySpending,
    dailyAverage,
    weeklySpending,
    spendingTrajectory,
    spendingTrend,
    peakDay,
    expenseCount: expenses.length,
    incomeCount: incomes.length,
  };
};
