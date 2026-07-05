'use client';

import { useState } from 'react';
import { Bell, Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { SavedSearchCard } from '@/components/alerts/SavedSearchCard';
import { SaveSearchDialog } from '@/components/alerts/SaveSearchDialog';
import { AlertSettings } from '@/components/alerts/AlertSettings';
import { useSavedSearches } from '@/hooks/useSavedSearches';
import { SavedSearch, AlertFrequency, sampleSavedSearches } from '@/lib/alerts';
import { FilterState } from '@/types';

export default function AlertsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const {
    savedSearches,
    isLoading,
    createSavedSearch,
    updateSavedSearch,
    deleteSavedSearch,
    toggleActive,
  } = useSavedSearches();

  // Demo filters for save dialog
  const demoFilters: FilterState = {
    propertyType: ['single_family'],
    ownerType: 'absentee',
    equity: 'high_equity',
    listingStatus: [],
    minValue: 100000,
    maxValue: 500000,
  };

  const filteredSearches = savedSearches.filter((search) =>
    search.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    search.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeSearches = filteredSearches.filter((s) => s.is_active);
  const inactiveSearches = filteredSearches.filter((s) => !s.is_active);

  const handleCreateNew = () => {
    setShowSaveDialog(true);
  };

  const handleSaveSearch = async (name: string, alertFrequency: AlertFrequency) => {
    await createSavedSearch({
      name,
      location: 'Los Angeles, CA',
      filters: demoFilters,
      alert_frequency: alertFrequency,
    });
    setShowSaveDialog(false);
  };

  const handleEditSearch = (search: SavedSearch) => {
    // In a real app, this would open an edit dialog
    console.log('Edit search:', search);
  };

  const handleDeleteSearch = async (search: SavedSearch) => {
    await deleteSavedSearch(search.id);
  };

  const handleToggleActive = async (search: SavedSearch) => {
    await toggleActive(search.id);
  };

  const handleApplySearch = (search: SavedSearch) => {
    // Navigate to search page with filters
    console.log('Apply search:', search);
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Bell className="h-8 w-8" />
            Saved Searches & Alerts
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your saved searches and notification preferences
          </p>
        </div>
        <Button onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Search
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{savedSearches.length}</div>
            <p className="text-sm text-muted-foreground">Total Searches</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{activeSearches.length}</div>
            <p className="text-sm text-muted-foreground">Active</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {savedSearches.filter((s) => s.alert_frequency !== 'none').length}
            </div>
            <p className="text-sm text-muted-foreground">With Alerts</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">
              {savedSearches.reduce((sum, s) => sum + (s.result_count || 0), 0).toLocaleString()}
            </div>
            <p className="text-sm text-muted-foreground">Total Matches</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="searches" className="space-y-6">
        <TabsList>
          <TabsTrigger value="searches">Saved Searches</TabsTrigger>
          <TabsTrigger value="settings">Alert Settings</TabsTrigger>
        </TabsList>

        {/* Saved Searches Tab */}
        <TabsContent value="searches" className="space-y-6">
          {/* Search Input */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search saved searches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Badge variant="secondary">
              {filteredSearches.length} search{filteredSearches.length !== 1 ? 'es' : ''}
            </Badge>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {/* Active Searches */}
          {!isLoading && activeSearches.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold">Active Searches</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeSearches.map((search) => (
                  <SavedSearchCard
                    key={search.id}
                    search={search}
                    onEdit={handleEditSearch}
                    onDelete={handleDeleteSearch}
                    onToggleActive={handleToggleActive}
                    onApply={handleApplySearch}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Inactive Searches */}
          {!isLoading && inactiveSearches.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-muted-foreground">Inactive Searches</h2>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {inactiveSearches.map((search) => (
                  <SavedSearchCard
                    key={search.id}
                    search={search}
                    onEdit={handleEditSearch}
                    onDelete={handleDeleteSearch}
                    onToggleActive={handleToggleActive}
                    onApply={handleApplySearch}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && filteredSearches.length === 0 && (
            <Card className="py-12">
              <CardContent className="text-center">
                <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No saved searches found</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? 'Try adjusting your search query'
                    : 'Create your first saved search to get started'}
                </p>
                <Button onClick={handleCreateNew}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create New Search
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Alert Settings Tab */}
        <TabsContent value="settings">
          <AlertSettings />
        </TabsContent>
      </Tabs>

      {/* Save Search Dialog */}
      <SaveSearchDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        filters={demoFilters}
        location="Los Angeles, CA"
        onSave={handleSaveSearch}
        isLoading={isLoading}
      />
    </div>
  );
}
