'use client';

import { useState } from 'react';
import { Phone, Mail, MapPin, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import {
  SkipTraceResult,
  runSkipTrace,
  SKIP_TRACE_CREDIT_COST,
  getConfidenceColor,
  getConfidenceBgColor,
} from '@/lib/skip-trace';
import { cn } from '@/lib/utils';

interface SkipTraceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  propertyAddress: string;
  ownerName: string;
}

export function SkipTraceModal({
  open,
  onOpenChange,
  propertyId,
  propertyAddress,
  ownerName,
}: SkipTraceModalProps) {
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

  const handleClose = () => {
    setResult(null);
    setError(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Skip Trace</DialogTitle>
          <DialogDescription>
            {result ? 'Skip trace results' : 'Run a skip trace to find contact information'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Property Preview */}
          <div className="rounded-lg border bg-muted/50 p-4">
            <div className="space-y-2">
              <p className="font-medium">{propertyAddress}</p>
              <p className="text-sm text-muted-foreground">Owner: {ownerName}</p>
            </div>
          </div>

          {!result ? (
            <>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div>
                  <p className="font-medium">Credit Cost</p>
                  <p className="text-sm text-muted-foreground">
                    This skip trace will use {SKIP_TRACE_CREDIT_COST} credit
                  </p>
                </div>
                <Badge variant="secondary" className="text-lg px-3 py-1">
                  {SKIP_TRACE_CREDIT_COST}
                </Badge>
              </div>

              {error && (
                <p className="text-sm text-red-500 text-center">{error}</p>
              )}

              <Button
                onClick={handleRunSkipTrace}
                disabled={isLoading}
                className="w-full"
                size="lg"
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
            </>
          ) : (
            <div className="space-y-4 max-h-[400px] overflow-y-auto">
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

              <Separator />

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
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            {result ? 'Close' : 'Cancel'}
          </Button>
          {result && (
            <Button onClick={handleRunSkipTrace} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                'Run Again'
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
