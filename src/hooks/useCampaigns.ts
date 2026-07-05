'use client';

import { useState, useCallback } from 'react';
import {
  Campaign,
  CampaignType,
  CampaignStatus,
  sampleCampaigns,
  leadLists,
  campaignTemplates,
  LeadList,
  CampaignTemplate,
} from '@/lib/campaign-data';

export interface CreateCampaignInput {
  name: string;
  type: CampaignType;
  audienceListId: string;
  templateId: string;
  message?: string;
  scheduledAt?: string;
}

export interface CampaignFilters {
  status: CampaignStatus | 'all';
  type?: CampaignType;
  search?: string;
}

export function useCampaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(sampleCampaigns);
  const [loading, setLoading] = useState(false);

  const createCampaign = useCallback(
    async (input: CreateCampaignInput): Promise<Campaign> => {
      setLoading(true);
      try {
        const list = leadLists.find((l) => l.id === input.audienceListId);
        const template = campaignTemplates.find((t) => t.id === input.templateId);

        if (!list || !template) {
          throw new Error('Invalid list or template');
        }

        const costPerItem = input.type === 'email' ? 0.10 : 0.30;
        const estimatedCost = list.count * costPerItem;

        const newCampaign: Campaign = {
          id: `${Date.now()}`,
          name: input.name,
          type: input.type,
          status: input.scheduledAt ? 'scheduled' : 'draft',
          audienceList: list.name,
          audienceCount: list.count,
          template: template.name,
          stats: {
            sent: 0,
            delivered: 0,
            cost: estimatedCost,
          },
          createdAt: new Date().toISOString().split('T')[0],
          scheduledAt: input.scheduledAt,
          message: input.message,
        };

        setCampaigns((prev) => [newCampaign, ...prev]);
        return newCampaign;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const updateCampaign = useCallback(
    async (id: string, updates: Partial<Campaign>): Promise<Campaign | null> => {
      setLoading(true);
      try {
        let updated: Campaign | null = null;
        setCampaigns((prev) =>
          prev.map((c) => {
            if (c.id === id) {
              updated = { ...c, ...updates };
              return updated;
            }
            return c;
          })
        );
        return updated;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const deleteCampaign = useCallback(async (id: string): Promise<boolean> => {
    setLoading(true);
    try {
      setCampaigns((prev) => prev.filter((c) => c.id !== id));
      return true;
    } finally {
      setLoading(false);
    }
  }, []);

  const duplicateCampaign = useCallback(
    async (id: string): Promise<Campaign | null> => {
      const original = campaigns.find((c) => c.id === id);
      if (!original) return null;

      return createCampaign({
        name: `${original.name} (Copy)`,
        type: original.type,
        audienceListId: leadLists.find((l) => l.name === original.audienceList)?.id || '',
        templateId: campaignTemplates.find((t) => t.name === original.template)?.id || '',
        message: original.message,
      });
    },
    [campaigns, createCampaign]
  );

  const launchCampaign = useCallback(
    async (id: string): Promise<boolean> => {
      return updateCampaign(id, { status: 'sending' }) !== null;
    },
    [updateCampaign]
  );

  const getCampaignsByStatus = useCallback(
    (status: CampaignStatus | 'all') => {
      if (status === 'all') return campaigns;
      return campaigns.filter((c) => c.status === status);
    },
    [campaigns]
  );

  const getCampaignById = useCallback(
    (id: string) => {
      return campaigns.find((c) => c.id === id) || null;
    },
    [campaigns]
  );

  const filterCampaigns = useCallback(
    (filters: CampaignFilters) => {
      return campaigns.filter((c) => {
        if (filters.status !== 'all' && c.status !== filters.status) return false;
        if (filters.type && c.type !== filters.type) return false;
        if (filters.search) {
          const search = filters.search.toLowerCase();
          if (
            !c.name.toLowerCase().includes(search) &&
            !c.audienceList.toLowerCase().includes(search)
          ) {
            return false;
          }
        }
        return true;
      });
    },
    [campaigns]
  );

  const getTotalStats = useCallback(() => {
    return campaigns.reduce(
      (acc, c) => ({
        totalSent: acc.totalSent + c.stats.sent,
        totalDelivered: acc.totalDelivered + c.stats.delivered,
        totalCost: acc.totalCost + c.stats.cost,
        totalCampaigns: acc.totalCampaigns + 1,
      }),
      { totalSent: 0, totalDelivered: 0, totalCost: 0, totalCampaigns: 0 }
    );
  }, [campaigns]);

  return {
    campaigns,
    loading,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    duplicateCampaign,
    launchCampaign,
    getCampaignsByStatus,
    getCampaignById,
    filterCampaigns,
    getTotalStats,
    leadLists,
    campaignTemplates,
  };
}
