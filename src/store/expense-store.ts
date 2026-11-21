import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaction } from '@/types/budget';
import { SAMPLE_TRANSACTIONS } from '@/data/transactions';

export interface NewExpensePayload {
  title: string;
  amount: number;
  categoryId: string;
  date?: string;
  note?: string;
  paymentMethod?: Transaction['paymentMethod'];
  tags?: string[];
}

export interface ExpenseState {
  expenses: Transaction[];

  // Actions
  addExpense: (payload: NewExpensePayload) => Transaction;
  updateExpense: (id: string, updates: Partial<Omit<Transaction, 'id' | 'type' | 'createdAt'>>) => void;
  deleteExpense: (id: string) => void;
  getExpenseById: (id: string) => Transaction | undefined;
  getExpensesByCategory: (categoryId: string) => Transaction[];
  getRecentExpenses: (limit?: number) => Transaction[];
  getTotalExpenses: () => number;
  resetExpensesToDefault: () => void;
}

const initialExpenses: Transaction[] = SAMPLE_TRANSACTIONS.filter(
  (tx) => tx.type === 'expense'
);

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: initialExpenses,

      addExpense: (payload) => {
        const newExpense: Transaction = {
          id: `exp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: payload.title.trim() || 'Untitled Expense',
          amount: Math.max(0, Number(payload.amount) || 0),
          type: 'expense',
          categoryId: payload.categoryId || 'other',
          date: payload.date || new Date().toISOString(),
          note: payload.note?.trim(),
          paymentMethod: payload.paymentMethod || 'Cash',
          tags: payload.tags || [],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));

        return newExpense;
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((exp) => {
            if (exp.id !== id) return exp;
            return {
              ...exp,
              ...updates,
              title: updates.title !== undefined ? updates.title.trim() : exp.title,
              amount:
                updates.amount !== undefined
                  ? Math.max(0, Number(updates.amount) || 0)
                  : exp.amount,
            };
          }),
        }));
      },

      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((exp) => exp.id !== id),
        }));
      },

      getExpenseById: (id) => {
        return get().expenses.find((exp) => exp.id === id);
      },

      getExpensesByCategory: (categoryId) => {
        return get().expenses.filter((exp) => exp.categoryId === categoryId);
      },

      getRecentExpenses: (limit = 10) => {
        return [...get().expenses]
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, limit);
      },

      getTotalExpenses: () => {
        return get().expenses.reduce((sum, exp) => sum + exp.amount, 0);
      },

      resetExpensesToDefault: () => {
        set({ expenses: initialExpenses });
      },
    }),
    {
      name: 'student-expense-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
