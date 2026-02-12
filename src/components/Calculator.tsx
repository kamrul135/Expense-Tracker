import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useCalculator } from '@/hooks/useCalculator';
import { Calculator as CalculatorIcon, Copy, X, Minus, Plus, Divide, Percent } from 'lucide-react';

interface CalculatorProps {
  onUseResult?: (value: number) => void;
}

export function Calculator({ onUseResult }: CalculatorProps) {
  const {
    display,
    operation,
    clear,
    deleteLast,
    inputDigit,
    inputDecimal,
    performOperation,
    performCalculation,
    getNumericValue
  } = useCalculator();

  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(display);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleUseResult = () => {
    if (onUseResult) {
      onUseResult(getNumericValue());
    }
  };

  const calcButtons = [
    { label: 'C', action: clear, variant: 'destructive' as const, colSpan: 1 },
    { label: '⌫', action: deleteLast, variant: 'secondary' as const, colSpan: 1 },
    { label: '%', action: () => performOperation('%'), variant: 'secondary' as const, colSpan: 1 },
    { label: '÷', action: () => performOperation('÷'), variant: 'secondary' as const, colSpan: 1 },
    { label: '7', action: () => inputDigit('7'), variant: 'outline' as const, colSpan: 1 },
    { label: '8', action: () => inputDigit('8'), variant: 'outline' as const, colSpan: 1 },
    { label: '9', action: () => inputDigit('9'), variant: 'outline' as const, colSpan: 1 },
    { label: '×', action: () => performOperation('×'), variant: 'secondary' as const, colSpan: 1 },
    { label: '4', action: () => inputDigit('4'), variant: 'outline' as const, colSpan: 1 },
    { label: '5', action: () => inputDigit('5'), variant: 'outline' as const, colSpan: 1 },
    { label: '6', action: () => inputDigit('6'), variant: 'outline' as const, colSpan: 1 },
    { label: '-', action: () => performOperation('-'), variant: 'secondary' as const, colSpan: 1 },
    { label: '1', action: () => inputDigit('1'), variant: 'outline' as const, colSpan: 1 },
    { label: '2', action: () => inputDigit('2'), variant: 'outline' as const, colSpan: 1 },
    { label: '3', action: () => inputDigit('3'), variant: 'outline' as const, colSpan: 1 },
    { label: '+', action: () => performOperation('+'), variant: 'secondary' as const, colSpan: 1 },
    { label: '0', action: () => inputDigit('0'), variant: 'outline' as const, colSpan: 2 },
    { label: '.', action: inputDecimal, variant: 'outline' as const, colSpan: 1 },
    { label: '=', action: performCalculation, variant: 'default' as const, colSpan: 1 },
  ];

  return (
    <Card className="glass-card border-0 overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="p-2 rounded-lg bg-primary/10">
            <CalculatorIcon className="w-4 h-4 text-primary" />
          </div>
          Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Display */}
        <div className="relative">
          <div className="bg-muted/50 rounded-xl p-4 text-right">
            <div className="text-xs text-muted-foreground h-4">
              {operation && `${operation}`}
            </div>
            <div className="text-3xl font-bold tracking-tight overflow-hidden text-ellipsis">
              {display}
            </div>
          </div>
          <div className="absolute top-2 right-2 flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 rounded-lg"
              onClick={handleCopy}
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2">
          {calcButtons.map((btn, index) => (
            <Button
              key={index}
              variant={btn.variant}
              className={`h-12 text-lg font-semibold rounded-xl transition-all duration-200 active:scale-95 ${
                btn.colSpan === 2 ? 'col-span-2' : ''
              } ${
                btn.label === '=' 
                  ? 'bg-gradient-to-r from-primary to-primary/80 hover:shadow-lg hover:shadow-primary/25' 
                  : ''
              }`}
              onClick={btn.action}
            >
              {btn.label === '÷' && <Divide className="w-4 h-4" />}
              {btn.label === '×' && <X className="w-4 h-4" />}
              {btn.label === '-' && <Minus className="w-4 h-4" />}
              {btn.label === '+' && <Plus className="w-4 h-4" />}
              {btn.label === '%' && <Percent className="w-4 h-4" />}
              {!['÷', '×', '-', '+', '%'].includes(btn.label) && btn.label}
            </Button>
          ))}
        </div>

        {/* Use Result Button */}
        {onUseResult && (
          <Button
            variant="outline"
            className="w-full rounded-xl"
            onClick={handleUseResult}
          >
            Use Result (${display})
          </Button>
        )}

        {copied && (
          <p className="text-xs text-center text-emerald-500 animate-fade-in">
            Copied to clipboard!
          </p>
        )}
      </CardContent>
    </Card>
  );
}
