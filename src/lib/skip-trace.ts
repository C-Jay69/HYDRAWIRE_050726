export interface SkipTracePhone {
  number: string;
  type: 'mobile' | 'landline';
  confidence: number;
}

export interface SkipTraceEmail {
  address: string;
  confidence: number;
}

export interface SkipTraceAddress {
  address: string;
  type: 'current' | 'previous' | 'mailing';
}

export interface SkipTraceResult {
  property_id: string;
  property_address: string;
  owner_name: string;
  phones: SkipTracePhone[];
  emails: SkipTraceEmail[];
  addresses: SkipTraceAddress[];
  confidence_score: number;
  source: string;
  run_at: string;
}

// Demo data for skip trace results
const samplePhones: SkipTracePhone[][] = [
  [
    { number: '(555) 123-4567', type: 'mobile', confidence: 95 },
    { number: '(555) 987-6543', type: 'landline', confidence: 78 },
  ],
  [
    { number: '(310) 555-0101', type: 'mobile', confidence: 88 },
    { number: '(310) 555-0102', type: 'landline', confidence: 65 },
    { number: '(310) 555-0103', type: 'mobile', confidence: 72 },
  ],
  [
    { number: '(212) 555-7890', type: 'landline', confidence: 92 },
  ],
  [
    { number: '(480) 555-2468', type: 'mobile', confidence: 81 },
    { number: '(480) 555-2469', type: 'landline', confidence: 55 },
  ],
];

const sampleEmails: SkipTraceEmail[][] = [
  [
    { address: 'john.smith@email.com', confidence: 85 },
    { address: 'jsmith@gmail.com', confidence: 72 },
  ],
  [
    { address: 'owner@propertiesllc.com', confidence: 91 },
  ],
  [
    { address: 'michael.jones@yahoo.com', confidence: 68 },
    { address: 'mjones@outlook.com', confidence: 45 },
  ],
  [],
];

const sampleAddresses: SkipTraceAddress[][] = [
  [
    { address: '1234 Main St, Los Angeles, CA 90001', type: 'current' },
    { address: '5678 Oak Ave, Beverly Hills, CA 90210', type: 'previous' },
    { address: 'PO Box 1234, Los Angeles, CA 90002', type: 'mailing' },
  ],
  [
    { address: '9876 Sunset Blvd, Hollywood, CA 90028', type: 'mailing' },
  ],
  [
    { address: '456 Park Ave, New York, NY 10001', type: 'current' },
    { address: '789 Broadway, New York, NY 10003', type: 'previous' },
  ],
];

const confidenceScores = [92, 78, 85, 65, 88, 71, 95, 58];
const sources = ['TransUnion', 'Experian', 'LexisNexis', 'CoreLogic', 'Equifax'];

export async function runSkipTrace(
  propertyId: string,
  propertyAddress: string = '123 Main St',
  ownerName: string = 'John Smith'
): Promise<SkipTraceResult> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const index = Math.abs(hashCode(propertyId)) % samplePhones.length;

  return {
    property_id: propertyId,
    property_address: propertyAddress,
    owner_name: ownerName,
    phones: samplePhones[index],
    emails: sampleEmails[index],
    addresses: sampleAddresses[index],
    confidence_score: confidenceScores[index % confidenceScores.length],
    source: sources[index % sources.length],
    run_at: new Date().toISOString(),
  };
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash;
}

export const SKIP_TRACE_CREDIT_COST = 1;

export function getConfidenceColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-yellow-600';
  return 'text-red-600';
}

export function getConfidenceBgColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 50) return 'bg-yellow-500';
  return 'bg-red-500';
}

export const recentSkipTraces: SkipTraceResult[] = [
  {
    property_id: 'prop-0001',
    property_address: '1234 Oak St, Los Angeles, CA 90001',
    owner_name: 'James Wilson',
    phones: [
      { number: '(555) 123-4567', type: 'mobile', confidence: 95 },
      { number: '(555) 987-6543', type: 'landline', confidence: 78 },
    ],
    emails: [
      { address: 'jwilson@email.com', confidence: 85 },
    ],
    addresses: [
      { address: '1234 Oak St, Los Angeles, CA 90001', type: 'current' },
      { address: 'PO Box 1234, Los Angeles, CA 90002', type: 'mailing' },
    ],
    confidence_score: 92,
    source: 'TransUnion',
    run_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    property_id: 'prop-0015',
    property_address: '5678 Sunset Blvd, Hollywood, CA 90028',
    owner_name: 'Sarah Martinez',
    phones: [
      { number: '(310) 555-0101', type: 'mobile', confidence: 88 },
    ],
    emails: [
      { address: 'smartinez@properties.com', confidence: 91 },
    ],
    addresses: [
      { address: '9876 Sunset Blvd, Hollywood, CA 90028', type: 'mailing' },
    ],
    confidence_score: 78,
    source: 'CoreLogic',
    run_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    property_id: 'prop-0032',
    property_address: '999 Broadway, New York, NY 10001',
    owner_name: 'Robert Chen',
    phones: [
      { number: '(212) 555-7890', type: 'landline', confidence: 92 },
      { number: '(646) 555-1234', type: 'mobile', confidence: 88 },
    ],
    emails: [
      { address: 'rchen@investor.com', confidence: 76 },
      { address: 'robert.chen@gmail.com', confidence: 65 },
    ],
    addresses: [
      { address: '999 Broadway, New York, NY 10001', type: 'current' },
      { address: '456 Park Ave, New York, NY 10003', type: 'previous' },
    ],
    confidence_score: 85,
    source: 'LexisNexis',
    run_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
