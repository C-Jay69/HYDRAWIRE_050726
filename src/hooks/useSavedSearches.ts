'use client';

import { useState, useCallback, useEffect } from 'react';
import { SavedSearch, AlertFrequency } from '@/lib/alerts';
import { FilterState } from '@/types';
import { getSavedSearches, saveSearch, deleteSavedSearch, updateSavedSearch } from '@/lib/supabase-leads';

export interface SavedSearchInput {
  name: string;
  location: string;
  filters: FilterState;
  alert_frequency: AlertFrequency;
}

export function useSavedSearches() {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSearches = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getSavedSearches();
      setSavedSearches(data as SavedSearch[]);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSearches();
  }, [fetchSearches]);

  const createSavedSearch = useCallback(async (input: SavedSearchInput): Promise<SavedSearch> => {
    setIsLoading(true);
    try {
      const newSearch = await saveSearch({
        name: input.name,
        location: input.location,
        filters: input.filters,
        alert_frequency: input.alert_frequency,
      });
      setSavedSearches((prev) => [newSearch as SavedSearch, ...prev]);
      return newSearch as SavedSearch;
    } catch (error) {
      console.error('Error creating saved search:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateSavedSearch = useCallback(async (id: string, updates: Partial<SavedSearch>): Promise<void> => {
    setIsLoading(true);
    try {
      await updateSavedSearch(id, updates);
      setSavedSearches((prev) =>
        prev.map((search) =>
          search.id === id
            ? { ...search, ...updates }
            : search
        )
      );
    } catch (error) {
      console.error('Error updating saved search:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteSavedSearch = useCallback(async (id: string): Promise<void> => {
    setIsLoading(true);
    try {
      await deleteSavedSearch(id);
      setSavedSearches((prev) => prev.filter((search) => search.id !== id));
    } catch (error) {
      console.error('Error deleting saved search:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const toggleActive = useCallback(async (id: string): Promise<void> => {
    const search = savedSearches.find(s => s.id === id);
    if (!search) return;

    await updateSavedSearch(id, { is_active: !search.is_active });
    setSavedSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, is_active: !s.is_active } : s))
    );
  }, [savedSearches]);

  const updateAlertFrequency = useCallback(async (id: string, frequency: AlertFrequency): Promise<void> => {
    await updateSavedSearch(id, { alert_frequency: frequency });
    setSavedSearches((prev) =>
      prev.map((s) => (s.id === id ? { ...s, alert_frequency: frequency } : s))
    );
  }, []);

  const getActiveSearches = useCallback((): SavedSearch[] => {
    return savedSearches.filter((search) => search.is_active);
  }, [savedSearches]);

  return {
    savedSearches,
    isLoading,
    createSavedSearch,
    updateSavedSearch,
    deleteSavedSearch,
    toggleActive,
    updateAlertFrequency,
    getActiveSearches,
  };
}
