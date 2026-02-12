import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Target, Plus, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import type { BudgetGoal } from '@/hooks/useBudget';

interface BudgetManagerProps {
  budgets: BudgetGoal[];
  categorySpending: Record<string, number>;
  categories: string[];
  onAdd: (budget: Omit<BudgetGoal, 'id'>) => void;
  onDelete: (id: string) => void;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
}

export function BudgetManager({ budgets, categorySpending, categories, onAdd, onDelete }: BudgetManagerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'monthly' | 'weekly' | 'yearly'>('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !amount) return;

    onAdd({
      category: selectedCategory,
      amount: parseFloat(amount),
      period
    });

    setSelectedCategory('');
    setAmount('');
    setIsOpen(false);
  };

  const availableCategories = categories.filter(
    cat => !budgets.some(b => b.category === cat)
  );

  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <Target className="w-4 h-4 text-primary" />
            </div>
            Budget Goals
          </CardTitle>
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="rounded-lg gap-1">
                <Plus className="w-4 h-4" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-card border-0">
              <DialogHeader>
                <DialogTitle>Set Budget Goal</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      {availableCategories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Budget Amount</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                    <Input
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="pl-7 rounded-xl"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Period</Label>
                  <Select value={period} onValueChange={(v) => setPeriod(v as any)}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl">
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="yearly">Yearly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button type="submit" className="w-full rounded-xl">
                  Set Budget
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {budgets.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No budget goals set</p>
            <p className="text-xs">Add a budget to track your spending</p>
          </div>
        ) : (
          <div className="space-y-4">
            {budgets.map((budget) => {
              const spent = categorySpending[budget.category] || 0;
              const percentage = Math.min((spent / budget.amount) * 100, 100);
              const isOverBudget = spent > budget.amount;
              const remaining = Math.max(budget.amount - spent, 0);

              return (
                <div key={budget.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{budget.category}</span>
                      <span className="text-xs text-muted-foreground capitalize">({budget.period})</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-muted-foreground hover:text-destructive"
                      onClick={() => onDelete(budget.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className={isOverBudget ? 'text-red-500' : 'text-muted-foreground'}>
                        {formatCurrency(spent)} spent
                      </span>
                      <span className="text-muted-foreground">
                        of {formatCurrency(budget.amount)}
                      </span>
                    </div>
                    <div className="relative">
                      <Progress 
                        value={percentage} 
                        className={`h-2 ${
                          isOverBudget 
                            ? '[&>div]:bg-red-500' 
                            : percentage > 80 
                              ? '[&>div]:bg-amber-500'
                              : '[&>div]:bg-emerald-500'
                        }`}
                      />
                      {isOverBudget && (
                        <AlertCircle className="absolute -right-1 -top-1 w-4 h-4 text-red-500" />
                      )}
                      {percentage >= 100 && !isOverBudget && (
                        <CheckCircle2 className="absolute -right-1 -top-1 w-4 h-4 text-emerald-500" />
                      )}
                    </div>
                    <p className={`text-xs ${isOverBudget ? 'text-red-500' : 'text-muted-foreground'}`}>
                      {isOverBudget 
                        ? `Over budget by ${formatCurrency(spent - budget.amount)}`
                        : `${formatCurrency(remaining)} remaining`
                      }
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
