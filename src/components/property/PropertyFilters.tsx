'use client';

import { useState } from 'react';
import { FilterState, Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Filter, X, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PropertyFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  resultCount: number;
}

const propertyTypes = [
  { id: 'single_family', label: 'Single Family' },
  { id: 'multi_family', label: 'Multi-Family' },
  { id: 'condo', label: 'Condo' },
  { id: 'townhouse', label: 'Townhouse' },
  { id: 'commercial', label: 'Commercial' },
  { id: 'land', label: 'Land' },
];

const ownerTypes = [
  { id: 'all', label: 'All' },
  { id: 'owner_occupied', label: 'Owner-Occupied' },
  { id: 'absentee', label: 'Absentee Owner' },
  { id: 'tenant_occupied', label: 'Tenant-Occupied' },
  { id: 'vacant', label: 'Vacant' },
];

const equityTypes = [
  { id: 'all', label: 'All' },
  { id: 'free_clear', label: 'Free & Clear' },
  { id: 'high_equity', label: 'High Equity (50%+)' },
  { id: 'any_equity', label: 'Any Equity' },
];

const listingStatuses = [
  { id: 'active', label: 'Active' },
  { id: 'off_market', label: 'Off-Market' },
  { id: 'pre_foreclosure', label: 'Pre-Foreclosure' },
  { id: 'foreclosure', label: 'Foreclosure' },
  { id: 'auction', label: 'Auction' },
  { id: 'reo', label: 'REO' },
];

