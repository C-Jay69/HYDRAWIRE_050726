'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency, formatNumber, CityData } from '@/lib/market-data';
import {
  Home,
  TrendingUp,
  Users,
  DollarSign,
  Building2,
  BarChart3,
  Info,
} from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AnalyticsStatsProps {
  cityData: CityData;
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  description: string;
}

function StatCard({ title, value, icon, description }: StatCardProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Card className="cursor-help">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
            </CardContent>
          </Card>
        </TooltipTrigger>
        <TooltipContent>
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export function AnalyticsStats({ cityData, className }: AnalyticsStatsProps) {
  const stats: StatCardProps[] = [
    {
      title: 'Median Price',
      value: formatCurrency(cityData.median_price),
      icon: <Home className="h-4 w-4" />,
      description: 'The middle value of all homes sold in this area',
    },
    {
      title: '12-Month Price Change',
      value: `${cityData.price_change_12m >= 0 ? '+' : ''}${cityData.price_change_12m}%`,
      icon: <TrendingUp className="h-4 w-4" />,
      description: 'Year-over-year price appreciation percentage',
    },
    {
      title: 'Active Listings',
      value: formatNumber(cityData.total_listings),
      icon: <Building2 className="h-4 w-4" />,
      description: 'Total number of properties currently on the market',
    },
    {
      title: 'Avg Days on Market',
      value: `${cityData.days_on_market} days`,
      icon: <BarChart3 className="h-4 w-4" />,
      description: 'Average time from listing to contract',
    },
    {
      title: 'List-to-Sale Ratio',
      value: `${cityData.list_to_sale_ratio}%`,
      icon: <DollarSign className="h-4 w-4" />,
      description: 'Percentage of homes selling at or above list price',
    },
    {
      title: 'Foreclosure Rate',
      value: `${cityData.foreclosure_rate}%`,
      icon: <Info className="h-4 w-4" />,
      description: 'Percentage of homes in some stage of foreclosure',
    },
  ];

  return (
    <div className={className}>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
          />
        ))}
      </div>
    </div>
  );
}
