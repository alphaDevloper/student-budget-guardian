import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { safeAsyncStorage } from './storage';
import { Transaction } from '@/types/budget';
import { SAMPLE_TRANSACTIONS } from '@/data/transactions';

export interface NewIncomePayload {
  title: string;
  amount: number;
  categoryId: string;
  date?: string;
  note?: string;
  paymentMethod?: Transaction['paymentMethod'];
  tags?: string[];
}

export interface IncomeState {
  incomes: Transaction[];

  // Actions
  addIncome: (payload: NewIncomePayload) => Transaction;
  updateIncome: (id: string, updates: Partial<Omit<Transaction, 'id' | 'type' | 'createdAt'>>) => void;
  deleteIncome: (id: string) => void;
  getTotalIncome: () => number;
  resetIncomesToDefault: () => void;
}

const initialIncomes: Transaction[] = SAMPLE_TRANSACTIONS.filter(
  (tx) => tx.type === 'income'
);

export const useIncomeStore = create<IncomeState>()(
  persist(
    (set, get) => ({
      incomes: initialIncomes,

      addIncome: (payload) => {
        const newIncome: Transaction = {
          id: `inc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          title: payload.title.trim() || 'Untitled Income',
          amount: Math.max(0, Number(payload.amount) || 0),
          type: 'income',
          categoryId: payload.categoryId || 'allowance',
          date: payload.date || new Date().toISOString(),
          note: payload.note?.trim(),
          paymentMethod: payload.paymentMethod || 'Bank Transfer',
          tags: payload.tags || [],
          createdAt: new Date().toISOString(),
        };

        set((state) => ({
          incomes: [newIncome, ...state.incomes],
        }));

        return newIncome;
      },

      updateIncome: (id, updates) => {
        set((state) => ({
          incomes: state.incomes.map((inc) => {
            if (inc.id !== id) return inc;
            return {
              ...inc,
              ...updates,
              title: updates.title !== undefined ? updates.title.trim() : inc.title,
              amount:
                updates.amount !== undefined
                  ? Math.max(0, Number(updates.amount) || 0)
                  : inc.amount,
            };
          }),
        }));
      },

      deleteIncome: (id) => {
        set((state) => ({
          incomes: state.incomes.filter((inc) => inc.id !== id),
        }));
      },

      getTotalIncome: () => {
        return get().incomes.reduce((sum, inc) => sum + inc.amount, 0);
      },

      resetIncomesToDefault: () => {
        set({ incomes: initialIncomes });
      },
    }),
    {
      name: 'student-income-storage',
      storage: createJSONStorage(() => safeAsyncStorage),
    }
  )
);
