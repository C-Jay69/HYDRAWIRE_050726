'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Download, Save, ExternalLink, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  SkipTraceResult,
  runSkipTrace,
  SKIP_TRACE_CREDIT_COST,
  getConfidenceColor,
  getConfidenceBgColor,
} from '@/lib/skip-trace';
import { cn } from '@/lib/utils';

interface SkipTracePanelProps {
  propertyId: string;
  propertyAddress: string;
  ownerName: string;
  onSave?: (result: SkipTraceResult) => void;
  className?: string;
}

export function SkipTracePanel({
  propertyId,
  propertyAddress,
  ownerName,
  onSave,
  className,
}: SkipTracePanelProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SkipTraceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRunSkipTrace = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const skipTraceResult = await runSkipTrace(propertyId, propertyAddress, ownerName);
      setResult(skipTraceResult);
    } catch (err) {
      setError('Failed to run skip trace. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = () => {
    if (!result) return;
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `skip-trace-${propertyId}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSave = () => {
    if (result && onSave) {
      onSave(result);
    }
  };

  return (
    <Card className={cn('', className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Skip Trace</CardTitle>
          {!result && (
            <Badge variant="secondary" className="text-xs">
              {SKIP_TRACE_CREDIT_COST} credit
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {!result ? (
          <div className="space-y-4">
            <div className="rounded-lg border p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Run skip trace to find:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Phone numbers (mobile & landline)</li>
                <li>Email addresses</li>
                <li>Mailing addresses</li>
              </ul>
            </div>
            <Button
              onClick={handleRunSkipTrace}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running Skip Trace...
                </>
              ) : (
                'Run Skip Trace'
              )}
            </Button>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Confidence Score */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Confidence Score</span>
                <span className={cn('font-semibold', getConfidenceColor(result.confidence_score))}>
                  {result.confidence_score}%
                </span>
              </div>
              <Progress
                value={result.confidence_score}
                className="h-2"
                indicatorClassName={getConfidenceBgColor(result.confidence_score)}
              />
              <p className="text-xs text-muted-foreground">
                Source: {result.source}
              </p>
            </div>

            {/* Phone Numbers */}
            {result.phones.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Phone className="h-4 w-4" />
                  Phone Numbers
                </div>
                <div className="space-y-1">
                  {result.phones.map((phone, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={phone.type === 'mobile' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {phone.type}
                        </Badge>
                        <a
                          href={`tel:${phone.number}`}
                          className="hover:underline"
                        >
                          {phone.number}
                        </a>
                      </div>
                      <span
                        className={cn(
                          'text-xs font-medium',
                          getConfidenceColor(phone.confidence)
                        )}
                      >
                        {phone.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Email Addresses */}
            {result.emails.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email Addresses
                </div>
                <div className="space-y-1">
                  {result.emails.map((email, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <a
                        href={`mailto:${email.address}`}
                        className="hover:underline truncate"
                      >
                        {email.address}
                      </a>
                      <span
                        className={cn(
                          'text-xs font-medium ml-2',
                          getConfidenceColor(email.confidence)
                        )}
                      >
                        {email.confidence}%
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Addresses */}
            {result.addresses.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <MapPin className="h-4 w-4" />
                  Addresses
                </div>
                <div className="space-y-1">
                  {result.addresses.map((addr, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md border p-2 text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs capitalize">
                          {addr.type}
                        </Badge>
                        <span className="truncate">{addr.address}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {onSave && (
                <Button
                  variant="default"
                  size="sm"
                  onClick={handleSave}
                  className="flex-1"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save to Property
                </Button>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleRunSkipTrace}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Run Again
                </>
              )}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
