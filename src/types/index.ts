export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  property_type: 'single_family' | 'multi_family' | 'condo' | 'townhouse' | 'commercial' | 'land';
  owner_name: string;
  owner_type: 'absentee' | 'owner_occupied' | 'tenant_occupied' | 'corporate';
  estimated_value: number;
  equity: number;
  equity_percent: number;
  loan_balance: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  latitude: number;
  longitude: number;
  listing_status: 'active' | 'off_market' | 'pre_foreclosure' | 'foreclosure' | 'auction' | 'reo';
  days_on_market?: number;
  last_sale_date?: string;
  lot_size?: number;
  year_built?: number;
  mailing_address?: string;
  subnet?: string;
  sale_price?: number;
  created_at?: string;
}

export interface FilterState {
  propertyType?: string[];
  ownerType?: string;
  equity?: string;
  listingStatus?: string[];
  minValue?: number;
  maxValue?: number;
  minLoanBalance?: number;
  maxLoanBalance?: number;
  minBeds?: number;
  maxBeds?: number;
  minBaths?: number;
  maxBaths?: number;
  minSqft?: number;
  maxSqft?: number;
  minLotSize?: number;
  maxLotSize?: number;
  minYearBuilt?: number;
  maxYearBuilt?: number;
  minDaysOnMarket?: number;
  maxDaysOnMarket?: number;
  minLastSaleDate?: string;
  maxLastSaleDate?: string;
}

export type OccupancyType = 'all' | 'owner_occupied' | 'absentee' | 'tenant_occupied' | 'vacant';
export type EquityType = 'all' | 'free_clear' | 'high_equity' | 'any_equity';

export interface PropertyType {
  id: string;
  label: string;
  value: Property['property_type'];
}

export interface ListingStatusType {
  id: string;
  label: string;
  value: Property['listing_status'];
  color: string;
}
