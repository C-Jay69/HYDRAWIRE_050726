import { Property, FilterState } from '@/types';

// US cities with coordinates for realistic demo data
const cities = [
  { city: 'Phoenix', state: 'AZ', lat: 33.4484, lng: -112.0740 },
  { city: 'Dallas', state: 'TX', lat: 32.7767, lng: -96.7970 },
  { city: 'Houston', state: 'TX', lat: 29.7604, lng: -95.3698 },
  { city: 'Atlanta', state: 'GA', lat: 33.7490, lng: -84.3880 },
  { city: 'Miami', state: 'FL', lat: 25.7617, lng: -80.1918 },
  { city: 'Los Angeles', state: 'CA', lat: 34.0522, lng: -118.2437 },
  { city: 'Denver', state: 'CO', lat: 39.7392, lng: -104.9903 },
  { city: 'Seattle', state: 'WA', lat: 47.6062, lng: -122.3321 },
  { city: 'Portland', state: 'OR', lat: 45.5152, lng: -122.6784 },
  { city: 'Chicago', state: 'IL', lat: 41.8781, lng: -87.6298 },
  { city: 'New York', state: 'NY', lat: 40.7128, lng: -74.0060 },
  { city: 'Las Vegas', state: 'NV', lat: 36.1699, lng: -115.1398 },
  { city: 'San Antonio', state: 'TX', lat: 29.4241, lng: -98.4936 },
  { city: 'San Diego', state: 'CA', lat: 32.7157, lng: -117.1611 },
  { city: 'Jacksonville', state: 'FL', lat: 30.3322, lng: -81.6557 },
];

const streetNames = [
  'Oak', 'Maple', 'Cedar', 'Pine', 'Elm', 'Willow', 'Birch', 'Cherry',
  'Main', 'First', 'Second', 'Third', 'Park', 'Lake', 'River', 'Hill',
  'Sunset', 'Highland', 'Valley', 'Forest', 'Meadow', 'Spring', 'Garden',
];

const streetTypes = ['St', 'Ave', 'Blvd', 'Dr', 'Ln', 'Ct', 'Way', 'Pl', 'Rd'];

const firstNames = [
  'James', 'Mary', 'Robert', 'Patricia', 'John', 'Jennifer', 'Michael', 'Linda',
  'David', 'Elizabeth', 'William', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica',
  'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Lisa', 'Daniel', 'Nancy',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis',
  'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson',
  'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Thompson', 'White', 'Harris',
];

const propertyTypes: Property['property_type'][] = [
  'single_family', 'multi_family', 'condo', 'townhouse', 'commercial', 'land'
];

const ownerTypes: Property['owner_type'][] = [
  'absentee', 'owner_occupied', 'tenant_occupied', 'corporate'
];

const listingStatuses: Property['listing_status'][] = [
  'active', 'off_market', 'pre_foreclosure', 'foreclosure', 'auction', 'reo'
];

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min: number, max: number, decimals: number = 2): number {
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimals));
}

