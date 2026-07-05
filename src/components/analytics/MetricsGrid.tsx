'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { MarketMetrics, formatCurrency, formatNumber, formatPercent } from '@/lib/market-data';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string;
  change?: number;
  format?: 'currency' | 'number' | 'percent';
  icon?: React.ReactNode;
}

function MetricCard({ title, value, change, format = 'number', icon }: MetricCardProps) {
  const getTrendIcon = () => {
    if (change === undefined) return null;
    if (change > 0) return <TrendingUp className="h-4 w-4" />;
    if (change < 0) return <TrendingDown className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  const getTrendColor = () => {
    if (change === undefined) return 'text-muted-foreground';
    if (change > 0) return 'text-green-500';
    if (change < 0) return 'text-red-500';
    return 'text-muted-foreground';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change !== undefined && (
          <div className={cn('flex items-center gap-1 text-sm mt-1', getTrendColor())}>
            {getTrendIcon()}
            <span>{formatPercent(change)}</span>
            <span className="text-muted-foreground ml-1">vs last month</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

interface MetricsGridProps {
  metrics: MarketMetrics;
  className?: string;
}

export function MetricsGrid({ metrics, className }: MetricsGridProps) {
  const metricCards = [
    {
      title: 'Median Price',
      value: formatCurrency(metrics.medianPrice),
      change: metrics.priceChange,
    },
    {
      title: 'Avg Days on Market',
      value: `${metrics.avgDaysOnMarket} days`,
      change: metrics.daysChange,
    },
    {
      title: 'List-to-Sale Ratio',
      value: `${metrics.listToSaleRatio.toFixed(1)}%`,
      change: undefined,
    },
    {
      title: 'Months of Inventory',
      value: metrics.inventory.toFixed(1),
      change: metrics.inventoryChange,
    },
    {
      title: 'Foreclosure Rate',
      value: `${metrics.foreclosureRate.toFixed(1)}%`,
      change: metrics.foreclosureChange,
    },
  ];

  return (
    <div className={cn('grid gap-4 md:grid-cols-2 lg:grid-cols-5', className)}>
      {metricCards.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          format={metric.title.includes('Price') ? 'currency' : 'number'}
        />
      ))}
    </div>
  );
}
