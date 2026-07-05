"use client";

import { Property, formatCurrency, formatAddress } from "@/lib/format";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { StatCard } from "@/components/shared/StatCard";
import { Button } from "@/components/ui/button";
import { Heart, Share2, Printer, ListPlus, Search, BarChart3, DollarSign } from "lucide-react";
import { useState } from "react";

interface PropertyHeaderProps {
  property: Property;
}

export function PropertyHeader({ property }: PropertyHeaderProps) {
  const [isSaved, setIsSaved] = useState(false);

  const equityPercent = property.estimatedValue > 0
    ? ((property.equity / property.estimatedValue) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Main Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold">{formatAddress(property)}</h1>
            <StatusBadge status={property.status} />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
              {property.propertyType}
            </span>
          </div>
          <p className="text-muted-foreground">
            {property.city}, {property.state} {property.zip}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <ListPlus className="h-4 w-4" />
            Add to List
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Search className="h-4 w-4" />
            Skip Trace
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <BarChart3 className="h-4 w-4" />
            Get Comps
          </Button>
          <Button
            variant="outline"
            size="sm"
            className={`gap-2 ${isSaved ? "text-[#1a56db]" : ""}`}
            onClick={() => setIsSaved(!isSaved)}
          >
            <Heart className={`h-4 w-4 ${isSaved ? "fill-current" : ""}`} />
            Save
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-card rounded-lg border shadow-sm">
          <StatCard
            label="Estimated Value"
            value={formatCurrency(property.estimatedValue)}
            icon={DollarSign}
          />
        </div>
        <div className="p-4 bg-card rounded-lg border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Equity</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#10b981]">
                {formatCurrency(property.equity)}
              </span>
              <span className="text-sm font-medium text-[#10b981]">
                {equityPercent.toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
        <div className="p-4 bg-card rounded-lg border shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Loan Balance</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-[#f97316]">
                {formatCurrency(property.loanBalance)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
