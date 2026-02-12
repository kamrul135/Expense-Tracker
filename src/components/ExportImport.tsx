import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Download, Upload, FileJson, FileSpreadsheet, AlertTriangle, CheckCircle2 } from 'lucide-react';
import type { Transaction } from '@/types/transaction';

interface ExportImportProps {
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => void;
}

export function ExportImport({ transactions, onImport }: ExportImportProps) {
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportToCSV = () => {
    if (transactions.length === 0) return;

    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount'];
    const rows = transactions.map(t => [
      new Date(t.date).toLocaleDateString(),
      t.type,
      t.category,
      t.description,
      t.amount.toFixed(2)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = () => {
    if (transactions.length === 0) return;

    const data = {
      exportDate: new Date().toISOString(),
      totalTransactions: transactions.length,
      transactions
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_${new Date().toISOString().split('T')[0]}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target?.result as string);
          if (data.transactions && Array.isArray(data.transactions)) {
            onImport(data.transactions);
            setImportStatus('success');
            setImportMessage(`Successfully imported ${data.transactions.length} transactions`);
            setTimeout(() => {
              setShowImportDialog(false);
              setImportStatus('idle');
            }, 2000);
          } else {
            throw new Error('Invalid file format');
          }
        } catch (error) {
          setImportStatus('error');
          setImportMessage('Failed to parse file. Please ensure it\'s a valid JSON export.');
        }
      };
      
      reader.readAsText(file);
    } catch (error) {
      setImportStatus('error');
      setImportMessage('Failed to read file');
    }
  };

  const hasData = transactions.length > 0;

  return (
    <>
      <Card className="glass-card border-0">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-2 rounded-lg bg-primary/10">
              <Download className="w-4 h-4 text-primary" />
            </div>
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="rounded-xl gap-2"
              onClick={exportToCSV}
              disabled={!hasData}
            >
              <FileSpreadsheet className="w-4 h-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              className="rounded-xl gap-2"
              onClick={exportToJSON}
              disabled={!hasData}
            >
              <FileJson className="w-4 h-4" />
              JSON
            </Button>
          </div>
          <Button
            variant="outline"
            className="w-full rounded-xl gap-2"
            onClick={() => setShowImportDialog(true)}
          >
            <Upload className="w-4 h-4" />
            Import Data
          </Button>
          {!hasData && (
            <p className="text-xs text-center text-muted-foreground">
              Add transactions to enable export
            </p>
          )}
        </CardContent>
      </Card>

      <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
        <DialogContent className="glass-card border-0">
          <DialogHeader>
            <DialogTitle>Import Transactions</DialogTitle>
            <DialogDescription>
              Import transactions from a previously exported JSON file.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 pt-4">
            {importStatus === 'idle' && (
              <>
                <div className="border-2 border-dashed border-muted rounded-xl p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="w-10 h-10 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm font-medium">Click to select file</p>
                  <p className="text-xs text-muted-foreground mt-1">Supports JSON files only</p>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={handleFileSelect}
                />
              </>
            )}

            {importStatus === 'success' && (
              <div className="text-center py-8">
                <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                <p className="text-sm font-medium text-emerald-600">{importMessage}</p>
              </div>
            )}

            {importStatus === 'error' && (
              <div className="text-center py-8">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-500" />
                <p className="text-sm font-medium text-red-600">{importMessage}</p>
                <Button
                  variant="outline"
                  className="mt-4 rounded-xl"
                  onClick={() => setImportStatus('idle')}
                >
                  Try Again
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
