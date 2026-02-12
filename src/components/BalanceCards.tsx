import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Wallet, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface BalanceCardsProps {
  balance: number;
  totalIncome: number;
  totalExpense: number;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(amount);
}

export function BalanceCards({ balance, totalIncome, totalExpense }: BalanceCardsProps) {
  const isPositive = balance >= 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Total Balance */}
      <Card className={`relative overflow-hidden card-hover ${
        isPositive 
          ? 'bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600' 
          : 'bg-gradient-to-br from-red-500 via-red-600 to-rose-600'
      } text-white border-0`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-white/80 text-sm font-medium flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Total Balance
              </p>
              <p className="text-3xl font-bold tracking-tight">{formatCurrency(balance)}</p>
              <div className="flex items-center gap-1 text-white/70 text-xs">
                {isPositive ? (
                  <>
                    <ArrowUpRight className="w-3 h-3" />
                    <span>You're in good shape</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-3 h-3" />
                    <span>Consider reducing expenses</span>
                  </>
                )}
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Income */}
      <Card className="relative overflow-hidden card-hover bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 text-white border-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-1/2 translate-x-1/2" />
        </div>
        
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-white/80 text-sm font-medium flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Total Income
              </p>
              <p className="text-3xl font-bold tracking-tight">{formatCurrency(totalIncome)}</p>
              <div className="flex items-center gap-1 text-white/70 text-xs">
                <ArrowUpRight className="w-3 h-3" />
                <span>Money coming in</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Expense */}
      <Card className="relative overflow-hidden card-hover bg-gradient-to-br from-orange-500 via-orange-600 to-amber-600 text-white border-0">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-1/2 -translate-x-1/2" />
        </div>
        
        <CardContent className="relative p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-white/80 text-sm font-medium flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Total Expense
              </p>
              <p className="text-3xl font-bold tracking-tight">{formatCurrency(totalExpense)}</p>
              <div className="flex items-center gap-1 text-white/70 text-xs">
                <ArrowDownRight className="w-3 h-3" />
                <span>Money going out</span>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
