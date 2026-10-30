import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Expense, Item } from "../types/models";
import { reportHydrationError } from "./persistence";

interface ExpensesStore {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  clearExpenses: () => void;
  updateExpense: (expenseId: string, updates: Partial<Expense>) => void;
  addItemToExpense: (expenseId: string, item: Item) => void;
  updateItemInExpense: (expenseId: string, item: Item) => void;
  removeItemFromExpense: (expenseId: string, itemId: string) => void;
  removeExpense: (expenseId: string) => void;
  findExpense: (expenseId: string) => Expense | undefined;
}

const getExpenseTotal = (items: Item[]) =>
  items.reduce((total, item) => total + item.amount * item.quantity, 0);

const useExpensesStore = create<ExpensesStore>()(
  persist(
    (set, get) => ({
      expenses: [],

      addExpense: (newExpense) =>
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        })),

      clearExpenses: () => set({ expenses: [] }),

      updateExpense: (expenseId, updates) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === expenseId ? { ...expense, ...updates } : expense,
          ),
        })),

      addItemToExpense: (expenseId, item) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === expenseId
              ? {
                  ...expense,
                  items: [...expense.items, item],
                  total: getExpenseTotal([...expense.items, item]),
                }
              : expense,
          ),
        })),

      updateItemInExpense: (expenseId, item) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === expenseId
              ? {
                  ...expense,
                  items: expense.items.map((currentItem) =>
                    currentItem.id === item.id ? item : currentItem,
                  ),
                  total: getExpenseTotal(
                    expense.items.map((currentItem) =>
                      currentItem.id === item.id ? item : currentItem,
                    ),
                  ),
                }
              : expense,
          ),
        })),

      removeItemFromExpense: (expenseId, itemId) =>
        set((state) => ({
          expenses: state.expenses.map((expense) =>
            expense.id === expenseId
              ? {
                  ...expense,
                  items: expense.items.filter((item) => item.id !== itemId),
                  total: getExpenseTotal(
                    expense.items.filter((item) => item.id !== itemId),
                  ),
                }
              : expense,
          ),
        })),

      removeExpense: (expenseId: string) =>
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== expenseId),
        })),

      findExpense: (expenseId: string) =>
        get().expenses.find((expense) => expense.id === expenseId),
    }),
    {
      name: "chippa-expenses",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ expenses: state.expenses }),
      skipHydration: true,
      onRehydrateStorage: () => (_state, error) => {
        if (error) {
          reportHydrationError(error);
        }
      },
    },
  ),
);

export default useExpensesStore;
