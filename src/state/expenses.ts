import { create } from "zustand";
import { Expense } from "../types/index";

interface ExpensesStore {
  expenses: Expense[];
  addExpense: (expense: Expense) => void;
  removeExpense: (expenseId: string) => void;
  findExpense: (expenseId: string) => Expense | undefined;
}

const useExpensesStore = create<ExpensesStore>((set, get) => ({
  expenses: [],

  addExpense: (newExpense) =>
    set((state) => ({
      expenses: [...state.expenses, newExpense],
    })),

  removeExpense: (expenseId: string) =>
    set((state) => ({
      expenses: state.expenses.filter((expense) => expense.id !== expenseId),
    })),

  findExpense: (expenseId: string) =>
    get().expenses.find((expense) => expense.id === expenseId),
}));

export default useExpensesStore;
