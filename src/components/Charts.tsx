import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import type { TransactionType, CategorySummary } from '@/types/transaction';
import { BarChart3, PieChart as PieChartIcon, TrendingUp, TrendingDown, Activity } from 'lucide-react';

interface ChartsProps {
  getCategoryData: (type: TransactionType) => CategorySummary[];
  getMonthlyData: () => { name: string; income: number; expense: number }[];
}

function formatCurrency(value: number): string {
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}k`;
  }
  return `$${value.toFixed(0)}`;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="glass-card rounded-xl p-3 border-0 shadow-xl">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-semibold text-foreground">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="glass-card rounded-xl p-3 border-0 shadow-xl">
        <div className="flex items-center gap-2">
          <div 
            className="w-3 h-3 rounded-full" 
            style={{ backgroundColor: data.payload.color }}
          />
          <span className="font-semibold text-foreground">{data.name}</span>
        </div>
        <p className="text-lg font-bold text-foreground mt-1">
          {formatCurrency(data.value)}
        </p>
      </div>
    );
  }
  return null;
};

export function Charts({ getCategoryData, getMonthlyData }: ChartsProps) {
  const [activeTab, setActiveTab] = useState('monthly');
  
  const incomeCategories = getCategoryData('income');
  const expenseCategories = getCategoryData('expense');
  const monthlyData = getMonthlyData();

  const hasIncome = incomeCategories.length > 0;
  const hasExpense = expenseCategories.length > 0;
  const hasMonthlyData = monthlyData.length > 0;

  const totalIncome = incomeCategories.reduce((sum, cat) => sum + cat.value, 0);
  const totalExpense = expenseCategories.reduce((sum, cat) => sum + cat.value, 0);

  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl flex items-center gap-2">
          <div className="p-2 rounded-lg bg-primary/10">
            <Activity className="w-5 h-5 text-primary" />
          </div>
          Analytics Dashboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-6 p-1 bg-muted/50 rounded-xl">
            <TabsTrigger 
              value="monthly" 
              className="flex items-center gap-2 rounded-lg data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <BarChart3 className="w-4 h-4" />
              Monthly
            </TabsTrigger>
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

          {/* Monthly Bar Chart */}
          <TabsContent value="monthly" className="mt-0">
            <div className="h-[320px]">
              {hasMonthlyData ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 20, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#22c55e" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#22c55e" stopOpacity={0.6}/>
                      </linearGradient>
                      <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#ef4444" stopOpacity={1}/>
                        <stop offset="100%" stopColor="#ef4444" stopOpacity={0.6}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={formatCurrency}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend 
                      wrapperStyle={{ paddingTop: '20px' }}
                      iconType="circle"
                    />
                    <Bar 
                      dataKey="income" 
                      name="Income" 
                      fill="url(#incomeGradient)" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={50}
                    />
                    <Bar 
                      dataKey="expense" 
                      name="Expense" 
                      fill="url(#expenseGradient)" 
                      radius={[8, 8, 0, 0]}
                      maxBarSize={50}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <div className="absolute inset-0 bg-primary/10 rounded-full blur-xl" />
                      <BarChart3 className="w-12 h-12 text-muted-foreground relative" />
                    </div>
                    <p className="text-muted-foreground">No monthly data available</p>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Income Pie Chart */}
          <TabsContent value="income" className="mt-0">
            <div className="h-[320px]">
              {hasIncome ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={incomeCategories}
                      cx="40%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {incomeCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend 
                      verticalAlign="middle" 
                      align="right"
                      layout="vertical"
                      iconType="circle"
                      wrapperStyle={{ paddingLeft: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-xl" />
                      <PieChartIcon className="w-12 h-12 text-muted-foreground relative" />
                    </div>
                    <p className="text-muted-foreground">No income data available</p>
                  </div>
                </div>
              )}
            </div>
            {hasIncome && (
              <div className="mt-4 p-4 rounded-xl bg-emerald-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Income</span>
                  <span className="text-lg font-bold text-emerald-600">{formatCurrency(totalIncome)}</span>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Expense Pie Chart */}
          <TabsContent value="expense" className="mt-0">
            <div className="h-[320px]">
              {hasExpense ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={expenseCategories}
                      cx="40%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={3}
                      dataKey="value"
                      nameKey="name"
                    >
                      {expenseCategories.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                    <Legend 
                      verticalAlign="middle" 
                      align="right"
                      layout="vertical"
                      iconType="circle"
                      wrapperStyle={{ paddingLeft: '20px' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <div className="relative inline-flex items-center justify-center mb-4">
                      <div className="absolute inset-0 bg-red-500/10 rounded-full blur-xl" />
                      <PieChartIcon className="w-12 h-12 text-muted-foreground relative" />
                    </div>
                    <p className="text-muted-foreground">No expense data available</p>
                  </div>
                </div>
              )}
            </div>
            {hasExpense && (
              <div className="mt-4 p-4 rounded-xl bg-red-500/10">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Total Expense</span>
                  <span className="text-lg font-bold text-red-600">{formatCurrency(totalExpense)}</span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
