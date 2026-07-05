import { FilterState } from '@/types';

export type AlertFrequency = 'none' | 'instant' | 'daily' | 'weekly';

export interface SavedSearch {
  id: string;
  name: string;
  location: string;
  filters: FilterState;
  alert_frequency: AlertFrequency;
  is_active: boolean;
  created_at: Date;
  last_updated: Date;
  last_run?: Date;
  result_count?: number;
}

export const alertFrequencyLabels: Record<AlertFrequency, string> = {
  none: 'No Alerts',
  instant: 'Instant',
  daily: 'Daily Digest',
  weekly: 'Weekly Digest',
};

export const alertFrequencyColors: Record<AlertFrequency, string> = {
  none: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
  instant: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
  daily: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  weekly: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
};

export function formatSearchSummary(savedSearch: SavedSearch): string {
  const parts: string[] = [];

  if (savedSearch.location) {
    parts.push(savedSearch.location);
  }

  const activeFilters = getActiveFilterCount(savedSearch.filters);
  if (activeFilters > 0) {
    parts.push(`${activeFilters} filter${activeFilters > 1 ? 's' : ''} active`);
  }

  return parts.join(' - ') || 'All properties';
}

export function getActiveFilterCount(filters: FilterState): number {
  let count = 0;

  if (filters.propertyType && filters.propertyType.length > 0) count++;
  if (filters.ownerType && filters.ownerType !== 'all') count++;
  if (filters.equity && filters.equity !== 'all') count++;
  if (filters.listingStatus && filters.listingStatus.length > 0) count++;
  if (filters.minValue || filters.maxValue) count++;
  if (filters.minLoanBalance || filters.maxLoanBalance) count++;
  if (filters.minBeds || filters.maxBeds) count++;
  if (filters.minBaths || filters.maxBaths) count++;
  if (filters.minSqft || filters.maxSqft) count++;
  if (filters.minLotSize || filters.maxLotSize) count++;
  if (filters.minYearBuilt || filters.maxYearBuilt) count++;
  if (filters.minDaysOnMarket || filters.maxDaysOnMarket) count++;

  return count;
}

export function formatFilterDetails(filters: FilterState): string[] {
  const details: string[] = [];

  if (filters.propertyType && filters.propertyType.length > 0) {
    details.push(`Property: ${filters.propertyType.join(', ')}`);
  }
  if (filters.ownerType && filters.ownerType !== 'all') {
    const ownerLabels: Record<string, string> = {
      owner_occupied: 'Owner Occupied',
      absentee: 'Absentee Owner',
      tenant_occupied: 'Tenant Occupied',
      corporate: 'Corporate',
    };
    details.push(`Owner: ${ownerLabels[filters.ownerType] || filters.ownerType}`);
  }
  if (filters.equity && filters.equity !== 'all') {
    const equityLabels: Record<string, string> = {
      free_clear: 'Free & Clear',
      high_equity: 'High Equity (50%+)',
      any_equity: 'Any Equity',
    };
    details.push(`Equity: ${equityLabels[filters.equity] || filters.equity}`);
  }
  if (filters.listingStatus && filters.listingStatus.length > 0) {
    details.push(`Status: ${filters.listingStatus.join(', ')}`);
  }
  if (filters.minValue || filters.maxValue) {
    const min = filters.minValue ? `$${(filters.minValue / 1000).toFixed(0)}K` : '';
    const max = filters.maxValue ? `$${(filters.maxValue / 1000).toFixed(0)}K` : '';
    details.push(`Value: ${min}${min && max ? ' - ' : ''}${max}`);
  }

  return details;
}

export const sampleSavedSearches: SavedSearch[] = [
  {
    id: '1',
    name: 'LA Absentee Owners',
    location: 'Los Angeles, CA',
    filters: {
      ownerType: 'absentee',
      propertyType: ['single_family'],
      equity: 'high_equity',
    },
    alert_frequency: 'daily',
    is_active: true,
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    last_updated: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    last_run: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    result_count: 156,
  },
  {
    id: '2',
    name: 'Pre-Foreclosure Properties',
    location: 'Phoenix, AZ',
    filters: {
      listingStatus: ['pre_foreclosure'],
      propertyType: ['single_family', 'multi_family'],
    },
    alert_frequency: 'instant',
    is_active: true,
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    last_updated: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    last_run: new Date(Date.now() - 6 * 60 * 60 * 1000),
    result_count: 42,
  },
  {
    id: '3',
    name: 'High Equity Free & Clear',
    location: 'Houston, TX',
    filters: {
      equity: 'free_clear',
      minValue: 300000,
    },
    alert_frequency: 'weekly',
    is_active: true,
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    last_updated: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    last_run: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    result_count: 89,
  },
  {
    id: '4',
    name: 'Vacant Properties',
    location: 'Atlanta, GA',
    filters: {
      ownerType: 'absentee',
      listingStatus: ['off_market'],
    },
    alert_frequency: 'none',
    is_active: false,
    created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    last_updated: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    last_run: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    result_count: 234,
  },
  {
    id: '5',
    name: 'Multi-Family Opportunities',
    location: 'Dallas, TX',
    filters: {
      propertyType: ['multi_family'],
      minBeds: 4,
      maxValue: 500000,
    },
    alert_frequency: 'daily',
    is_active: true,
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    last_updated: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    last_run: new Date(Date.now() - 12 * 60 * 60 * 1000),
    result_count: 23,
  },
];
