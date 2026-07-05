"use client";

import { useState } from "react";
import { Comparable, formatCurrency, formatNumber, formatDate, calculateMAO } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowUpDown,
  MapPin,
  Calculator,
  Check,
  X,
  ChevronUp,
  ChevronDown,
  Map as MapIcon,
} from "lucide-react";

interface PropertyCompsProps {
  subjectProperty: {
    id: string;
    address: string;
    sqft: number;
  };
}

// Generate sample comparable properties
function generateSampleComps(subjectId: string): Comparable[] {
  const comps: Comparable[] = [
    {
      id: `${subjectId}-comp-1`,
      address: "123 Oak Street",
      city: "Same City",
      salePrice: 425000,
      pricePerSqft: 312,
      beds: 4,
      baths: 2.5,
      sqft: 1362,
      distance: 0.1,
      saleDate: "2025-11-15",
      similarityScore: 92,
      included: true,
    },
    {
      id: `${subjectId}-comp-2`,
      address: "456 Maple Avenue",
      city: "Same City",
      salePrice: 475000,
      pricePerSqft: 298,
      beds: 4,
      baths: 3,
      sqft: 1594,
      distance: 0.2,
      saleDate: "2025-10-22",
      similarityScore: 88,
      included: true,
    },
    {
      id: `${subjectId}-comp-3`,
      address: "789 Pine Road",
      city: "Same City",
      salePrice: 389000,
      pricePerSqft: 285,
      beds: 3,
      baths: 2,
      sqft: 1365,
      distance: 0.15,
      saleDate: "2025-12-01",
      similarityScore: 85,
      included: true,
    },
    {
      id: `${subjectId}-comp-4`,
      address: "321 Elm Court",
      city: "Same City",
      salePrice: 512000,
      pricePerSqft: 340,
      beds: 5,
      baths: 3.5,
      sqft: 1506,
      distance: 0.3,
      saleDate: "2025-09-18",
      similarityScore: 78,
      included: false,
    },
    {
      id: `${subjectId}-comp-5`,
      address: "654 Cedar Lane",
      city: "Same City",
      salePrice: 398000,
      pricePerSqft: 276,
      beds: 3,
      baths: 2,
      sqft: 1442,
      distance: 0.25,
      saleDate: "2025-11-30",
      similarityScore: 75,
      included: true,
    },
  ];
  return comps;
}

type SortField = "address" | "salePrice" | "pricePerSqft" | "sqft" | "distance" | "saleDate" | "similarityScore";
type SortDirection = "asc" | "desc";

