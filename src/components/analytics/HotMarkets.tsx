'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { HotMarket, formatPercent } from '@/lib/market-data';
import { TrendingUp, TrendingDown, Minus, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HotMarketsProps {
  markets: HotMarket[];
  className?: string;
}

const tabCategories = [
  { value: 'price-growth', label: 'Price Growth' },
  { value: 'deal-volume', label: 'Deal Volume' },
  { value: 'foreclosure', label: 'Foreclosure Activity' },
];

export function HotMarkets({ markets, className }: HotMarketsProps) {
  const [activeTab, setActiveTab] = useState('price-growth');

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-red-500" />;
      default:
        return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const formatValue = (value: number, category: string) => {
    switch (category) {
      case 'price-growth':
        return `${value.toFixed(1)}%`;
      case 'deal-volume':
        return value.toLocaleString();
      case 'foreclosure':
        return `${value.toFixed(1)}%`;
      default:
        return value.toString();
    }
  };

  const getValueLabel = (category: string) => {
    switch (category) {
      case 'price-growth':
        return 'Growth';
      case 'deal-volume':
        return 'Listings';
      case 'foreclosure':
        return 'Rate';
      default:
        return 'Value';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-500" />
          Hot Markets Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3 mb-4">
            {tabCategories.map((tab) => (
              <TabsTrigger key={tab.value} value={tab.value} className="text-xs">
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="space-y-2">
            {markets
              .filter((m) => activeTab === 'price-growth' || true)
              .map((market) => (
                <div
                  key={`${market.location}-${market.state}`}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div
                    className={cn(
                      'w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold',
                      market.rank === 1 && 'bg-yellow-500/20 text-yellow-600',
                      market.rank === 2 && 'bg-gray-400/20 text-gray-600',
                      market.rank === 3 && 'bg-amber-600/20 text-amber-700',
                      market.rank > 3 && 'bg-muted text-muted-foreground'
                    )}
                  >
                    {market.rank}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">
                      {market.location}, {market.state}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">
                      {formatValue(market.value, activeTab)}
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      {getTrendIcon(market.trend)}
                      <span className="text-xs text-muted-foreground">
                        {formatPercent(market.change)}
                      </span>
                    </div>
                  </div>

                  <div className="w-16 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all',
                        market.rank === 1 && 'bg-yellow-500',
                        market.rank === 2 && 'bg-gray-400',
                        market.rank === 3 && 'bg-amber-600',
                        market.rank > 3 && 'bg-primary'
                      )}
                      style={{
                        width: `${Math.max(10, 100 - (market.rank - 1) * 9)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
