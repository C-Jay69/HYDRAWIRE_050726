'use client';

import { Property } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bed, Bath, Ruler, Building2, User, DollarSign } from 'lucide-react';

interface PropertyPopupProps {
  property: Property;
  onViewDetails?: (property: Property) => void;
  onAddToList?: (property: Property) => void;
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
  multi_family: 'Multi Family',
  condo: 'Condo',
  townhouse: 'Townhouse',
  commercial: 'Commercial',
  land: 'Land',
};

const ownerTypeLabels: Record<Property['owner_type'], string> = {
  absentee: 'Absentee Owner',
  owner_occupied: 'Owner Occupied',
  tenant_occupied: 'Tenant Occupied',
  corporate: 'Corporate Owner',
};

const statusColors: Record<Property['listing_status'], string> = {
  active: 'bg-[#1a56db] text-white',
  off_market: 'bg-[#1a56db] text-white',
  pre_foreclosure: 'bg-[#f97316] text-white',
  foreclosure: 'bg-[#ef4444] text-white',
  auction: 'bg-[#ef4444] text-white',
  reo: 'bg-[#ef4444] text-white',
};

const statusLabels: Record<Property['listing_status'], string> = {
  active: 'Active',
  off_market: 'Off Market',
  pre_foreclosure: 'Pre-Foreclosure',
  foreclosure: 'Foreclosure',
  auction: 'Auction',
  reo: 'REO',
};

export function PropertyPopup({ property, onViewDetails, onAddToList }: PropertyPopupProps) {
  const isVacant = property.listing_status === 'off_market';
  const equityColor = property.equity_percent >= 50 ? 'text-[#10b981]' : 'text-foreground';

  return (
    <div className="w-72 p-3 space-y-3">
      {/* Address */}
      <div className="space-y-1">
        <h3 className="font-semibold text-base leading-tight">{property.address}</h3>
        <p className="text-sm text-muted-foreground">
          {property.city}, {property.state} {property.zip}
        </p>
      </div>

      {/* Badges Row */}
      <div className="flex flex-wrap gap-1.5">
        <Badge variant="secondary" className="text-xs">
          {propertyTypeLabels[property.property_type]}
        </Badge>
        <Badge className={`text-xs ${statusColors[property.listing_status]}`}>
          {statusLabels[property.listing_status]}
        </Badge>
        {isVacant && (
          <Badge className="bg-[#f59e0b] text-white text-xs">Vacant</Badge>
        )}
      </div>

      {/* Estimated Value */}
      <div className="space-y-0.5">
        <p className="text-xs text-muted-foreground">Estimated Value</p>
        <p className="text-xl font-bold text-[#1a56db]">
          {formatCurrency(property.estimated_value)}
        </p>
      </div>

      {/* Equity */}
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-md">
        <DollarSign className="h-4 w-4 text-muted-foreground" />
        <div className="flex-1">
          <p className={`text-sm font-semibold ${equityColor}`}>
            {formatCurrency(property.equity)}
          </p>
          <p className="text-xs text-muted-foreground">
            {property.equity_percent.toFixed(1)}% equity
          </p>
        </div>
        {property.loan_balance === 0 && (
          <Badge className="bg-[#10b981] text-white text-xs">Free & Clear</Badge>
        )}
      </div>

      {/* Owner Type */}
      <div className="flex items-center gap-2 text-sm">
        <User className="h-4 w-4 text-muted-foreground" />
        <span className="text-muted-foreground">
          {ownerTypeLabels[property.owner_type]}
        </span>
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

      {/* Property Type Icon */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Building2 className="h-4 w-4" />
        <span className="capitalize">{property.property_type.replace('_', ' ')}</span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-1">
        <Button
          size="sm"
          className="flex-1 bg-[#1a56db] hover:bg-[#1a56db]/90"
          onClick={() => onViewDetails?.(property)}
        >
          View Details
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onAddToList?.(property)}
        >
          Add to List
        </Button>
      </div>
    </div>
  );
}
