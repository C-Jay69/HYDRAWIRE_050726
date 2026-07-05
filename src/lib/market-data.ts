export interface PriceTrendData {
  month: string;
  price: number;
  listings: number;
}

export interface MarketMetrics {
  medianPrice: number;
  avgDaysOnMarket: number;
  listToSaleRatio: number;
  inventory: number;
  foreclosureRate: number;
  priceChange: number;
  daysChange: number;
  inventoryChange: number;
  foreclosureChange: number;
}

export interface HotMarket {
  rank: number;
  location: string;
  state: string;
  value: number;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

export interface CityData {
  name: string;
  state: string;
  median_price: number;
  days_on_market: number;
  list_to_sale_ratio: number;
  inventory: number;
  foreclosure_rate: number;
  price_change_12m: number;
  total_listings: number;
}

export const marketData: Record<string, CityData> = {
  'los-angeles': {
    name: 'Los Angeles',
    state: 'CA',
    median_price: 850000,
    days_on_market: 35,
    list_to_sale_ratio: 98.5,
    inventory: 4.2,
    foreclosure_rate: 0.8,
    price_change_12m: 5.2,
    total_listings: 12450,
  },
  'houston': {
    name: 'Houston',
    state: 'TX',
    median_price: 375000,
    days_on_market: 42,
    list_to_sale_ratio: 97.2,
    inventory: 5.8,
    foreclosure_rate: 1.2,
    price_change_12m: 3.8,
    total_listings: 18720,
  },
  'phoenix': {
    name: 'Phoenix',
    state: 'AZ',
    median_price: 425000,
    days_on_market: 28,
    list_to_sale_ratio: 99.1,
    inventory: 3.1,
    foreclosure_rate: 0.5,
    price_change_12m: 7.1,
    total_listings: 9820,
  },
  'miami': {
    name: 'Miami',
    state: 'FL',
    median_price: 580000,
    days_on_market: 52,
    list_to_sale_ratio: 96.8,
    inventory: 6.4,
    foreclosure_rate: 0.9,
    price_change_12m: 4.5,
    total_listings: 14230,
  },
  'new-york': {
    name: 'New York',
    state: 'NY',
    median_price: 720000,
    days_on_market: 78,
    list_to_sale_ratio: 94.2,
    inventory: 8.2,
    foreclosure_rate: 0.4,
    price_change_12m: 2.1,
    total_listings: 22100,
  },
  'denver': {
    name: 'Denver',
    state: 'CO',
    median_price: 525000,
    days_on_market: 22,
    list_to_sale_ratio: 99.5,
    inventory: 2.8,
    foreclosure_rate: 0.3,
    price_change_12m: 8.3,
    total_listings: 7650,
  },
  'seattle': {
    name: 'Seattle',
    state: 'WA',
    median_price: 695000,
    days_on_market: 18,
    list_to_sale_ratio: 99.8,
    inventory: 2.1,
    foreclosure_rate: 0.2,
    price_change_12m: 6.7,
    total_listings: 5890,
  },
  'chicago': {
    name: 'Chicago',
    state: 'IL',
    median_price: 310000,
    days_on_market: 45,
    list_to_sale_ratio: 95.8,
    inventory: 5.2,
    foreclosure_rate: 1.8,
    price_change_12m: 4.2,
    total_listings: 15840,
  },
  'atlanta': {
    name: 'Atlanta',
    state: 'GA',
    median_price: 395000,
    days_on_market: 32,
    list_to_sale_ratio: 98.1,
    inventory: 4.5,
    foreclosure_rate: 1.1,
    price_change_12m: 5.9,
    total_listings: 11200,
  },
  'las-vegas': {
    name: 'Las Vegas',
    state: 'NV',
    median_price: 410000,
    days_on_market: 38,
    list_to_sale_ratio: 97.5,
    inventory: 4.8,
    foreclosure_rate: 1.5,
    price_change_12m: 6.2,
    total_listings: 8950,
  },
};

const generatePriceTrend = (basePrice: number): PriceTrendData[] => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const data: PriceTrendData[] = [];
  let price = basePrice * 0.92;

  for (let i = 0; i < 12; i++) {
    const growth = 1 + (Math.random() * 0.02 + 0.005);
    price = price * growth;
    data.push({
      month: months[i],
      price: Math.round(price),
      listings: Math.round(800 + Math.random() * 400),
    });
  }
  return data;
};

export const priceTrends: Record<string, PriceTrendData[]> = {
  'los-angeles': generatePriceTrend(850000),
  'houston': generatePriceTrend(375000),
  'phoenix': generatePriceTrend(425000),
  'miami': generatePriceTrend(580000),
  'new-york': generatePriceTrend(720000),
  'denver': generatePriceTrend(525000),
  'seattle': generatePriceTrend(695000),
  'chicago': generatePriceTrend(310000),
  'atlanta': generatePriceTrend(395000),
  'las-vegas': generatePriceTrend(410000),
};

