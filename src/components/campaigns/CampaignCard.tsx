'use client';

import { Campaign, getCampaignTypeLabel, getCampaignStatusLabel, getCampaignStatusColor, getCampaignTypeColor, formatCampaignCost } from '@/lib/campaign-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Copy, Pencil, Trash2, Mail, FileText, Stamp } from 'lucide-react';

interface CampaignCardProps {
  campaign: Campaign;
  onEdit?: (campaign: Campaign) => void;
  onDuplicate?: (campaign: Campaign) => void;
  onDelete?: (campaign: Campaign) => void;
}

export function CampaignCard({ campaign, onEdit, onDuplicate, onDelete }: CampaignCardProps) {
  const TypeIcon = campaign.type === 'email' ? Mail : campaign.type === 'letter' ? FileText : Stamp;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-5 w-5 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">{campaign.name}</CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(campaign)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate?.(campaign)}>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete?.(campaign)}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex gap-2 mt-2">
          <Badge variant="secondary" className={getCampaignTypeColor(campaign.type)}>
            {getCampaignTypeLabel(campaign.type)}
          </Badge>
          <Badge variant="secondary" className={getCampaignStatusColor(campaign.status)}>
            {getCampaignStatusLabel(campaign.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="text-sm">
            <span className="text-muted-foreground">Audience: </span>
            <span className="font-medium">{campaign.audienceList}</span>
            <span className="text-muted-foreground ml-1">({campaign.audienceCount.toLocaleString()})</span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 border-t">
            <div>
              <p className="text-xs text-muted-foreground">Sent</p>
              <p className="font-semibold">{campaign.stats.sent.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Delivered</p>
              <p className="font-semibold">{campaign.stats.delivered.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Cost</p>
              <p className="font-semibold">{formatCampaignCost(campaign.stats.cost)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t text-xs text-muted-foreground">
            <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
            {campaign.scheduledAt && (
              <span>Scheduled: {new Date(campaign.scheduledAt).toLocaleDateString()}</span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