function generateProperty(index: number): Property {
  const location = randomElement(cities);
  const streetNumber = randomBetween(100, 9999);
  const streetName = randomElement(streetNames);
  const streetType = randomElement(streetTypes);
  const propertyType = randomElement(propertyTypes);
  const ownerType = randomElement(ownerTypes);
  const listingStatus = randomElement(listingStatuses);

  const estimatedValue = randomBetween(150000, 1500000);
  const sqft = randomBetween(800, 5000);
  const loanBalance = randomBetween(50000, estimatedValue);
  const equity = estimatedValue - loanBalance;
  const equityPercent = (equity / estimatedValue) * 100;

  // Add some randomness to lat/lng based on city center
  const lat = location.lat + randomFloat(-0.1, 0.1, 4);
  const lng = location.lng + randomFloat(-0.1, 0.1, 4);

  const beds = propertyType === 'land' ? 0 : randomBetween(1, 6);
  const baths = propertyType === 'land' ? 0 : randomFloat(1, 4.5, 1);
  const yearBuilt = randomBetween(1950, 2024);
  const lotSize = randomBetween(5000, 50000);

  const daysOnMarket = listingStatus === 'active' ? randomBetween(1, 180) : undefined;
  const lastSaleDate = new Date(
    Date.now() - randomBetween(30, 3650) * 24 * 60 * 60 * 1000
  ).toISOString().split('T')[0];
  const salePrice = randomBetween(80000, 800000);

  const ownerName = ownerType === 'corporate'
    ? `${randomElement(['Acme', 'Prime', 'Atlas', 'Summit', 'Pacific', 'National'])} Holdings LLC`
    : `${randomElement(firstNames)} ${randomElement(lastNames)}`;

  const zip = `${randomBetween(10000, 99999)}`;

  return {
    id: `prop-${String(index).padStart(4, '0')}`,
    address: `${streetNumber} ${streetName} ${streetType}`,
    city: location.city,
    state: location.state,
    zip,
    property_type: propertyType,
    owner_name: ownerName,
    owner_type: ownerType,
    estimated_value: estimatedValue,
    equity,
    equity_percent: equityPercent,
    loan_balance: loanBalance,
    bedrooms: beds,
    bathrooms: baths,
    sqft,
    latitude: lat,
    longitude: lng,
    listing_status: listingStatus,
    days_on_market: daysOnMarket,
    last_sale_date: lastSaleDate,
    lot_size: lotSize,
    year_built: yearBuilt,
    sale_price: salePrice,
  };
}

// Generate 52 demo properties
export const demoProperties: Property[] = Array.from({ length: 52 }, (_, i) => generateProperty(i + 1));

export function filterProperties(properties: Property[], filters: FilterState): Property[] {
  return properties.filter((property) => {
    // Property Type filter
    if (filters.propertyType && filters.propertyType.length > 0) {
      if (!filters.propertyType.includes(property.property_type)) {
        return false;
      }
    }

    // Owner Type filter
    if (filters.ownerType && filters.ownerType !== 'all') {
      if (property.owner_type !== filters.ownerType) {
        return false;
      }
    }

    // Equity filter
    if (filters.equity && filters.equity !== 'all') {
      switch (filters.equity) {
        case 'free_clear':
          if (property.loan_balance > 0) return false;
          break;
        case 'high_equity':
          if (property.equity_percent < 50) return false;
          break;
        case 'any_equity':
          if (property.equity <= 0) return false;
          break;
      }
    }

    // Listing Status filter
    if (filters.listingStatus && filters.listingStatus.length > 0) {
      if (!filters.listingStatus.includes(property.listing_status)) {
        return false;
      }
    }

    // Value Range
    if (filters.minValue && property.estimated_value < filters.minValue) return false;
    if (filters.maxValue && property.estimated_value > filters.maxValue) return false;

    // Loan Balance Range
    if (filters.minLoanBalance && property.loan_balance < filters.minLoanBalance) return false;
    if (filters.maxLoanBalance && property.loan_balance > filters.maxLoanBalance) return false;

    // Beds
    if (filters.minBeds && property.bedrooms < filters.minBeds) return false;
    if (filters.maxBeds && property.bedrooms > filters.maxBeds) return false;

    // Baths
    if (filters.minBaths && property.bathrooms < filters.minBaths) return false;
    if (filters.maxBaths && property.bathrooms > filters.maxBaths) return false;

    // Sqft
    if (filters.minSqft && property.sqft < filters.minSqft) return false;
    if (filters.maxSqft && property.sqft > filters.maxSqft) return false;

    // Lot Size
    if (filters.minLotSize && (property.lot_size || 0) < filters.minLotSize) return false;
    if (filters.maxLotSize && (property.lot_size || Infinity) > filters.maxLotSize) return false;

    // Year Built
    if (filters.minYearBuilt && (property.year_built || 0) < filters.minYearBuilt) return false;
    if (filters.maxYearBuilt && (property.year_built || Infinity) > filters.maxYearBuilt) return false;

    // Days on Market
    if (filters.minDaysOnMarket && (property.days_on_market || 0) < filters.minDaysOnMarket) return false;
    if (filters.maxDaysOnMarket && (property.days_on_market || Infinity) > filters.maxDaysOnMarket) return false;

    return true;
  });
}

export const defaultFilters: FilterState = {
  propertyType: [],
  ownerType: 'all',
  equity: 'all',
  listingStatus: [],
};
