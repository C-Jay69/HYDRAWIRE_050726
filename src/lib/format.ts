// Property type definition
export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  status: string;
  propertyType: string;
  beds: number;
  baths: number;
  sqft: number;
  lotSize: number;
  yearBuilt: number;
  garage: number;
  hasPool: boolean;
  propertyUse: string;
  ownerName: string;
  ownerType: string;
  mailingAddress: string;
  ownerAddress: string;
  loanBalance: number;
  loanType: string;
  lenderName: string;
  originationDate: string;
  assessedValue: number;
  annualTaxes: number;
  taxDelinquency: number;
  equity: number;
  loanAmount: number;
  estimatedValue: number;
  floodZone: string;
  schoolDistrict: string;
  latitude?: number;
  longitude?: number;
}

// Comparable property type
export interface Comparable {
  id: string;
  address: string;
  city: string;
  salePrice: number;
  pricePerSqft: number;
  beds: number;
  baths: number;
  sqft: number;
  distance: number;
  saleDate: string;
  similarityScore: number;
  included: boolean;
}

// Transaction history type
export interface Transaction {
  id: string;
  type: "purchase" | "listing" | "tax" | "ownership";
  date: string;
  description: string;
  amount?: number;
  source?: string;
}

// Format currency with dollar sign and commas
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format number with commas
export function formatNumber(num: number): string {
  return new Intl.NumberFormat("en-US").format(num);
}

// Format percentage with 1 decimal place
export function formatPercent(num: number): string {
  return `${num.toFixed(1)}%`;
}

// Format date as readable string
export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

// Format full address from property object
export function formatAddress(property: Property): string {
  return `${property.address}, ${property.city}, ${property.state} ${property.zip}`;
}

// Calculate monthly payment estimate
export function calculateMonthlyPayment(principal: number, annualRate: number = 0.07, years: number = 30): number {
  const monthlyRate = annualRate / 12;
  const numPayments = years * 12;
  if (monthlyRate === 0) return principal / numPayments;
  const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
  return Math.round(payment);
}

// Calculate Max Allowable Offer (70% rule)
export function calculateMAO(arv: number, repairs: number, profitMargin: number = 30): number {
  return Math.round((arv * (1 - profitMargin / 100)) - repairs);
}