export function PropertyComps({ subjectProperty }: PropertyCompsProps) {
  const [comps, setComps] = useState<Comparable[]>(generateSampleComps(subjectProperty.id));
  const [sortField, setSortField] = useState<SortField>("similarityScore");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [arv, setArv] = useState<string>("420000");
  const [repairs, setRepairs] = useState<string>("15000");
  const [profitMargin, setProfitMargin] = useState<string>("30");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const toggleComp = (compId: string) => {
    setComps(comps.map((comp) =>
      comp.id === compId ? { ...comp, included: !comp.included } : comp
    ));
  };

  const sortedComps = [...comps].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];
    const direction = sortDirection === "asc" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return aValue.localeCompare(bValue) * direction;
    }
    return ((aValue as number) - (bValue as number)) * direction;
  });

  const includedComps = sortedComps.filter((c) => c.included);
  const avgPricePerSqft = includedComps.length > 0
    ? includedComps.reduce((sum, c) => sum + c.pricePerSqft, 0) / includedComps.length
    : 0;
  const estimatedValue = Math.round(avgPricePerSqft * subjectProperty.sqft);

  const arvNum = parseFloat(arv) || 0;
  const repairsNum = parseFloat(repairs) || 0;
  const marginNum = parseFloat(profitMargin) || 30;
  const mao = calculateMAO(arvNum, repairsNum, marginNum);

  const SortHeader = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead
      className={`cursor-pointer hover:bg-muted/50 ${className || ""}`}
      onClick={() => handleSort(field)}
    >
      <div className="flex items-center gap-1">
        {children}
        {sortField === field && (
          sortDirection === "asc" ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )
        )}
      </div>
    </TableHead>
  );

  return (
    <div className="space-y-6">
      {/* ARV Calculator */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calculator className="h-5 w-5" />
            ARV Calculator (70% Rule)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <Label htmlFor="arv">After Repair Value (ARV)</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="arv"
                  type="number"
                  value={arv}
                  onChange={(e) => setArv(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="repairs">Estimated Repairs</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="repairs"
                  type="number"
                  value={repairs}
                  onChange={(e) => setRepairs(e.target.value)}
                  className="pl-7"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="margin">Profit Margin</Label>
              <div className="relative">
                <Input
                  id="margin"
                  type="number"
                  value={profitMargin}
                  onChange={(e) => setProfitMargin(e.target.value)}
                  className="pr-8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Max Allowable Offer</Label>
              <div className="p-3 bg-[#10b981] text-white rounded-md">
                <p className="text-xl font-bold">{formatCurrency(mao)}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Formula: MAO = (ARV x {100 - marginNum}%) - Repairs = {formatCurrency(arvNum * (1 - marginNum / 100))} - {formatCurrency(repairsNum)} = {formatCurrency(mao)}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Mini Map Placeholder */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapIcon className="h-5 w-5" />
            Comparable Properties Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video rounded-lg bg-gradient-to-br from-blue-100 to-green-100 dark:from-blue-900 dark:to-green-900 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 mx-auto mb-2 text-blue-500 opacity-50" />
              <p className="text-sm text-muted-foreground">
                Map showing {comps.length} comparable properties
              </p>
              <p className="text-xs text-muted-foreground">within 0.5 miles</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Comps Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between text-lg">
            <span className="flex items-center gap-2">
              Comparable Sales ({includedComps.length} included)
            </span>
            <div className="text-sm font-normal text-muted-foreground">
              Est. Value: <span className="font-bold text-[#1a56db]">{formatCurrency(estimatedValue)}</span>
              <span className="mx-1">|</span>
              Avg: <span className="font-bold">{formatCurrency(avgPricePerSqft)}/sqft</span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Incl.</TableHead>
                  <SortHeader field="address">Address</SortHeader>
                  <TableHead className="hidden md:table-cell">City</TableHead>
                  <SortHeader field="salePrice">Sale Price</SortHeader>
                  <SortHeader field="pricePerSqft">$/Sqft</SortHeader>
                  <TableHead className="hidden sm:table-cell">B/B/Sqft</TableHead>
                  <SortHeader field="distance" className="hidden lg:table-cell">Distance</SortHeader>
                  <SortHeader field="saleDate" className="hidden lg:table-cell">Sale Date</SortHeader>
                  <SortHeader field="similarityScore">Score</SortHeader>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedComps.map((comp) => (
                  <TableRow
                    key={comp.id}
                    className={!comp.included ? "opacity-50" : ""}
                  >
                    <TableCell>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Switch
                              checked={comp.included}
                              onCheckedChange={() => toggleComp(comp.id)}
                            />
                          </TooltipTrigger>
                          <TooltipContent>
                            {comp.included ? "Exclude from calculations" : "Include in calculations"}
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="font-medium">{comp.address}</TableCell>
                    <TableCell className="hidden md:table-cell">{comp.city}</TableCell>
                    <TableCell className="font-bold">{formatCurrency(comp.salePrice)}</TableCell>
                    <TableCell>{formatCurrency(comp.pricePerSqft)}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      {comp.beds}/{comp.baths}/{formatNumber(comp.sqft)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">{comp.distance} mi</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(comp.saleDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              comp.similarityScore >= 85
                                ? "bg-[#10b981]"
                                : comp.similarityScore >= 70
                                ? "bg-[#f97316]"
                                : "bg-[#ef4444]"
                            }`}
                            style={{ width: `${comp.similarityScore}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium">{comp.similarityScore}%</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
