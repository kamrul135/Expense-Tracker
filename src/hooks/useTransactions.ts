import { useState, useEffect, useCallback } from 'react';
import type { Transaction, TransactionType } from '@/types/transaction';

const STORAGE_KEY = 'expense-tracker-data';

const defaultCategories = {
  income: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other Income'],
  expense: ['Food', 'Transport', 'Shopping', 'Entertainment', 'Bills', 'Health', 'Education', 'Other']
};

const categoryColors: Record<string, string> = {
  'Salary': '#22c55e',
  'Freelance': '#16a34a',
  'Investment': '#15803d',
  'Gift': '#86efac',
  'Other Income': '#4ade80',
  'Food': '#ef4444',
  'Transport': '#f97316',
  'Shopping': '#eab308',
  'Entertainment': '#8b5cf6',
  'Bills': '#06b6d4',
  'Health': '#ec4899',
  'Education': '#3b82f6',
  'Other': '#6b7280'
};

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setTransactions(parsed);
      } catch (e) {
        console.error('Failed to parse stored transactions:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever transactions change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
    }
  }, [transactions, isLoaded]);

  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    if (confirm('Are you sure you want to clear all transactions?')) {
      setTransactions([]);
    }
  }, []);

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const getCategoryData = useCallback((type: TransactionType) => {
    const categoryMap = new Map<string, number>();
    
    transactions
      .filter(t => t.type === type)
      .forEach(t => {
        const current = categoryMap.get(t.category) || 0;
        categoryMap.set(t.category, current + t.amount);
      });

    return Array.from(categoryMap.entries())
      .map(([name, value]) => ({
        name,
        value,
        color: categoryColors[name] || '#6b7280'
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  const getMonthlyData = useCallback(() => {
    const monthlyMap = new Map<string, { income: number; expense: number }>();
    
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const current = monthlyMap.get(monthKey) || { income: 0, expense: 0, label: monthLabel };
      if (t.type === 'income') {
        current.income += t.amount;
      } else {
        current.expense += t.amount;
      }
      monthlyMap.set(monthKey, current);
    });

    return Array.from(monthlyMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .slice(-6) // Last 6 months
      .map(([_, data]) => ({
        name: (data as any).label,
        income: (data as any).income,
        expense: (data as any).expense
      }));
  }, [transactions]);

  return {
    transactions,
    isLoaded,
    addTransaction,
    deleteTransaction,
    clearAll,
    totalIncome,
    totalExpense,
    balance,
    getCategoryData,
    getMonthlyData,
    categories: defaultCategories
  };
}
