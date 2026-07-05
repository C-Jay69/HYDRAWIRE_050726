'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertFrequency, alertFrequencyLabels } from '@/lib/alerts';
import { FilterState } from '@/types';

interface SaveSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  location?: string;
  onSave: (name: string, alertFrequency: AlertFrequency) => void;
  isLoading?: boolean;
}

export function SaveSearchDialog({
  open,
  onOpenChange,
  filters,
  location = '',
  onSave,
  isLoading = false,
}: SaveSearchDialogProps) {
  const [name, setName] = useState('');
  const [alertFrequency, setAlertFrequency] = useState<AlertFrequency>('none');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name.trim(), alertFrequency);
    setName('');
    setAlertFrequency('none');
  };

  const handleClose = () => {
    setName('');
    setAlertFrequency('none');
    onOpenChange(false);
  };

  const activeFiltersCount = Object.values(filters).filter(
    (value) =>
      value !== undefined &&
      value !== null &&
      (Array.isArray(value) ? value.length > 0 : true)
  ).length;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Save This Search
          </DialogTitle>
          <DialogDescription>
            Save your current search filters to run later or set up alerts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Current Filters Summary */}
          <div className="rounded-lg border bg-muted/50 p-3">
            <p className="text-sm font-medium mb-2">Current Filters</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              {location && (
                <p className="flex items-center gap-1">
                  <span className="font-medium text-foreground">Location:</span> {location}
                </p>
              )}
              <p>
                <span className="font-medium text-foreground">Active filters:</span>{' '}
                {activeFiltersCount}
              </p>
              {filters.ownerType && filters.ownerType !== 'all' && (
                <p>
                  <span className="font-medium text-foreground">Owner type:</span>{' '}
                  {filters.ownerType}
                </p>
              )}
              {filters.propertyType && filters.propertyType.length > 0 && (
                <p>
                  <span className="font-medium text-foreground">Property types:</span>{' '}
                  {filters.propertyType.join(', ')}
                </p>
              )}
            </div>
          </div>

          {/* Search Name */}
          <div className="space-y-2">
            <Label htmlFor="search-name">Search Name</Label>
            <Input
              id="search-name"
              placeholder="e.g., LA Absentee Owners"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Alert Frequency */}
          <div className="space-y-2">
            <Label htmlFor="alert-frequency">Alert Frequency</Label>
            <Select
              value={alertFrequency}
              onValueChange={(value) => setAlertFrequency(value as AlertFrequency)}
            >
              <SelectTrigger id="alert-frequency">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(alertFrequencyLabels) as AlertFrequency[]).map((freq) => (
                  <SelectItem key={freq} value={freq}>
                    {alertFrequencyLabels[freq]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Choose how often you want to be notified about new matches.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name.trim() || isLoading}>
            {isLoading ? 'Saving...' : 'Save Search'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
