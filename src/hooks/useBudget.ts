import { useState, useEffect, useCallback, useMemo } from 'react';

export interface BudgetGoal {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
}

const STORAGE_KEY = 'expense-tracker-budgets';

export function useBudget() {
  const [budgets, setBudgets] = useState<BudgetGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setBudgets(parsed);
      } catch (e) {
        console.error('Failed to parse stored budgets:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(budgets));
    }
  }, [budgets, isLoaded]);

  const addBudget = useCallback((budget: Omit<BudgetGoal, 'id'>) => {
    const newBudget: BudgetGoal = {
      ...budget,
      id: crypto.randomUUID()
    };
    setBudgets(prev => [...prev, newBudget]);
  }, []);

  const deleteBudget = useCallback((id: string) => {
    setBudgets(prev => prev.filter(b => b.id !== id));
  }, []);

  const updateBudget = useCallback((id: string, updates: Partial<BudgetGoal>) => {
    setBudgets(prev => prev.map(b => 
      b.id === id ? { ...b, ...updates } : b
    ));
  }, []);

  const getBudgetProgress = useCallback((category: string, currentSpent: number) => {
    const budget = budgets.find(b => b.category === category);
    if (!budget) return null;
    
    const percentage = Math.min((currentSpent / budget.amount) * 100, 100);
    const remaining = Math.max(budget.amount - currentSpent, 0);
    const isOverBudget = currentSpent > budget.amount;
    
    return {
      budget,
      percentage,
      remaining,
      isOverBudget,
      spent: currentSpent
    };
  }, [budgets]);

  const totalBudget = useMemo(() => 
    budgets.reduce((sum, b) => sum + b.amount, 0),
  [budgets]);

  return {
    budgets,
    isLoaded,
    addBudget,
    deleteBudget,
    updateBudget,
    getBudgetProgress,
    totalBudget
  };
}