export function PropertyFilters({ filters, onFiltersChange, resultCount }: PropertyFiltersProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    propertyType: true,
    occupancy: true,
    equity: true,
    status: true,
    value: false,
    loanBalance: false,
    physical: false,
    market: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handlePropertyTypeChange = (typeId: string, checked: boolean) => {
    const current = filters.propertyType || [];
    const updated = checked
      ? [...current, typeId]
      : current.filter((t) => t !== typeId);
    onFiltersChange({ ...filters, propertyType: updated });
  };

  const handleListingStatusChange = (statusId: string, checked: boolean) => {
    const current = filters.listingStatus || [];
    const updated = checked
      ? [...current, statusId]
      : current.filter((s) => s !== statusId);
    onFiltersChange({ ...filters, listingStatus: updated });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      propertyType: [],
      ownerType: 'all',
      equity: 'all',
      listingStatus: [],
    });
  };

  const hasActiveFilters =
    (filters.propertyType && filters.propertyType.length > 0) ||
    filters.ownerType !== 'all' ||
    filters.equity !== 'all' ||
    (filters.listingStatus && filters.listingStatus.length > 0) ||
    filters.minValue ||
    filters.maxValue ||
    filters.minLoanBalance ||
    filters.maxLoanBalance ||
    filters.minBeds ||
    filters.maxBeds ||
    filters.minBaths ||
    filters.maxBaths ||
    filters.minSqft ||
    filters.maxSqft ||
    filters.minLotSize ||
    filters.maxLotSize ||
    filters.minYearBuilt ||
    filters.maxYearBuilt;

  const activeFilterCount =
    (filters.propertyType?.length || 0) +
    (filters.ownerType !== 'all' ? 1 : 0) +
    (filters.equity !== 'all' ? 1 : 0) +
    (filters.listingStatus?.length || 0) +
    (filters.minValue ? 1 : 0) +
    (filters.maxValue ? 1 : 0) +
    (filters.minLoanBalance ? 1 : 0) +
    (filters.maxLoanBalance ? 1 : 0) +
    (filters.minBeds ? 1 : 0) +
    (filters.maxBeds ? 1 : 0) +
    (filters.minBaths ? 1 : 0) +
    (filters.maxBaths ? 1 : 0) +
    (filters.minSqft ? 1 : 0) +
    (filters.maxSqft ? 1 : 0);

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="font-semibold">Filters</h2>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-muted-foreground">
            <RotateCcw className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="px-4 py-3 border-b bg-muted/30">
        <p className="text-sm">
          <span className="font-semibold text-[#1a56db]">{resultCount}</span>{' '}
          {resultCount === 1 ? 'property' : 'properties'} found
        </p>
      </div>

      {/* Filter Sections */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Property Type */}
        <Collapsible open={openSections.propertyType} onOpenChange={() => toggleSection('propertyType')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium hover:text-[#1a56db] transition-colors">
            Property Type
            {openSections.propertyType ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {propertyTypes.map((type) => (
              <div key={type.id} className="flex items-center gap-2">
                <Checkbox
                  id={`type-${type.id}`}
                  checked={filters.propertyType?.includes(type.id) || false}
                  onCheckedChange={(checked) => handlePropertyTypeChange(type.id, checked as boolean)}
                />
                <Label htmlFor={`type-${type.id}`} className="text-sm cursor-pointer">
                  {type.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Occupancy */}
        <Collapsible open={openSections.occupancy} onOpenChange={() => toggleSection('occupancy')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium hover:text-[#1a56db] transition-colors">
            Occupancy
            {openSections.occupancy ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <RadioGroup
              value={filters.ownerType || 'all'}
              onValueChange={(value) => onFiltersChange({ ...filters, ownerType: value })}
            >
              {ownerTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-2">
                  <RadioGroupItem value={type.id} id={`owner-${type.id}`} />
                  <Label htmlFor={`owner-${type.id}`} className="text-sm cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Equity */}
        <Collapsible open={openSections.equity} onOpenChange={() => toggleSection('equity')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium hover:text-[#1a56db] transition-colors">
            Equity
            {openSections.equity ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-2">
            <RadioGroup
              value={filters.equity || 'all'}
              onValueChange={(value) => onFiltersChange({ ...filters, equity: value })}
            >
              {equityTypes.map((type) => (
                <div key={type.id} className="flex items-center gap-2">
                  <RadioGroupItem value={type.id} id={`equity-${type.id}`} />
                  <Label htmlFor={`equity-${type.id}`} className="text-sm cursor-pointer">
                    {type.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CollapsibleContent>
        </Collapsible>

        {/* Status */}
        <Collapsible open={openSections.status} onOpenChange={() => toggleSection('status')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium hover:text-[#1a56db] transition-colors">
            Listing Status
            {openSections.status ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-2 pt-2">
            {listingStatuses.map((status) => (
              <div key={status.id} className="flex items-center gap-2">
                <Checkbox
                  id={`status-${status.id}`}
                  checked={filters.listingStatus?.includes(status.id) || false}
                  onCheckedChange={(checked) => handleListingStatusChange(status.id, checked as boolean)}
                />
                <Label htmlFor={`status-${status.id}`} className="text-sm cursor-pointer">
                  {status.label}
                </Label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Value Range */}
        <Collapsible open={openSections.value} onOpenChange={() => toggleSection('value')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium hover:text-[#1a56db] transition-colors">
            Estimated Value
            {openSections.value ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  placeholder="$0"
                  value={filters.minValue || ''}
                  onChange={(e) => onFiltersChange({ ...filters, minValue: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  placeholder="No max"
                  value={filters.maxValue || ''}
                  onChange={(e) => onFiltersChange({ ...filters, maxValue: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Loan Balance */}
        <Collapsible open={openSections.loanBalance} onOpenChange={() => toggleSection('loanBalance')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium hover:text-[#1a56db] transition-colors">
            Loan Balance
            {openSections.loanBalance ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs text-muted-foreground">Min</Label>
                <Input
                  type="number"
                  placeholder="$0"
                  value={filters.minLoanBalance || ''}
                  onChange={(e) => onFiltersChange({ ...filters, minLoanBalance: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max</Label>
                <Input
                  type="number"
                  placeholder="No max"
                  value={filters.maxLoanBalance || ''}
                  onChange={(e) => onFiltersChange({ ...filters, maxLoanBalance: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Physical */}
        <Collapsible open={openSections.physical} onOpenChange={() => toggleSection('physical')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium hover:text-[#1a56db] transition-colors">
            Physical Details
            {openSections.physical ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Beds (min)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.minBeds || ''}
                  onChange={(e) => onFiltersChange({ ...filters, minBeds: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Beds (max)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.maxBeds || ''}
                  onChange={(e) => onFiltersChange({ ...filters, maxBeds: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Baths (min)</Label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="Any"
                  value={filters.minBaths || ''}
                  onChange={(e) => onFiltersChange({ ...filters, minBaths: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Baths (max)</Label>
                <Input
                  type="number"
                  step="0.5"
                  placeholder="Any"
                  value={filters.maxBaths || ''}
                  onChange={(e) => onFiltersChange({ ...filters, maxBaths: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Sqft (min)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.minSqft || ''}
                  onChange={(e) => onFiltersChange({ ...filters, minSqft: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Sqft (max)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.maxSqft || ''}
                  onChange={(e) => onFiltersChange({ ...filters, maxSqft: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Lot (min)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.minLotSize || ''}
                  onChange={(e) => onFiltersChange({ ...filters, minLotSize: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Lot (max)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.maxLotSize || ''}
                  onChange={(e) => onFiltersChange({ ...filters, maxLotSize: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Year Built (min)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.minYearBuilt || ''}
                  onChange={(e) => onFiltersChange({ ...filters, minYearBuilt: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Year Built (max)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.maxYearBuilt || ''}
                  onChange={(e) => onFiltersChange({ ...filters, maxYearBuilt: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Market */}
        <Collapsible open={openSections.market} onOpenChange={() => toggleSection('market')}>
          <CollapsibleTrigger className="flex items-center justify-between w-full py-2 font-medium hover:text-[#1a56db] transition-colors">
            Market Activity
            {openSections.market ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 pt-2">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Days on Market (min)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.minDaysOnMarket || ''}
                  onChange={(e) => onFiltersChange({ ...filters, minDaysOnMarket: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Days on Market (max)</Label>
                <Input
                  type="number"
                  placeholder="Any"
                  value={filters.maxDaysOnMarket || ''}
                  onChange={(e) => onFiltersChange({ ...filters, maxDaysOnMarket: e.target.value ? Number(e.target.value) : undefined })}
                  className="h-9"
                />
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </div>
  );
}
