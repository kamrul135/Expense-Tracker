import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { TransactionType } from '@/types/transaction';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign, Tag, FileText, Calculator } from 'lucide-react';

interface TransactionFormProps {
  onAdd: (transaction: {
    type: TransactionType;
    amount: number;
    category: string;
    description: string;
  }) => void;
  categories: {
    income: string[];
    expense: string[];
  };
  defaultAmount?: number | null;
  onAmountUsed?: () => void;
}

export function TransactionForm({ 
  onAdd, 
  categories, 
  defaultAmount,
  onAmountUsed 
}: TransactionFormProps) {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  // Apply calculator result when provided
  useEffect(() => {
    if (defaultAmount !== null && defaultAmount !== undefined) {
      setAmount(defaultAmount.toString());
      onAmountUsed?.();
    }
  }, [defaultAmount, onAmountUsed]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) return;
    if (!category) return;

    onAdd({
      type,
      amount: numAmount,
      category,
      description: description.trim() || category
    });

    // Reset form
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <Card className="glass-card card-hover border-0">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <div className="p-2 rounded-lg bg-primary/10">
            <PlusCircle className="w-5 h-5 text-primary" />
          </div>
          Add Transaction
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={type} onValueChange={(v) => {
          setType(v as TransactionType);
          setCategory('');
        }}>
          <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger 
              value="income" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all duration-300"
            >
              <TrendingUp className="w-4 h-4" />
              Income
            </TabsTrigger>
            <TabsTrigger 
              value="expense"
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-red-500 data-[state=active]:text-white transition-all duration-300"
            >
              <TrendingDown className="w-4 h-4" />
              Expense
            </TabsTrigger>
          </TabsList>

          <form onSubmit={handleSubmit} className="space-y-5">
            <TabsContent value="income" className="mt-0 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="income-amount" className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  Amount
                </Label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                  <Input
                    id="income-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9 h-12 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-lg font-semibold"
                    required
                  />
                  {amount && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Calculator className="w-4 h-4 text-emerald-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.income.map((cat) => (
                      <SelectItem key={cat} value={cat} className="rounded-lg">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="income-desc" className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Description (optional)
                </Label>
                <Input
                  id="income-desc"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-12 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300"
                />
              </div>
            </TabsContent>

            <TabsContent value="expense" className="mt-0 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="expense-amount" className="flex items-center gap-2 text-sm font-medium">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  Amount
                </Label>
                <div className="relative group">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">$</span>
                  <Input
                    id="expense-amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9 h-12 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-lg font-semibold"
                    required
                  />
                  {amount && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <Calculator className="w-4 h-4 text-red-500" />
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="flex items-center gap-2 text-sm font-medium">
                  <Tag className="w-4 h-4 text-muted-foreground" />
                  Category
                </Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger className="h-12 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-red-500/20 transition-all duration-300">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    {categories.expense.map((cat) => (
                      <SelectItem key={cat} value={cat} className="rounded-lg">
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expense-desc" className="flex items-center gap-2 text-sm font-medium">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Description (optional)
                </Label>
                <Input
                  id="expense-desc"
                  placeholder="Enter description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-12 rounded-xl bg-muted/50 border-0 focus:bg-background focus:ring-2 focus:ring-red-500/20 transition-all duration-300"
                />
              </div>
            </TabsContent>

            <Button 
              type="submit" 
              className={`w-full h-12 rounded-xl font-semibold text-base transition-all duration-300 ${
                type === 'income'
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 hover:shadow-lg hover:shadow-emerald-500/25'
                  : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 hover:shadow-lg hover:shadow-red-500/25'
              }`}
              disabled={!amount || !category}
            >
              <PlusCircle className="w-5 h-5 mr-2" />
              Add {type === 'income' ? 'Income' : 'Expense'}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
}
