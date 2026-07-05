'use client';

import { useState, useMemo } from 'react';
import { Upload, CheckCircle2, XCircle, Download, Loader2, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { runSkipTrace, SKIP_TRACE_CREDIT_COST, SkipTraceResult } from '@/lib/skip-trace';
import { cn } from '@/lib/utils';
import { Property } from '@/types';

interface BatchSkipTraceProps {
  properties: Property[];
  onComplete?: (results: SkipTraceResult[]) => void;
  className?: string;
}

interface BatchItem {
  property: Property;
  selected: boolean;
  status: 'pending' | 'running' | 'completed' | 'error';
  result?: SkipTraceResult;
  error?: string;
}

export function BatchSkipTrace({ properties, onComplete, className }: BatchSkipTraceProps) {
  const [items, setItems] = useState<BatchItem[]>(() =>
    properties.map((property) => ({
      property,
      selected: true,
      status: 'pending' as const,
    }))
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const selectedItems = useMemo(() => items.filter((item) => item.selected), [items]);
  const totalCredits = selectedItems.length * SKIP_TRACE_CREDIT_COST;
  const completedCount = items.filter((item) => item.status === 'completed').length;
  const errorCount = items.filter((item) => item.status === 'error').length;

  const handleSelectAll = (selected: boolean) => {
    setItems((prev) => prev.map((item) => ({ ...item, selected })));
  };

  const handleSelectItem = (index: number, selected: boolean) => {
    setItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, selected } : item))
    );
  };

  const handleRunBatch = async () => {
    setIsProcessing(true);
    setProgress(0);

    const selectedProperties = items.filter((item) => item.selected);

    for (let i = 0; i < selectedProperties.length; i++) {
      const item = selectedProperties[i];
      const itemIndex = items.findIndex((i) => i.property.id === item.property.id);

      // Update status to running
      setItems((prev) =>
        prev.map((it, idx) =>
          idx === itemIndex ? { ...it, status: 'running' } : it
        )
      );

      try {
        const result = await runSkipTrace(
          item.property.id,
          `${item.property.address}, ${item.property.city}, ${item.property.state} ${item.property.zip}`,
          item.property.owner_name
        );

        setItems((prev) =>
          prev.map((it, idx) =>
            idx === itemIndex ? { ...it, status: 'completed', result } : it
          )
        );
      } catch {
        setItems((prev) =>
          prev.map((it, idx) =>
            idx === itemIndex
              ? { ...it, status: 'error', error: 'Failed to run skip trace' }
              : it
          )
        );
      }

      setProgress(((i + 1) / selectedProperties.length) * 100);
    }

    setIsProcessing(false);

    const results = items
      .filter((item) => item.status === 'completed' && item.result)
      .map((item) => item.result!);

    if (onComplete) {
      onComplete(results);
    }
  };

  const handleExportResults = () => {
    const completedItems = items.filter((item) => item.status === 'completed' && item.result);
    if (completedItems.length === 0) return;

    const data = completedItems.map((item) => item.result);
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `batch-skip-trace-results-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const completedResults = items
    .filter((item) => item.status === 'completed' && item.result)
    .map((item) => item.result!);

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Batch Skip Trace</CardTitle>
          <Badge variant="secondary">
            {items.length} properties
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-2 gap-4 rounded-lg border p-4">
          <div>
            <p className="text-sm text-muted-foreground">Selected</p>
            <p className="text-2xl font-semibold">{selectedItems.length}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Credits</p>
            <p className="text-2xl font-semibold">{totalCredits}</p>
          </div>
        </div>

        {/* Select All */}
        <div className="flex items-center gap-2">
          <Checkbox
            id="select-all"
            checked={selectedItems.length === items.length}
            onCheckedChange={handleSelectAll}
          />
          <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
            Select All / Deselect All
          </label>
        </div>

        {/* Property List */}
        <ScrollArea className="h-[200px] rounded-md border">
          <div className="p-4 space-y-2">
            {items.map((item, index) => (
              <div
                key={item.property.id}
                className={cn(
                  'flex items-center gap-3 p-2 rounded-md transition-colors',
                  item.status === 'running' && 'bg-primary/5',
                  item.status === 'completed' && 'bg-green-50 dark:bg-green-950/20',
                  item.status === 'error' && 'bg-red-50 dark:bg-red-950/20'
                )}
              >
                <Checkbox
                  checked={item.selected}
                  onCheckedChange={(checked) => handleSelectItem(index, !!checked)}
                  disabled={isProcessing}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.property.address}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {item.property.owner_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'pending' && (
                    <Badge variant="outline" className="text-xs">
                      Pending
                    </Badge>
                  )}
                  {item.status === 'running' && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {item.status === 'completed' && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                  {item.status === 'error' && (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Progress */}
        {isProcessing && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Processing...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )}

        {/* Results Summary */}
        {!isProcessing && completedCount > 0 && (
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950/20">
              <p className="text-2xl font-semibold text-green-600">{completedCount}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950/20">
              <p className="text-2xl font-semibold text-red-600">{errorCount}</p>
              <p className="text-xs text-muted-foreground">Errors</p>
            </div>
            <div className="p-2 rounded-lg bg-muted">
              <p className="text-2xl font-semibold">{totalCredits}</p>
              <p className="text-xs text-muted-foreground">Credits Used</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          {!isProcessing && completedCount === 0 && (
            <Button
              onClick={handleRunBatch}
              disabled={selectedItems.length === 0}
              className="flex-1"
            >
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Run Batch Skip Trace
            </Button>
          )}
          {!isProcessing && completedCount > 0 && (
            <Button
              variant="outline"
              onClick={handleExportResults}
              className="flex-1"
            >
              <Download className="mr-2 h-4 w-4" />
              Export Results ({completedCount})
            </Button>
          )}
          {!isProcessing && completedCount > 0 && (
            <Button
              variant="outline"
              onClick={() => {
                setItems((prev) =>
                  prev.map((item) => ({
                    ...item,
                    status: 'pending' as const,
                    result: undefined,
                    error: undefined,
                  }))
                );
                setProgress(0);
              }}
              className="flex-1"
            >
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