export const hotMarkets: Record<string, HotMarket[]> = {
  'price-growth': [
    { rank: 1, location: 'Denver', state: 'CO', value: 8.3, change: 1.2, trend: 'up' },
    { rank: 2, location: 'Phoenix', state: 'AZ', value: 7.1, change: 0.8, trend: 'up' },
    { rank: 3, location: 'Las Vegas', state: 'NV', value: 6.2, change: 0.5, trend: 'up' },
    { rank: 4, location: 'Seattle', state: 'WA', value: 6.7, change: -0.3, trend: 'down' },
    { rank: 5, location: 'Atlanta', state: 'GA', value: 5.9, change: 0.2, trend: 'up' },
    { rank: 6, location: 'Los Angeles', state: 'CA', value: 5.2, change: 0.1, trend: 'up' },
    { rank: 7, location: 'Miami', state: 'FL', value: 4.5, change: -0.4, trend: 'down' },
    { rank: 8, location: 'Chicago', state: 'IL', value: 4.2, change: 0.3, trend: 'up' },
    { rank: 9, location: 'Houston', state: 'TX', value: 3.8, change: 0.2, trend: 'up' },
    { rank: 10, location: 'New York', state: 'NY', value: 2.1, change: -0.1, trend: 'down' },
  ],
  'deal-volume': [
    { rank: 1, location: 'Houston', state: 'TX', value: 18720, change: 12.5, trend: 'up' },
    { rank: 2, location: 'New York', state: 'NY', value: 22100, change: 8.2, trend: 'up' },
    { rank: 3, location: 'Miami', state: 'FL', value: 14230, change: 15.3, trend: 'up' },
    { rank: 4, location: 'Los Angeles', state: 'CA', value: 12450, change: 6.8, trend: 'up' },
    { rank: 5, location: 'Chicago', state: 'IL', value: 15840, change: 4.2, trend: 'up' },
    { rank: 6, location: 'Atlanta', state: 'GA', value: 11200, change: 9.1, trend: 'up' },
    { rank: 7, location: 'Las Vegas', state: 'NV', value: 8950, change: 7.5, trend: 'up' },
    { rank: 8, location: 'Phoenix', state: 'AZ', value: 9820, change: 3.2, trend: 'up' },
    { rank: 9, location: 'Denver', state: 'CO', value: 7650, change: 5.8, trend: 'up' },
    { rank: 10, location: 'Seattle', state: 'WA', value: 5890, change: 2.1, trend: 'up' },
  ],
  'foreclosure': [
    { rank: 1, location: 'Chicago', state: 'IL', value: 1.8, change: -0.2, trend: 'down' },
    { rank: 2, location: 'Las Vegas', state: 'NV', value: 1.5, change: -0.1, trend: 'down' },
    { rank: 3, location: 'Houston', state: 'TX', value: 1.2, change: 0.1, trend: 'up' },
    { rank: 4, location: 'Atlanta', state: 'GA', value: 1.1, change: -0.3, trend: 'down' },
    { rank: 5, location: 'Miami', state: 'FL', value: 0.9, change: 0.2, trend: 'up' },
    { rank: 6, location: 'Los Angeles', state: 'CA', value: 0.8, change: -0.1, trend: 'down' },
    { rank: 7, location: 'Phoenix', state: 'AZ', value: 0.5, change: 0.0, trend: 'stable' },
    { rank: 8, location: 'New York', state: 'NY', value: 0.4, change: -0.1, trend: 'down' },
    { rank: 9, location: 'Denver', state: 'CO', value: 0.3, change: 0.0, trend: 'stable' },
    { rank: 10, location: 'Seattle', state: 'WA', value: 0.2, change: -0.1, trend: 'down' },
  ],
};

export function getPriceTrend(city: string): PriceTrendData[] {
  return priceTrends[city] || priceTrends['los-angeles'];
}

export function getMarketMetrics(city: string): MarketMetrics {
  const data = marketData[city] || marketData['los-angeles'];
  return {
    medianPrice: data.median_price,
    avgDaysOnMarket: data.days_on_market,
    listToSaleRatio: data.list_to_sale_ratio,
    inventory: data.inventory,
    foreclosureRate: data.foreclosure_rate,
    priceChange: data.price_change_12m,
    daysChange: (Math.random() - 0.5) * 10,
    inventoryChange: (Math.random() - 0.5) * 2,
    foreclosureChange: (Math.random() - 0.5) * 0.5,
  };
}

export function getHotMarkets(category: string): HotMarket[] {
  return hotMarkets[category] || hotMarkets['price-growth'];
}

export function getCityInfo(city: string): CityData {
  return marketData[city] || marketData['los-angeles'];
}

export function searchCities(query: string): CityData[] {
  const q = query.toLowerCase();
  return Object.values(marketData).filter(
    (city) =>
      city.name.toLowerCase().includes(q) ||
      city.state.toLowerCase().includes(q)
  );
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatPercent(value: number): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`;
}
