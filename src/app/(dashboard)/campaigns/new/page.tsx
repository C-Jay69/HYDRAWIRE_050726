'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Badge } from '@/components/ui/badge';
import { CampaignBuilder } from '@/components/campaigns/CampaignBuilder';
import { useCampaigns } from '@/hooks/useCampaigns';
import {
  CampaignType,
  leadLists,
  campaignTemplates,
  getCampaignTypeLabel,
} from '@/lib/campaign-data';
import { cn } from '@/lib/utils';
import {
  Mail,
  FileText,
  Stamp,
  CalendarIcon,
  Check,
  Users,
  FileText as FileTextIcon,
} from 'lucide-react';
import { format } from 'date-fns';

const typeIcons: Record<CampaignType, React.ReactNode> = {
  postcard: <Stamp className="h-6 w-6" />,
  letter: <FileText className="h-6 w-6" />,
  email: <Mail className="h-6 w-6" />,
};

const campaignTypes: { type: CampaignType; label: string; description: string }[] = [
  {
    type: 'postcard',
    label: 'Postcard',
    description: 'Physical postcards mailed to your target audience',
  },
  {
    type: 'letter',
    label: 'Letter',
    description: 'Professional letters with detailed information',
  },
  {
    type: 'email',
    label: 'Email',
    description: 'Digital email campaigns delivered instantly',
  },
];

