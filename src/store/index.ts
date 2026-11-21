export * from './budget-store';
export * from './expense-store';
export * from './income-store';

import { useBudgetStore } from './budget-store';
import { useExpenseStore } from './expense-store';
import { useIncomeStore } from './income-store';
import {
  calculateRemainingBudget,
  calculateBudgetUtilization,
  calculateSavingsRate,
  calculateCategoryBreakdown,
  calculateDailyAverage,
} from '@/utils/calculations';

/**
 * Custom hook to get real-time derived financial statistics
 * Automatically re-computes whenever expenses, incomes, or budget settings change
 */
export const useFinancialMetrics = () => {
  const monthlyBudget = useBudgetStore((state) => state.monthlyBudget);
  const expenses = useExpenseStore((state) => state.expenses);
  const incomes = useIncomeStore((state) => state.incomes);

  const totalIncome = incomes.reduce((sum, inc) => sum + inc.amount, 0) || monthlyBudget.totalIncome;
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const remainingBudget = calculateRemainingBudget(monthlyBudget.totalBudget, totalExpenses);
  const utilization = calculateBudgetUtilization(monthlyBudget.totalBudget, totalExpenses);
  const savingsRate = calculateSavingsRate(totalIncome, totalExpenses);
  const categorySpending = calculateCategoryBreakdown(expenses);
  const dailyAverage = calculateDailyAverage(totalExpenses, 21); // Month to date

  return {
    monthlyBudget,
    totalIncome,
    totalExpenses,
    remainingBudget,
    utilization,
    savingsRate,
    categorySpending,
    dailyAverage,
    expenseCount: expenses.length,
    incomeCount: incomes.length,
  };
};
