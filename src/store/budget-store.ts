import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeAsyncStorage } from './storage';
import { MonthlyBudget, SpendingLimit, FinancialGoal } from '@/types/budget';

export const DEFAULT_MONTHLY_BUDGET: MonthlyBudget = {
  id: `budget-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`,
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  currency: 'USD',
  totalIncome: 0,
  totalBudget: 0,
  categoryBudgets: [
    { categoryId: 'food', allocatedAmount: 0, spentAmount: 0, warningThresholdPercentage: 80 },
    { categoryId: 'study', allocatedAmount: 0, spentAmount: 0, warningThresholdPercentage: 80 },
    { categoryId: 'transport', allocatedAmount: 0, spentAmount: 0, warningThresholdPercentage: 80 },
    { categoryId: 'other', allocatedAmount: 0, spentAmount: 0, warningThresholdPercentage: 80 },
  ],
  notes: '',
};

export interface BudgetState {
  monthlyBudget: MonthlyBudget;
  spendingLimits: SpendingLimit[];
  financialGoals: FinancialGoal[];

  // Monthly Budget Actions
  setTotalBudget: (amount: number) => void;
  setTotalIncome: (amount: number) => void;
  updateCategoryBudget: (categoryId: string, allocatedAmount: number) => void;
  resetBudgetToDefault: () => void;

  // Spending Limits Actions
  addSpendingLimit: (limit: Omit<SpendingLimit, 'id'>) => void;
  updateSpendingLimit: (id: string, updates: Partial<SpendingLimit>) => void;
  deleteSpendingLimit: (id: string) => void;
  toggleSpendingLimit: (id: string) => void;

  // Financial Goals Actions
  addFinancialGoal: (goal: Omit<FinancialGoal, 'id' | 'isCompleted'>) => void;
  contributeToGoal: (id: string, amount: number) => void;
  deleteFinancialGoal: (id: string) => void;
}

export const useBudgetStore = create<BudgetState>()(
  persist(
    (set) => ({
      monthlyBudget: DEFAULT_MONTHLY_BUDGET,
      spendingLimits: [],
      financialGoals: [],

      setTotalBudget: (amount) =>
        set((state) => ({
          monthlyBudget: {
            ...state.monthlyBudget,
            totalBudget: Math.max(0, amount),
          },
        })),

      setTotalIncome: (amount) =>
        set((state) => ({
          monthlyBudget: {
            ...state.monthlyBudget,
            totalIncome: Math.max(0, amount),
          },
        })),

      updateCategoryBudget: (categoryId, allocatedAmount) =>
        set((state) => {
          const exists = state.monthlyBudget.categoryBudgets.some(
            (cb) => cb.categoryId === categoryId
          );
          const updatedCategoryBudgets = exists
            ? state.monthlyBudget.categoryBudgets.map((cb) =>
                cb.categoryId === categoryId
                  ? { ...cb, allocatedAmount: Math.max(0, allocatedAmount) }
                  : cb
              )
            : [
                ...state.monthlyBudget.categoryBudgets,
                {
                  categoryId,
                  allocatedAmount: Math.max(0, allocatedAmount),
                  spentAmount: 0,
                  warningThresholdPercentage: 80,
                },
              ];
          return {
            monthlyBudget: {
              ...state.monthlyBudget,
              categoryBudgets: updatedCategoryBudgets,
            },
          };
        }),

      resetBudgetToDefault: () =>
        set({
          monthlyBudget: DEFAULT_MONTHLY_BUDGET,
          spendingLimits: [],
          financialGoals: [],
        }),

      addSpendingLimit: (limit) =>
        set((state) => ({
          spendingLimits: [
            ...state.spendingLimits,
            {
              ...limit,
              id: `limit-${Date.now()}`,
            },
          ],
        })),

      updateSpendingLimit: (id, updates) =>
        set((state) => ({
          spendingLimits: state.spendingLimits.map((l) =>
            l.id === id ? { ...l, ...updates } : l
          ),
        })),

      deleteSpendingLimit: (id) =>
        set((state) => ({
          spendingLimits: state.spendingLimits.filter((l) => l.id !== id),
        })),

      toggleSpendingLimit: (id) =>
        set((state) => ({
          spendingLimits: state.spendingLimits.map((l) =>
            l.id === id ? { ...l, isActive: !l.isActive } : l
          ),
        })),

      addFinancialGoal: (goal) =>
        set((state) => ({
          financialGoals: [
            ...state.financialGoals,
            {
              ...goal,
              id: `goal-${Date.now()}`,
              isCompleted: goal.currentAmount >= goal.targetAmount,
            },
          ],
        })),

      contributeToGoal: (id, amount) =>
        set((state) => ({
          financialGoals: state.financialGoals.map((g) => {
            if (g.id !== id) return g;
            const newAmount = Math.max(0, g.currentAmount + amount);
            return {
              ...g,
              currentAmount: newAmount,
              isCompleted: newAmount >= g.targetAmount,
            };
          }),
        })),

      deleteFinancialGoal: (id) =>
        set((state) => ({
          financialGoals: state.financialGoals.filter((g) => g.id !== id),
        })),
    }),
    {
      name: 'student-budget-v2',
      storage: createJSONStorage(() => safeAsyncStorage),
    }
  )
);
