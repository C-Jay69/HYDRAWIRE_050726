'use client';

import { useState } from 'react';
import { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Bed, Bath, Ruler, Eye, Heart, ListPlus, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyListProps {
  properties: Property[];
  onPropertySelect?: (property: Property) => void;
  onViewDetails?: (property: Property) => void;
  onAddToList?: (property: Property) => void;
  onSaveProperty?: (property: Property) => void;
  savedProperties?: Set<string>;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const propertyTypeLabels: Record<Property['property_type'], string> = {
  single_family: 'Single Family',
  multi_family: 'Multi-Family',
  condo: 'Condo',
  townhouse: 'Townhouse',
  commercial: 'Commercial',
  land: 'Land',
};

const ownerTypeColors: Record<Property['owner_type'], string> = {
  absentee: 'bg-[#f59e0b] text-white',
  owner_occupied: 'bg-[#10b981] text-white',
  tenant_occupied: 'bg-[#1a56db] text-white',
  corporate: 'bg-purple-500 text-white',
};

const ownerTypeLabels: Record<Property['owner_type'], string> = {
  absentee: 'Absentee',
  owner_occupied: 'Owner',
  tenant_occupied: 'Tenant',
  corporate: 'Corporate',
};

const statusColors: Record<Property['listing_status'], string> = {
  active: 'bg-[#1a56db] text-white',
  off_market: 'bg-slate-500 text-white',
  pre_foreclosure: 'bg-[#f97316] text-white',
  foreclosure: 'bg-[#ef4444] text-white',
  auction: 'bg-[#ef4444] text-white',
  reo: 'bg-[#ef4444] text-white',
};

const ITEMS_PER_PAGE = 10;

type SortOption = 'value_desc' | 'value_asc' | 'equity_desc' | 'equity_asc' | 'date_desc';

export function PropertyList({
  properties,
  onPropertySelect,
  onViewDetails,
  onAddToList,
  onSaveProperty,
  savedProperties = new Set(),
}: PropertyListProps) {
  const [sortBy, setSortBy] = useState<SortOption>('value_desc');
  const [currentPage, setCurrentPage] = useState(1);

  // Sort properties
  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case 'value_desc':
        return b.estimated_value - a.estimated_value;
      case 'value_asc':
        return a.estimated_value - b.estimated_value;
      case 'equity_desc':
        return b.equity - a.equity;
      case 'equity_asc':
        return a.equity - b.equity;
      case 'date_desc':
        return new Date(b.last_sale_date || 0).getTime() - new Date(a.last_sale_date || 0).getTime();
      default:
        return 0;
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProperties.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProperties = sortedProperties.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setCurrentPage(1);
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground whitespace-nowrap">
          {properties.length} {properties.length === 1 ? 'property' : 'properties'}
        </p>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="value_desc">Value: High to Low</SelectItem>
            <SelectItem value="value_asc">Value: Low to High</SelectItem>
            <SelectItem value="equity_desc">Equity: High to Low</SelectItem>
            <SelectItem value="equity_asc">Equity: Low to High</SelectItem>
            <SelectItem value="date_desc">Last Sale: Newest</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {paginatedProperties.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <p className="text-muted-foreground">No properties match your filters</p>
          </div>
        ) : (
          <div className="divide-y">
            {paginatedProperties.map((property) => (
              <div
                key={property.id}
                className="p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => onPropertySelect?.(property)}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Main Info */}
                  <div className="flex-1 min-w-0">
                    {/* Address */}
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{property.address}</h3>
                      {savedProperties.has(property.id) && (
                        <Heart className="h-4 w-4 fill-[#ef4444] text-[#ef4444] flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {property.city}, {property.state} {property.zip}
                    </p>

                    {/* Value & Equity */}
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-lg font-bold text-[#1a56db]">
                        {formatCurrency(property.estimated_value)}
                      </span>
                      <span className="text-sm text-[#10b981]">
                        {formatCurrency(property.equity)} ({property.equity_percent.toFixed(0)}% equity)
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {propertyTypeLabels[property.property_type]}
                      </Badge>
                      <Badge className={cn('text-xs', statusColors[property.listing_status])}>
                        {property.listing_status.replace('_', '-')}
                      </Badge>
                      <Badge className={cn('text-xs', ownerTypeColors[property.owner_type])}>
                        {ownerTypeLabels[property.owner_type]}
                      </Badge>
                    </div>

                    {/* Property Details */}
                    {property.property_type !== 'land' && (
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        {property.bedrooms > 0 && (
                          <div className="flex items-center gap-1">
                            <Bed className="h-4 w-4" />
                            <span>{property.bedrooms}</span>
                          </div>
                        )}
                        {property.bathrooms > 0 && (
                          <div className="flex items-center gap-1">
                            <Bath className="h-4 w-4" />
                            <span>{property.bathrooms}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Ruler className="h-4 w-4" />
                          <span>{property.sqft.toLocaleString()} sqft</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-muted-foreground hover:text-[#1a56db]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewDetails?.(property);
                      }}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className={cn(
                        'h-8 px-2',
                        savedProperties.has(property.id)
                          ? 'text-[#ef4444]'
                          : 'text-muted-foreground hover:text-[#ef4444]'
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onSaveProperty?.(property);
                      }}
                    >
                      <Heart className={cn('h-4 w-4', savedProperties.has(property.id) && 'fill-current')} />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 px-2 text-muted-foreground hover:text-[#1a56db]"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToList?.(property);
                      }}
                    >
                      <ListPlus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-4 border-t">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </PaginationItem>
              <div className="flex items-center gap-2 px-2 text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <PaginationItem>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
