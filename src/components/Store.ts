import { create } from "zustand";

export interface Expense {
    id: number;
    title: string;
    amount: number;
    date: string;
    category: string;
}

interface Store {
    expenses: Expense[];
    filterExpenses: Expense[];
    setFilterExpenses: (expenses: Expense[]) => void;
    setExpenses: (expenses: Expense[]) => void;
    addExpense: (expense: Expense) => void;
    updateExpense: (expense: Expense) => void;
    deleteExpense: (id: number) => void;
}

export const useStore = create<Store>((set) => ({
    expenses: [],
    filterExpenses: [],
    setFilterExpenses: (filterExpenses) => set({ filterExpenses }),
    setExpenses: (expenses) => set({ expenses }),
    addExpense: (expense) => set((state) => ({ expenses: [...state.expenses, expense] })),
    updateExpense: (updatedExpense) =>
        set((state) => ({
            expenses: state.expenses.map((expense) =>
                expense.id === updatedExpense.id ? updatedExpense : expense
            ),
        })),
    deleteExpense: (id) =>
        set((state) => ({
            expenses: state.expenses.filter((expense) => expense.id !== id),
        }))
}))

export default useStore;