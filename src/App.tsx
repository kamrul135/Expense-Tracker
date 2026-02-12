import { useState } from 'react';
import { useTransactions } from '@/hooks/useTransactions';
import { useTheme } from '@/hooks/useTheme';
import { useBudget } from '@/hooks/useBudget';
import { TransactionForm } from '@/components/TransactionForm';
import { BalanceCards } from '@/components/BalanceCards';
import { TransactionList } from '@/components/TransactionList';
import { Charts } from '@/components/Charts';
import { Calculator } from '@/components/Calculator';
import { BudgetManager } from '@/components/BudgetManager';
import { ExportImport } from '@/components/ExportImport';
import { Statistics } from '@/components/Statistics';
import { CurrencyConverter } from '@/components/CurrencyConverter';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wallet, Loader2, Sun, Moon, Sparkles, Calculator as CalculatorIcon, BarChart3, Settings2 } from 'lucide-react';

function App() {
  const {
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
    categories
  } = useTransactions();

  const {
    budgets,
    addBudget,
    deleteBudget
  } = useBudget();

  const { isDark, toggleTheme, isLoaded: themeLoaded } = useTheme();
  const [showCalculator, setShowCalculator] = useState(false);
  const [calculatorValue, setCalculatorValue] = useState<number | null>(null);

  // Calculate category spending for budget tracking
  const categorySpending: Record<string, number> = {};
  transactions.filter(t => t.type === 'expense').forEach(t => {
    categorySpending[t.category] = (categorySpending[t.category] || 0) + t.amount;
  });

  const handleUseCalculatorResult = (value: number) => {
    setCalculatorValue(value);
    setShowCalculator(false);
  };

  const handleImport = (importedTransactions: any[]) => {
    importedTransactions.forEach(t => {
      addTransaction({
        type: t.type,
        amount: t.amount,
        category: t.category,
        description: t.description
      });
    });
  };

  if (!isLoaded || !themeLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
            <Loader2 className="w-10 h-10 animate-spin text-primary relative" />
          </div>
          <span className="text-muted-foreground text-sm">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-primary/5 via-transparent to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-emerald-500/5 via-transparent to-transparent rounded-full blur-3xl" />
        {isDark && (
          <>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </>
        )}
      </div>

      {/* Header */}
      <header className="relative z-10 glass-card sticky top-4 mx-4 mt-4 rounded-2xl">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 to-blue-500 rounded-xl blur-lg opacity-50" />
                <div className="relative bg-gradient-to-br from-emerald-500 to-blue-600 p-3 rounded-xl">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">
                  <span className="gradient-text">Expense</span> Tracker
                </h1>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Advanced Finance Manager
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowCalculator(!showCalculator)}
                className={`rounded-xl transition-all duration-300 ${showCalculator ? 'bg-primary text-primary-foreground' : ''}`}
              >
                <CalculatorIcon className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleTheme}
                className="rounded-xl glass-card hover:bg-accent/50 transition-all duration-300"
              >
                {isDark ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-600" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Balance Cards */}
        <div className="mb-8 animate-fade-in">
          <BalanceCards 
            balance={balance} 
            totalIncome={totalIncome} 
            totalExpense={totalExpense} 
          />
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4 p-1 bg-muted/50 rounded-xl max-w-md mx-auto">
            <TabsTrigger 
              value="dashboard" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger 
              value="transactions"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Wallet className="w-4 h-4" />
              <span className="hidden sm:inline">Transactions</span>
            </TabsTrigger>
            <TabsTrigger 
              value="tools"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <CalculatorIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Tools</span>
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <Settings2 className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="mt-0 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="lg:col-span-1 space-y-6">
                <TransactionForm 
                  onAdd={addTransaction} 
                  categories={categories}
                  defaultAmount={calculatorValue}
                  onAmountUsed={() => setCalculatorValue(null)}
                />
                {showCalculator && (
                  <div className="animate-scale-in">
                    <Calculator onUseResult={handleUseCalculatorResult} />
                  </div>
                )}
              </div>

              {/* Right Column */}
              <div className="lg:col-span-2 space-y-6">
                <Charts 
                  getCategoryData={getCategoryData}
                  getMonthlyData={getMonthlyData}
                />
                <TransactionList 
                  transactions={transactions}
                  onDelete={deleteTransaction}
                  onClear={clearAll}
                />
              </div>
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <TransactionList 
                  transactions={transactions}
                  onDelete={deleteTransaction}
                  onClear={clearAll}
                />
              </div>
              <div className="space-y-6">
                <Statistics 
                  transactions={transactions}
                  totalIncome={totalIncome}
                  totalExpense={totalExpense}
                />
                <BudgetManager 
                  budgets={budgets}
                  categorySpending={categorySpending}
                  categories={categories.expense}
                  onAdd={addBudget}
                  onDelete={deleteBudget}
                />
              </div>
            </div>
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Calculator onUseResult={(val) => alert(`Result: $${val.toFixed(2)}`)} />
              <CurrencyConverter />
              <Statistics 
                transactions={transactions}
                totalIncome={totalIncome}
                totalExpense={totalExpense}
              />
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ExportImport 
                transactions={transactions}
                onImport={handleImport}
              />
              <BudgetManager 
                budgets={budgets}
                categorySpending={categorySpending}
                categories={categories.expense}
                onAdd={addBudget}
                onDelete={deleteBudget}
              />
              <Card className="glass-card border-0">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Settings2 className="w-4 h-4 text-primary" />
                    </div>
                    App Info
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Total Transactions</span>
                      <span className="font-medium">{transactions.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Budget Goals</span>
                      <span className="font-medium">{budgets.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Theme</span>
                      <span className="font-medium capitalize">{isDark ? 'Dark' : 'Light'}</span>
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground text-center">
                      Expense Tracker v2.0<br />
                      Data stored locally in your browser
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-card rounded-2xl py-6 px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Expense Tracker • Data saved locally
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-muted-foreground">Auto-save enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Need to import Card for the App Info section
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default App;
