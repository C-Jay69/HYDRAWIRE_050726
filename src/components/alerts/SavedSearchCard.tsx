'use client';

import { useState } from 'react';
import { Pencil, Trash2, Clock, Search, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  SavedSearch,
  alertFrequencyLabels,
  alertFrequencyColors,
  formatSearchSummary,
} from '@/lib/alerts';
import { cn } from '@/lib/utils';

interface SavedSearchCardProps {
  search: SavedSearch;
  onEdit?: (search: SavedSearch) => void;
  onDelete?: (search: SavedSearch) => void;
  onToggleActive?: (search: SavedSearch) => void;
  onUpdateFrequency?: (search: SavedSearch, frequency: SavedSearch['alert_frequency']) => void;
  onApply?: (search: SavedSearch) => void;
}

export function SavedSearchCard({
  search,
  onEdit,
  onDelete,
  onToggleActive,
  onUpdateFrequency,
  onApply,
}: SavedSearchCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(search);
    }
    setShowDeleteDialog(false);
  };

  const handleToggleActive = () => {
    if (onToggleActive) {
      onToggleActive(search);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(search);
    }
  };

  const lastRunDate = search.last_run
    ? new Date(search.last_run).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : 'Never';

  return (
    <>
      <Card className={cn('transition-opacity', !search.is_active && 'opacity-60')}>
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1 min-w-0">
              <CardTitle className="text-base truncate">{search.name}</CardTitle>
              <CardDescription className="text-sm">
                {formatSearchSummary(search)}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2 ml-2">
              <Switch
                checked={search.is_active}
                onCheckedChange={handleToggleActive}
                aria-label="Toggle active"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit?.(search)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleApply}>
                    <Search className="mr-2 h-4 w-4" />
                    Run Search
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setShowDeleteDialog(true)}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className={cn('text-xs', alertFrequencyColors[search.alert_frequency])}
            >
              {alertFrequencyLabels[search.alert_frequency]}
            </Badge>
            {search.result_count !== undefined && (
              <Badge variant="outline" className="text-xs">
                {search.result_count} results
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>Last run: {lastRunDate}</span>
          </div>
          <Button variant="outline" size="sm" className="w-full" onClick={handleApply}>
            <Search className="mr-2 h-4 w-4" />
            Run This Search
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Saved Search</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{search.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
