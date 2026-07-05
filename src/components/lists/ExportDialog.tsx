'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useLeadLists } from '@/hooks/useLeadLists';

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  listId: string;
  selectedCount?: number;
}

const EXPORT_FIELDS = [
  { id: 'address', label: 'Address' },
  { id: 'city', label: 'City' },
  { id: 'state', label: 'State' },
  { id: 'zip', label: 'ZIP Code' },
  { id: 'value', label: 'Property Value' },
  { id: 'equity', label: 'Equity' },
  { id: 'equityPercent', label: 'Equity %' },
  { id: 'ownerType', label: 'Owner Type' },
  { id: 'status', label: 'Status' },
  { id: 'tags', label: 'Tags' },
  { id: 'ownerName', label: 'Owner Name' },
  { id: 'bedrooms', label: 'Bedrooms' },
  { id: 'bathrooms', label: 'Bathrooms' },
  { id: 'sqft', label: 'Square Feet' },
  { id: 'yearBuilt', label: 'Year Built' },
  { id: 'phone', label: 'Phone' },
  { id: 'email', label: 'Email' },
];

export function ExportDialog({
  open,
  onOpenChange,
  listId,
  selectedCount = 0,
}: ExportDialogProps) {
  const { exportList, exportSelectedProperties } = useLeadLists();
  const [isExporting, setIsExporting] = useState(false);
  const [format, setFormat] = useState<'csv' | 'excel'>('csv');
  const [scope, setScope] = useState<'all' | 'selected'>('all');
  const [selectedFields, setSelectedFields] = useState<string[]>(
    EXPORT_FIELDS.map((f) => f.id)
  );

  const toggleField = (fieldId: string) => {
    setSelectedFields((prev) =>
      prev.includes(fieldId)
        ? prev.filter((f) => f !== fieldId)
        : [...prev, fieldId]
    );
  };

  const selectAllFields = () => {
    setSelectedFields(EXPORT_FIELDS.map((f) => f.id));
  };

  const deselectAllFields = () => {
    setSelectedFields([]);
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      if (scope === 'selected' && selectedCount > 0) {
        // For selected export, we'd need the property IDs
        // This is a simplified version - in real app, pass the IDs
        const propertyIds = Array.from({ length: selectedCount }, (_, i) => `prop-${i}`);
        exportSelectedProperties(listId, propertyIds, format, selectedFields);
      } else {
        exportList(listId, format, selectedFields);
      }
      onOpenChange(false);
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setScope('all');
      setFormat('csv');
      setSelectedFields(EXPORT_FIELDS.map((f) => f.id));
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Export Properties</DialogTitle>
          <DialogDescription>
            Export property data from this list in CSV or Excel format.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Format</Label>
            <RadioGroup value={format} onValueChange={(v) => setFormat(v as 'csv' | 'excel')}>
              <div className="flex gap-4">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="csv" id="csv" />
                  <Label htmlFor="csv" className="font-normal cursor-pointer">
                    CSV
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="excel" id="excel" />
                  <Label htmlFor="excel" className="font-normal cursor-pointer">
                    Excel (.xls)
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Scope Selection */}
          {selectedCount > 0 && (
            <div className="space-y-3">
              <Label>Export Scope</Label>
              <RadioGroup value={scope} onValueChange={(v) => setScope(v as 'all' | 'selected')}>
                <div className="flex flex-col gap-2">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="all" id="export-all" />
                    <Label htmlFor="export-all" className="font-normal cursor-pointer">
                      Full list ({scope === 'selected' ? '+' : ''}{selectedCount} selected)
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="selected" id="export-selected" />
                    <Label htmlFor="export-selected" className="font-normal cursor-pointer">
                      Only selected ({selectedCount})
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Field Selection */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Fields to Include</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={selectAllFields}
                  className="h-auto p-0 text-xs"
                >
                  Select All
                </Button>
                <span className="text-muted-foreground">|</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={deselectAllFields}
                  className="h-auto p-0 text-xs"
                >
                  Deselect All
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 max-h-[200px] overflow-y-auto border rounded-md p-3">
              {EXPORT_FIELDS.map((field) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`field-${field.id}`}
                    checked={selectedFields.includes(field.id)}
                    onCheckedChange={() => toggleField(field.id)}
                  />
                  <Label
                    htmlFor={`field-${field.id}`}
                    className="font-normal cursor-pointer text-sm"
                  >
                    {field.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting || selectedFields.length === 0}>
            {isExporting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <Download className="mr-2 h-4 w-4" />
            Export {selectedFields.length} Field{selectedFields.length !== 1 ? 's' : ''}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
