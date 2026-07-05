'use client';

import { useState } from 'react';
import { CheckSquare, X, Tag, Download, ChevronDown, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLeadLists, PropertyStatus } from '@/hooks/useLeadLists';
import { cn } from '@/lib/utils';

interface BulkActionsToolbarProps {
  listId: string;
  selectedCount: number;
  onExportSelected: () => void;
  onClearSelection: () => void;
}

const STATUS_OPTIONS: { value: PropertyStatus; label: string; color: string }[] = [
  { value: 'new', label: 'New', color: 'bg-blue-500' },
  { value: 'contacted', label: 'Contacted', color: 'bg-yellow-500' },
  { value: 'interested', label: 'Interested', color: 'bg-green-500' },
  { value: 'skip', label: 'Skip', color: 'bg-gray-500' },
  { value: 'converted', label: 'Converted', color: 'bg-purple-500' },
];

export function BulkActionsToolbar({
  listId,
  selectedCount,
  onExportSelected,
  onClearSelection,
}: BulkActionsToolbarProps) {
  const { bulkUpdateStatus, bulkRemoveProperties } = useLeadLists();
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (status: PropertyStatus) => {
    setIsUpdating(true);
    try {
      // Get selected property IDs from the DOM or state
      // In a real app, you'd pass these as props
      const checkboxes = document.querySelectorAll(
        'input[name="property-checkbox"]:checked'
      ) as NodeListOf<HTMLInputElement>;
      const propertyIds = Array.from(checkboxes)
        .map((cb) => cb.value)
        .filter((id) => id);

      if (propertyIds.length > 0) {
        bulkUpdateStatus(listId, propertyIds, status);
      }
    } finally {
      setIsUpdating(false);
    }
  };

  const handleBulkRemove = () => {
    const checkboxes = document.querySelectorAll(
      'input[name="property-checkbox"]:checked'
    ) as NodeListOf<HTMLInputElement>;
    const propertyIds = Array.from(checkboxes)
      .map((cb) => cb.value)
      .filter((id) => id);

    if (propertyIds.length > 0) {
      bulkRemoveProperties(listId, propertyIds);
      onClearSelection();
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'flex items-center gap-3 px-4 py-3',
        'bg-background border rounded-lg shadow-lg',
        'animate-in slide-in-from-bottom-4 fade-in duration-200'
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium">
        <CheckSquare className="h-4 w-4 text-primary" />
        <span>{selectedCount} selected</span>
      </div>

      <div className="w-px h-6 bg-border" />

      {/* Status Change Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild disabled={isUpdating}>
          <Button variant="outline" size="sm">
            Change Status
            <ChevronDown className="ml-1 h-3 w-3" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="center" className="w-40">
          {STATUS_OPTIONS.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
            >
              <span className={cn('mr-2 h-2 w-2 rounded-full', option.color)} />
              {option.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Add Tag Button */}
      <Button variant="outline" size="sm" disabled>
        <Tag className="mr-1 h-3 w-3" />
        Add Tag
      </Button>

      {/* Export Selected */}
      <Button variant="outline" size="sm" onClick={onExportSelected}>
        <Download className="mr-1 h-3 w-3" />
        Export
      </Button>

      {/* Remove from List */}
      <Button
        variant="outline"
        size="sm"
        onClick={handleBulkRemove}
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="mr-1 h-3 w-3" />
        Remove
      </Button>

      <div className="w-px h-6 bg-border" />

      {/* Clear Selection */}
      <Button variant="ghost" size="sm" onClick={onClearSelection}>
        <X className="mr-1 h-3 w-3" />
        Clear
      </Button>
    </div>
  );
}
