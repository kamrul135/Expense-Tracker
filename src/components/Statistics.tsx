import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Calendar, DollarSign, PieChart, Activity } from 'lucide-react';
import type { Transaction } from '@/types/transaction';

interface StatisticsProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(amount);
}

export function Statistics({ transactions, totalIncome, totalExpense }: StatisticsProps) {
  const totalTransactions = transactions.length;
  const incomeTransactions = transactions.filter(t => t.type === 'income').length;
  const expenseTransactions = transactions.filter(t => t.type === 'expense').length;
  
  const avgTransaction = totalTransactions > 0 
    ? (totalIncome + totalExpense) / totalTransactions 
    : 0;
  
  const avgIncome = incomeTransactions > 0 
    ? totalIncome / incomeTransactions 
    : 0;
  
  const avgExpense = expenseTransactions > 0 
    ? totalExpense / expenseTransactions 
    : 0;

  // Get most used categories
  const categoryCount: Record<string, number> = {};
  transactions.forEach(t => {
    categoryCount[t.category] = (categoryCount[t.category] || 0) + 1;
  });
  
  const topCategory = Object.entries(categoryCount)
    .sort((a, b) => b[1] - a[1])[0];

  // Get today's transactions
  const today = new Date().toDateString();
  const todayTransactions = transactions.filter(t => 
    new Date(t.date).toDateString() === today
  );
  const todayIncome = todayTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const todayExpense = todayTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const stats = [
    {
      label: 'Total Transactions',
      value: totalTransactions.toString(),
      icon: Activity,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      label: 'Avg. Transaction',
      value: formatCurrency(avgTransaction),
      icon: DollarSign,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      label: 'Income Count',
      value: incomeTransactions.toString(),
      icon: TrendingUp,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      label: 'Expense Count',
      value: expenseTransactions.toString(),
      icon: TrendingDown,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    },
    {
      label: 'Avg. Income',
      value: formatCurrency(avgIncome),
      icon: DollarSign,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-500/10'
    },
    {
      label: 'Avg. Expense',
      value: formatCurrency(avgExpense),
      icon: DollarSign,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10'
    }
  ];

  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <PieChart className="w-4 h-4 text-primary" />
          </div>
          Statistics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today's Summary */}
        {(todayIncome > 0 || todayExpense > 0) && (
          <div className="p-4 rounded-xl bg-muted/50">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Today</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Income</p>
                <p className="text-lg font-semibold text-emerald-600">+{formatCurrency(todayIncome)}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Expense</p>
                <p className="text-lg font-semibold text-red-600">-{formatCurrency(todayExpense)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="p-3 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className={`inline-flex p-1.5 rounded-lg ${stat.bgColor} ${stat.color} mb-2`}>
                <stat.icon className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-lg font-semibold">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Top Category */}
        {topCategory && (
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground mb-1">Most Used Category</p>
            <div className="flex items-center justify-between">
              <p className="font-semibold text-primary">{topCategory[0]}</p>
              <span className="text-sm text-muted-foreground">{topCategory[1]} transactions</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
