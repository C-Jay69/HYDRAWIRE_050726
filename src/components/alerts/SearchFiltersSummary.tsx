'use client';

import { X, MapPin, Home, User, DollarSign, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FilterState } from '@/types';
import { cn } from '@/lib/utils';

interface SearchFiltersSummaryProps {
  filters: FilterState;
  location?: string;
  onFilterClick?: (filterKey: keyof FilterState) => void;
  onLocationClick?: () => void;
  onRemoveFilter?: (filterKey: keyof FilterState) => void;
  className?: string;
}

const propertyTypeLabels: Record<string, string> = {
  single_family: 'Single Family',
  multi_family: 'Multi Family',
  condo: 'Condo',
  townhouse: 'Townhouse',
  commercial: 'Commercial',
  land: 'Land',
};

const ownerTypeLabels: Record<string, string> = {
  owner_occupied: 'Owner Occupied',
  absentee: 'Absentee Owner',
  tenant_occupied: 'Tenant Occupied',
  corporate: 'Corporate',
};

const equityLabels: Record<string, string> = {
  free_clear: 'Free & Clear',
  high_equity: 'High Equity',
  any_equity: 'Any Equity',
};

const listingStatusLabels: Record<string, string> = {
  active: 'Active',
  off_market: 'Off Market',
  pre_foreclosure: 'Pre-Foreclosure',
  foreclosure: 'Foreclosure',
  auction: 'Auction',
  reo: 'REO',
};

export function SearchFiltersSummary({
  filters,
  location,
  onFilterClick,
  onLocationClick,
  onRemoveFilter,
  className,
}: SearchFiltersSummaryProps) {
  const hasFilters =
    (location && onLocationClick) ||
    (filters.propertyType && filters.propertyType.length > 0) ||
    (filters.ownerType && filters.ownerType !== 'all') ||
    (filters.equity && filters.equity !== 'all') ||
    (filters.listingStatus && filters.listingStatus.length > 0) ||
    filters.minValue ||
    filters.maxValue ||
    filters.minBeds ||
    filters.maxBeds ||
    filters.minBaths ||
    filters.maxBaths ||
    filters.minSqft ||
    filters.maxSqft;

  if (!hasFilters) {
    return null;
  }

  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {/* Location */}
      {location && onLocationClick && (
        <Badge
          variant="outline"
          className="gap-1 pl-2 pr-1 py-1.5 cursor-pointer hover:bg-muted"
          onClick={onLocationClick}
        >
          <MapPin className="h-3 w-3 text-primary" />
          {location}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFilter?.('location' as keyof FilterState);
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Property Type */}
      {filters.propertyType && filters.propertyType.length > 0 && (
        <Badge
          variant="outline"
          className="gap-1 pl-2 pr-1 py-1.5 cursor-pointer hover:bg-muted"
          onClick={() => onFilterClick?.('propertyType')}
        >
          <Home className="h-3 w-3 text-primary" />
          {filters.propertyType.map((type) => propertyTypeLabels[type] || type).join(', ')}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFilter?.('propertyType');
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Owner Type */}
      {filters.ownerType && filters.ownerType !== 'all' && (
        <Badge
          variant="outline"
          className="gap-1 pl-2 pr-1 py-1.5 cursor-pointer hover:bg-muted"
          onClick={() => onFilterClick?.('ownerType')}
        >
          <User className="h-3 w-3 text-primary" />
          {ownerTypeLabels[filters.ownerType] || filters.ownerType}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFilter?.('ownerType');
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Equity */}
      {filters.equity && filters.equity !== 'all' && (
        <Badge
          variant="outline"
          className="gap-1 pl-2 pr-1 py-1.5 cursor-pointer hover:bg-muted"
          onClick={() => onFilterClick?.('equity')}
        >
          <DollarSign className="h-3 w-3 text-primary" />
          {equityLabels[filters.equity] || filters.equity}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFilter?.('equity');
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Listing Status */}
      {filters.listingStatus && filters.listingStatus.length > 0 && (
        <Badge
          variant="outline"
          className="gap-1 pl-2 pr-1 py-1.5 cursor-pointer hover:bg-muted"
          onClick={() => onFilterClick?.('listingStatus')}
        >
          <Layers className="h-3 w-3 text-primary" />
          {filters.listingStatus.map((status) => listingStatusLabels[status] || status).join(', ')}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFilter?.('listingStatus');
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Value Range */}
      {(filters.minValue || filters.maxValue) && (
        <Badge
          variant="outline"
          className="gap-1 pl-2 pr-1 py-1.5 cursor-pointer hover:bg-muted"
          onClick={() => onFilterClick?.('minValue')}
        >
          <DollarSign className="h-3 w-3 text-primary" />
          {filters.minValue && `$${(filters.minValue / 1000).toFixed(0)}K`}
          {filters.minValue && filters.maxValue && ' - '}
          {filters.maxValue && `$${(filters.maxValue / 1000).toFixed(0)}K`}
          <Button
            variant="ghost"
            size="icon"
            className="h-4 w-4 ml-1 p-0"
            onClick={(e) => {
              e.stopPropagation();
              onRemoveFilter?.('minValue');
              onRemoveFilter?.('maxValue');
            }}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      )}

      {/* Beds */}
      {(filters.minBeds || filters.maxBeds) && (
        <Badge
          variant="outline"
          className="gap-1 pl-2 pr-1 py-1.5"
        >
          <span className="text-primary font-medium">Beds:</span>
          {filters.minBeds || '0'} - {filters.maxBeds || 'any'}
        </Badge>
      )}

      {/* Baths */}
      {(filters.minBaths || filters.maxBaths) && (
        <Badge
          variant="outline"
          className="gap-1 pl-2 pr-1 py-1.5"
        >
          <span className="text-primary font-medium">Baths:</span>
          {filters.minBaths || '0'} - {filters.maxBaths || 'any'}
        </Badge>
      )}
    </div>
  );
}
