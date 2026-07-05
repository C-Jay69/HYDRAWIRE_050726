'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Edit2, Trash2, Download, Plus, BarChart3, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
import { ListTable } from '@/components/lists/ListTable';
import { BulkActionsToolbar } from '@/components/lists/BulkActionsToolbar';
import { ExportDialog } from '@/components/lists/ExportDialog';
import { EditListDialog } from '@/components/lists/EditListDialog';
import { CreateListDialog } from '@/components/lists/CreateListDialog';
import { useLeadLists, PropertyStatus } from '@/hooks/useLeadLists';
import { cn } from '@/lib/utils';

const STATUS_TABS: { value: PropertyStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'interested', label: 'Interested' },
  { value: 'skip', label: 'Skip' },
  { value: 'converted', label: 'Converted' },
];

export default function ListDetailPage() {
  const params = useParams();
  const router = useRouter();
  const listId = params.id as string;

  const {
    getListById,
    setCurrentListById,
    currentList,
    selectedProperties,
    isLoading,
    togglePropertySelection,
    selectAllProperties,
    clearSelection,
    updatePropertyStatus,
    removePropertyFromList,
    updateList,
    deleteList,
    getListStats,
    addPropertiesToList,
  } = useLeadLists();

  const [activeTab, setActiveTab] = useState<PropertyStatus | 'all'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addPropertiesDialogOpen, setAddPropertiesDialogOpen] = useState(false);

  // Load list on mount
  useEffect(() => {
    setCurrentListById(listId);
  }, [listId, setCurrentListById]);

  // Reset pagination when tab changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const stats = currentList ? getListStats(listId) : null;

  const handleDelete = () => {
    deleteList(listId);
    router.push('/lists');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center gap-4 mb-8">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-64" />
        </div>
        <Skeleton className="h-24 mb-6" />
        <Skeleton className="h-12 mb-6" />
        <Skeleton className="h-[400px]" />
      </div>
    );
  }

  if (!currentList) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={() => router.push('/lists')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Lists
        </Button>
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <h2 className="text-xl font-semibold mb-2">List not found</h2>
          <p className="text-muted-foreground mb-6">
            This list may have been deleted or does not exist.
          </p>
          <Button onClick={() => router.push('/lists')}>Go to Lists</Button>
        </div>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex items-center gap-4 mb-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/lists')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{currentList.name}</h1>
          {currentList.description && (
            <p className="text-muted-foreground mt-1">{currentList.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setAddPropertiesDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Properties
          </Button>
          <Button variant="outline" onClick={() => setExportDialogOpen(true)}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" onClick={() => setEditDialogOpen(true)}>
            <Edit2 className="mr-2 h-4 w-4" />
            Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialogOpen(true)}>
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </Button>
        </div>
      </div>

      {/* Meta info */}
      <div className="text-sm text-muted-foreground mb-6">
        Created {formatDate(currentList.createdAt)} · Updated {formatDate(currentList.updatedAt)}
      </div>

      {/* Stats Row */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <BarChart3 className="h-4 w-4" />
              <span className="text-sm">Total Properties</span>
            </div>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-1">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="text-sm">New</span>
            </div>
            <p className="text-2xl font-bold">{stats.total - stats.contacted - stats.interested - stats.skipped - stats.converted}</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-600 dark:text-yellow-400 mb-1">
              <Phone className="h-4 w-4" />
              <span className="text-sm">Contacted</span>
            </div>
            <p className="text-2xl font-bold">{stats.contacted}</p>
          </div>
          <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
              <Mail className="h-4 w-4" />
              <span className="text-sm">Interested</span>
            </div>
            <p className="text-2xl font-bold">{stats.interested}</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-1">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Converted</span>
            </div>
            <p className="text-2xl font-bold">{stats.converted}</p>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as PropertyStatus | 'all')} className="mb-6">
        <TabsList>
          {STATUS_TABS.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
              {tab.value !== 'all' && stats && (
                <Badge variant="secondary" className="ml-2 h-5 px-1.5">
                  {tab.value === 'new'
                    ? stats.total - stats.contacted - stats.interested - stats.skipped - stats.converted
                    : stats[tab.value as keyof typeof stats] || 0}
                </Badge>
              )}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Properties Table */}
      <ListTable
        properties={currentList.properties}
        selectedIds={selectedProperties}
        onToggleSelect={togglePropertySelection}
        onSelectAll={selectAllProperties}
        onClearSelection={clearSelection}
        onStatusChange={(propertyId, status) => updatePropertyStatus(listId, propertyId, status)}
        onRemove={(propertyId) => removePropertyFromList(listId, propertyId)}
        statusFilter={activeTab}
        currentPage={currentPage}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setCurrentPage(1);
        }}
      />

      {/* Bulk Actions Toolbar */}
      <BulkActionsToolbar
        listId={listId}
        selectedCount={selectedProperties.size}
        onExportSelected={() => setExportDialogOpen(true)}
        onClearSelection={clearSelection}
      />

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete List</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{currentList.name}"? This action cannot be
              undone and all properties in this list will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Export Dialog */}
      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        listId={listId}
        selectedCount={selectedProperties.size}
      />

      {/* Edit Dialog */}
      <EditListDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        list={currentList}
      />

      {/* Add Properties Dialog - Simplified for demo */}
      <CreateListDialog
        open={addPropertiesDialogOpen}
        onOpenChange={setAddPropertiesDialogOpen}
      />
    </div>
  );
}
