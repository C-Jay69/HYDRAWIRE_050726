'use client';

import { useState } from 'react';
import { Plus, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ListCard } from '@/components/lists/ListCard';
import { CreateListDialog } from '@/components/lists/CreateListDialog';
import { EditListDialog } from '@/components/lists/EditListDialog';
import { useLeadLists, LeadList } from '@/hooks/useLeadLists';

export default function ListsPage() {
  const { lists, isLoading, deleteList } = useLeadLists();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [listToEdit, setListToEdit] = useState<LeadList | null>(null);
  const [listToDelete, setListToDelete] = useState<LeadList | null>(null);

  const handleEdit = (list: LeadList) => {
    setListToEdit(list);
    setEditDialogOpen(true);
  };

  const handleDelete = (list: LeadList) => {
    setListToDelete(list);
    // Simple confirm delete
    if (confirm(`Are you sure you want to delete "${list.name}"? This action cannot be undone.`)) {
      deleteList(list.id);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-5 w-64" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Lead Lists</h1>
          <p className="text-muted-foreground mt-1">
            Organize and manage your property leads into custom lists
          </p>
        </div>
        <Button onClick={() => setCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New List
        </Button>
      </div>

      {/* Lists Grid or Empty State */}
      {lists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="rounded-full bg-muted p-6 mb-6">
            <List className="h-12 w-12 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No lists yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md">
            Create your first lead list to start organizing properties. You can create lists
            from search results or start with an empty list.
          </p>
          <Button onClick={() => setCreateDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Create Your First List
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lists.map((list) => (
            <ListCard
              key={list.id}
              list={list}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Dialogs */}
      <CreateListDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
      />
      <EditListDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        list={listToEdit}
      />
    </div>
  );
}