export default function NewCampaignPage() {
  const router = useRouter();
  const { createCampaign, leadLists: lists, campaignTemplates: templates } = useCampaigns();
  const [showBuilder, setShowBuilder] = useState(false);
  const [selectedType, setSelectedType] = useState<CampaignType | null>(null);
  const [scheduleType, setScheduleType] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState<Date | undefined>();

  const steps = [
    {
      title: 'Choose Type',
      description: 'Select the type of campaign you want to create',
      content: (
        <div className="grid gap-4 md:grid-cols-3">
          {campaignTypes.map((item) => (
            <Card
              key={item.type}
              className={cn(
                'cursor-pointer transition-all hover:border-primary',
                selectedType === item.type && 'border-primary bg-primary/5'
              )}
              onClick={() => setSelectedType(item.type)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 rounded-full bg-muted p-3 w-fit">
                  {typeIcons[item.type]}
                </div>
                <CardTitle>{item.label}</CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </CardHeader>
              {selectedType === item.type && (
                <CardContent className="pt-0">
                  <Badge className="w-full justify-center bg-primary">
                    <Check className="mr-1 h-3 w-3" /> Selected
                  </Badge>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      ),
    },
    {
      title: 'Select Audience',
      description: 'Choose the lead list to send this campaign to',
      content: (
        <div className="space-y-4">
          <div className="grid gap-4">
            {lists.map((list) => (
              <Card
                key={list.id}
                className="cursor-pointer transition-all hover:border-primary"
              >
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <div className="rounded-full bg-primary/10 p-2">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{list.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Created {new Date(list.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge variant="secondary">{list.count.toLocaleString()} leads</Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Choose Template',
      description: 'Select a pre-built template or start from scratch',
      content: (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {templates
            .filter((t) => t.type === selectedType)
            .map((template) => (
              <Card
                key={template.id}
                className="cursor-pointer transition-all hover:border-primary overflow-hidden"
              >
                <div className="aspect-[3/2] bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
                  <FileTextIcon className="h-12 w-12 text-muted-foreground/50" />
                </div>
                <CardHeader className="p-4">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <CardDescription className="text-xs">
                    {template.description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
        </div>
      ),
    },
    {
      title: 'Configure',
      description: 'Customize your message and schedule',
      content: (
        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Merge Fields Preview</Label>
            <Card className="bg-muted/50">
              <CardContent className="p-4 text-sm space-y-2">
                <p>
                  <span className="font-medium">Owner Name:</span>{' '}
                  <span className="text-muted-foreground">John Smith</span>
                </p>
                <p>
                  <span className="font-medium">Property Address:</span>{' '}
                  <span className="text-muted-foreground">123 Main St, Los Angeles, CA</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Custom Message</Label>
            <Textarea
              id="message"
              placeholder="Enter your custom message here..."
              className="min-h-[150px]"
              defaultValue="Dear {{owner_name}}, I noticed your property at {{property_address}} and wanted to reach out about a potential opportunity..."
            />
          </div>

          <div className="space-y-2">
            <Label>Schedule</Label>
            <RadioGroup
              value={scheduleType}
              onValueChange={(v) => setScheduleType(v as 'now' | 'schedule')}
              className="flex gap-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="now" id="now" />
                <Label htmlFor="now" className="font-normal">
                  Send Now
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="schedule" id="schedule" />
                <Label htmlFor="schedule" className="font-normal">
                  Schedule for Later
                </Label>
              </div>
            </RadioGroup>

            {scheduleType === 'schedule' && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-[280px] justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {scheduledDate ? format(scheduledDate, 'PPP') : 'Pick a date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={scheduledDate}
                    onSelect={setScheduledDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>
      ),
    },
    {
      title: 'Review & Launch',
      description: 'Review your campaign and launch it',
      content: <ReviewStep selectedType={selectedType} scheduledDate={scheduledDate} />,
    },
  ];

  const handleComplete = async (data: Record<string, unknown>) => {
    await createCampaign({
      name: 'New Marketing Campaign',
      type: selectedType!,
      audienceListId: lists[0]?.id || '',
      templateId: templates[0]?.id || '',
      scheduledAt: scheduleType === 'schedule' && scheduledDate ? scheduledDate.toISOString() : undefined,
    });
    router.push('/campaigns');
  };

  if (showBuilder) {
    return (
      <div className="container mx-auto py-6 max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Create Campaign</h1>
          <p className="text-muted-foreground">
            Follow the steps to create your marketing campaign
          </p>
        </div>
        <CampaignBuilder
          steps={steps}
          onComplete={handleComplete}
          onCancel={() => router.push('/campaigns')}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Create Campaign</h1>
        <p className="text-muted-foreground">
          Select the type of campaign you want to create
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {campaignTypes.map((item) => (
          <Card
            key={item.type}
            className={cn(
              'cursor-pointer transition-all hover:border-primary hover:shadow-md',
              selectedType === item.type && 'border-primary bg-primary/5 shadow-md'
            )}
            onClick={() => setSelectedType(item.type)}
          >
            <CardHeader className="text-center">
              <div className="mx-auto mb-2 rounded-full bg-muted p-3 w-fit">
                {typeIcons[item.type]}
              </div>
              <CardTitle>{item.label}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            {selectedType === item.type && (
              <CardContent className="pt-0">
                <Badge className="w-full justify-center bg-primary">
                  <Check className="mr-1 h-3 w-3" /> Selected
                </Badge>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      <div className="flex justify-end mt-6">
        <Button
          size="lg"
          onClick={() => setShowBuilder(true)}
          disabled={!selectedType}
        >
          Continue
        </Button>
      </div>
    </div>
  );
}

function ReviewStep({
  selectedType,
  scheduledDate,
}: {
  selectedType: CampaignType | null;
  scheduledDate?: Date;
}) {
  const list = leadLists[0];
  const template = campaignTemplates.find((t) => t.type === selectedType);
  const costPerItem = selectedType === 'email' ? 0.10 : 0.30;
  const estimatedCost = list ? list.count * costPerItem : 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Campaign Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Campaign Type</p>
              <p className="font-medium">{selectedType ? getCampaignTypeLabel(selectedType) : '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Audience</p>
              <p className="font-medium">{list?.name || '-'}</p>
              <p className="text-sm text-muted-foreground">{list?.count.toLocaleString()} recipients</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Template</p>
              <p className="font-medium">{template?.name || '-'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Schedule</p>
              <p className="font-medium">
                {scheduledDate ? format(scheduledDate, 'PPP') : 'Send immediately'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-primary/50 bg-primary/5">
        <CardHeader>
          <CardTitle>Estimated Cost</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline justify-between">
            <div>
              <p className="text-3xl font-bold">
                ${estimatedCost.toFixed(2)}
              </p>
              <p className="text-sm text-muted-foreground">
                Based on {list?.count.toLocaleString()} recipients @ ${costPerItem.toFixed(2)} each
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
