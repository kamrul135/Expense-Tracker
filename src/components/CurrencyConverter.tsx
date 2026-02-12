import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { ArrowRightLeft, RefreshCw, Coins } from 'lucide-react';

interface ExchangeRates {
  [key: string]: number;
}

const currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
  { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
  { code: 'KRW', name: 'South Korean Won', symbol: '₩' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$' }
];

// Fallback rates (approximate)
const fallbackRates: ExchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 149.50,
  CAD: 1.35,
  AUD: 1.52,
  CHF: 0.88,
  CNY: 7.19,
  INR: 83.12,
  SGD: 1.34,
  KRW: 1330.50,
  BRL: 4.95
};

export function CurrencyConverter() {
  const [amount, setAmount] = useState('100');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [rates, setRates] = useState<ExchangeRates>(fallbackRates);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    try {
      // Using a free API - in production, use your own API key
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (response.ok) {
        const data = await response.json();
        setRates(data.rates);
        setLastUpdated(new Date());
      }
    } catch (error) {
      console.log('Using fallback rates');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  const convert = useCallback(() => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount)) return 0;

    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    
    // Convert to USD first, then to target currency
    const inUSD = numAmount / fromRate;
    return inUSD * toRate;
  }, [amount, fromCurrency, toCurrency, rates]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || code;
  };

  const convertedAmount = convert();

  return (
    <Card className="glass-card border-0">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <Coins className="w-4 h-4 text-primary" />
            </div>
            Currency Converter
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={fetchRates}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amount Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Amount</label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {getCurrencySymbol(fromCurrency)}
            </span>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="pl-8 rounded-xl"
              placeholder="Enter amount"
            />
          </div>
        </div>

        {/* Currency Selection */}
        <div className="flex items-center gap-2">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">From</label>
            <Select value={fromCurrency} onValueChange={setFromCurrency}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                {currencies.map(c => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="outline"
            size="icon"
            className="mt-6 rounded-xl"
            onClick={handleSwap}
          >
            <ArrowRightLeft className="w-4 h-4" />
          </Button>

          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">To</label>
            <Select value={toCurrency} onValueChange={setToCurrency}>
              <SelectTrigger className="rounded-xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-xl max-h-60">
                {currencies.map(c => (
                  <SelectItem key={c.code} value={c.code}>
                    {c.code} - {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Result */}
        <div className="p-4 rounded-xl bg-muted/50 text-center">
          <p className="text-sm text-muted-foreground mb-1">
            {amount} {fromCurrency} =
          </p>
          <p className="text-2xl font-bold">
            {getCurrencySymbol(toCurrency)}{convertedAmount.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            1 {fromCurrency} = {((rates[toCurrency] || 1) / (rates[fromCurrency] || 1)).toFixed(4)} {toCurrency}
          </p>
        </div>

        {lastUpdated && (
          <p className="text-xs text-center text-muted-foreground">
            Rates updated: {lastUpdated.toLocaleTimeString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
