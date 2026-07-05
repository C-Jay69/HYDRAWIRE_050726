export type CampaignType = 'postcard' | 'letter' | 'email';
export type CampaignStatus = 'draft' | 'scheduled' | 'sending' | 'completed';

export interface CampaignStats {
  sent: number;
  delivered: number;
  opened?: number;
  clicked?: number;
  cost: number;
}

export interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  audienceList: string;
  audienceCount: number;
  template: string;
  stats: CampaignStats;
  createdAt: string;
  scheduledAt?: string;
  message?: string;
}

export interface LeadList {
  id: string;
  name: string;
  count: number;
  createdAt: string;
}

export interface CampaignTemplate {
  id: string;
  name: string;
  type: CampaignType;
  thumbnail: string;
  description: string;
}

export const leadLists: LeadList[] = [
  { id: '1', name: 'Investor Leads - Los Angeles', count: 1250, createdAt: '2024-01-15' },
  { id: '2', name: 'Vacant Properties - Houston', count: 890, createdAt: '2024-02-20' },
  { id: '3', name: 'Pre-Foreclosure - Phoenix', count: 2100, createdAt: '2024-03-10' },
  { id: '4', name: 'High Equity Owners', count: 1560, createdAt: '2024-01-28' },
  { id: '5', name: 'Absentee Owners - Miami', count: 3200, createdAt: '2024-04-05' },
];

export const campaignTemplates: CampaignTemplate[] = [
  {
    id: 'just-sold-postcard',
    name: 'Just Sold',
    type: 'postcard',
    thumbnail: '/templates/just-sold.jpg',
    description: 'Celebrate recent sales in the neighborhood to attract sellers',
  },
  {
    id: 'we-buy-houses-postcard',
    name: 'We Buy Houses',
    type: 'postcard',
    thumbnail: '/templates/we-buy-houses.jpg',
    description: 'Direct mail campaign targeting motivated sellers',
  },
  {
    id: 'off-market-postcard',
    name: 'Off-Market Opportunity',
    type: 'postcard',
    thumbnail: '/templates/off-market.jpg',
    description: 'Exclusive investment opportunities before they list',
  },
  {
    id: 'market-update-email',
    name: 'Market Update',
    type: 'email',
    thumbnail: '/templates/market-update.jpg',
    description: 'Monthly newsletter with local market statistics',
  },
  {
    id: 'investment-letter',
    name: 'Investment Opportunity',
    type: 'letter',
    thumbnail: '/templates/investment-letter.jpg',
    description: 'Professional letter for high-value investor leads',
  },
  {
    id: 'free-valuation-email',
    name: 'Free Property Valuation',
    type: 'email',
    thumbnail: '/templates/free-valuation.jpg',
    description: 'Offer free CMA to generate seller leads',
  },
];

export const sampleCampaigns: Campaign[] = [
  {
    id: '1',
    name: 'Summer Investor Blast',
    type: 'email',
    status: 'completed',
    audienceList: 'Investor Leads - Los Angeles',
    audienceCount: 1250,
    template: 'Market Update',
    stats: { sent: 1250, delivered: 1220, opened: 485, clicked: 142, cost: 125.00 },
    createdAt: '2024-06-01',
  },
  {
    id: '2',
    name: 'Off-Market Properties Q3',
    type: 'postcard',
    status: 'scheduled',
    audienceList: 'High Equity Owners',
    audienceCount: 1560,
    template: 'Off-Market Opportunity',
    stats: { sent: 0, delivered: 0, cost: 468.00 },
    createdAt: '2024-07-15',
    scheduledAt: '2024-08-01',
  },
  {
    id: '3',
    name: 'Pre-Foreclosure Campaign',
    type: 'letter',
    status: 'sending',
    audienceList: 'Pre-Foreclosure - Phoenix',
    audienceCount: 2100,
    template: 'Investment Opportunity',
    stats: { sent: 1450, delivered: 1430, cost: 630.00 },
    createdAt: '2024-07-20',
  },
  {
    id: '4',
    name: 'Miami Absentee Owners',
    type: 'postcard',
    status: 'completed',
    audienceList: 'Absentee Owners - Miami',
    audienceCount: 3200,
    template: 'We Buy Houses',
    stats: { sent: 3200, delivered: 3150, cost: 960.00 },
    createdAt: '2024-05-10',
  },
  {
    id: '5',
    name: 'New Investment Leads',
    type: 'email',
    status: 'draft',
    audienceList: 'Investor Leads - Los Angeles',
    audienceCount: 1250,
    template: 'Free Property Valuation',
    stats: { sent: 0, delivered: 0, cost: 125.00 },
    createdAt: '2024-07-25',
  },
  {
    id: '6',
    name: 'Houston Vacant Properties',
    type: 'postcard',
    status: 'completed',
    audienceList: 'Vacant Properties - Houston',
    audienceCount: 890,
    template: 'Just Sold',
    stats: { sent: 890, delivered: 875, cost: 267.00 },
    createdAt: '2024-04-22',
  },
];

export const getCampaignsByStatus = (status: CampaignStatus | 'all') => {
  if (status === 'all') return sampleCampaigns;
  return sampleCampaigns.filter((c) => c.status === status);
};

export const formatCampaignCost = (cost: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cost);
};

export const getCampaignTypeLabel = (type: CampaignType) => {
  const labels: Record<CampaignType, string> = {
    postcard: 'Postcard',
    letter: 'Letter',
    email: 'Email',
  };
  return labels[type];
};

export const getCampaignStatusLabel = (status: CampaignStatus) => {
  const labels: Record<CampaignStatus, string> = {
    draft: 'Draft',
    scheduled: 'Scheduled',
    sending: 'Sending',
    completed: 'Completed',
  };
  return labels[status];
};

export const getCampaignStatusColor = (status: CampaignStatus) => {
  const colors: Record<CampaignStatus, string> = {
    draft: 'bg-gray-500/10 text-gray-500',
    scheduled: 'bg-blue-500/10 text-blue-500',
    sending: 'bg-yellow-500/10 text-yellow-500',
    completed: 'bg-green-500/10 text-green-500',
  };
  return colors[status];
};

export const getCampaignTypeColor = (type: CampaignType) => {
  const colors: Record<CampaignType, string> = {
    postcard: 'bg-purple-500/10 text-purple-500',
    letter: 'bg-orange-500/10 text-orange-500',
    email: 'bg-cyan-500/10 text-cyan-500',
  };
  return colors[type];
};
