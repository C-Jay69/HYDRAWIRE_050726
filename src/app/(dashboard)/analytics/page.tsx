'use client';

import { useState } from 'react';
import { LocationSearch } from '@/components/analytics/LocationSearch';
import { PriceTrendChart } from '@/components/analytics/PriceTrendChart';
import { MetricsGrid } from '@/components/analytics/MetricsGrid';
import { HotMarkets } from '@/components/analytics/HotMarkets';
import { AnalyticsStats } from '@/components/analytics/AnalyticsStats';
import { MarketChart } from '@/components/analytics/MarketChart';
import {
  getPriceTrend,
  getMarketMetrics,
  getHotMarkets,
  getCityInfo,
  CityData,
  formatNumber,
  PriceTrendData,
} from '@/lib/market-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AnalyticsPage() {
  const [selectedCity, setSelectedCity] = useState<CityData | null>(null);
  const [activeHotMarketTab, setActiveHotMarketTab] = useState('price-growth');

  const cityKey = selectedCity?.name.toLowerCase().replace(/\s+/g, '-') || 'los-angeles';
  const priceTrendData = getPriceTrend(cityKey);
  const metrics = getMarketMetrics(cityKey);
  const hotMarkets = getHotMarkets(activeHotMarketTab);
  const cityData = getCityInfo(cityKey);

  const listingsData: { month: string; listings: number }[] = priceTrendData.map((d) => ({
    month: d.month,
    listings: d.listings,
  }));

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Market Analytics</h1>
          <p className="text-muted-foreground mt-1">
            Analyze real estate market trends and performance metrics
          </p>
        </div>
        <div className="w-full md:w-80">
          <LocationSearch
            onSelect={setSelectedCity}
            selectedCity={selectedCity}
          />
        </div>
      </div>

      {/* Selected Location Header */}
      {selectedCity && (
        <Card className="bg-gradient-to-r from-primary/10 to-primary/5">
          <CardContent className="flex items-center justify-between py-4">
            <div className="flex items-center gap-4">
              <div className="rounded-full bg-primary/20 p-3">
                <svg
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {selectedCity.name}, {selectedCity.state}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {formatNumber(selectedCity.total_listings)} active listings
                </p>
              </div>
            </div>
            <Badge
              variant={selectedCity.price_change_12m >= 0 ? 'default' : 'destructive'}
              className={cn(
                'text-sm px-3 py-1',
                selectedCity.price_change_12m >= 0
                  ? 'bg-green-500/20 text-green-600 hover:bg-green-500/20'
                  : 'bg-red-500/20 text-red-600 hover:bg-red-500/20'
              )}
            >
              {selectedCity.price_change_12m >= 0 ? (
                <TrendingUp className="mr-1 h-4 w-4" />
              ) : (
                <TrendingDown className="mr-1 h-4 w-4" />
              )}
              {selectedCity.price_change_12m >= 0 ? '+' : ''}
              {selectedCity.price_change_12m}% YoY
            </Badge>
          </CardContent>
        </Card>
      )}

      {/* Analytics Stats */}
      <AnalyticsStats cityData={cityData} />

      {/* Metrics Grid */}
      <MetricsGrid metrics={metrics} />

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Price Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>12-Month Median Price Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <PriceTrendChart data={priceTrendData} height={300} />
          </CardContent>
        </Card>

        {/* Listings Trend Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Active Listings Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <MarketChart
              data={listingsData}
              type="bar"
              xKey="month"
              yKeys={['listings']}
              colors={['#10b981']}
              height={300}
              yFormatter={(v) => v.toLocaleString()}
            />
          </CardContent>
        </Card>
      </div>

      {/* Hot Markets */}
      <HotMarkets markets={hotMarkets} />

      {/* Additional Metrics */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Market Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Market Activity Snapshot</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <ActivityRow
                label="New Listings (30 days)"
                value={Math.round(cityData.total_listings * 0.15)}
                trend={8.2}
                positive
              />
              <ActivityRow
                label="Sold Listings (30 days)"
                value={Math.round(cityData.total_listings * 0.12)}
                trend={5.4}
                positive
              />
              <ActivityRow
                label="Price Reductions"
                value={Math.round(cityData.total_listings * 0.08)}
                trend={-2.1}
                positive={false}
              />
              <ActivityRow
                label="Avg Sale to List Price"
                value={97.2}
                trend={1.3}
                positive
                suffix="%"
              />
            </div>
          </CardContent>
        </Card>

        {/* Investment Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Investment Opportunity Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="relative inline-flex">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-muted"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeDasharray={`${72 * 3.52} 352`}
                      strokeLinecap="round"
                      className="text-primary"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl font-bold">72</span>
                  </div>
                </div>
                <p className="mt-4 text-muted-foreground">Investment Score</p>
                <p className="text-sm text-muted-foreground">
                  Based on price growth, inventory, and market activity
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function ActivityRow({
  label,
  value,
  trend,
  positive,
  suffix = '',
}: {
  label: string;
  value: number;
  trend: number;
  positive: boolean;
  suffix?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <div className="flex items-center gap-3">
        <span className="font-semibold">
          {typeof value === 'number' ? value.toLocaleString() : value}
          {suffix}
        </span>
        <Badge
          variant="secondary"
          className={cn(
            trend >= 0
              ? 'bg-green-500/10 text-green-600'
              : 'bg-red-500/10 text-red-600'
          )}
        >
          {trend >= 0 ? (
            <TrendingUp className="mr-1 h-3 w-3" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3" />
          )}
          {Math.abs(trend)}%
        </Badge>
      </div>
    </div>
  );
}
