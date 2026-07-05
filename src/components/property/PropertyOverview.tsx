"use client";

import { Property, formatCurrency, formatNumber, formatDate } from "@/lib/format";
import { calculateMonthlyPayment } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  User,
  Building2,
  MapPin,
  DollarSign,
  Calculator,
  Home,
  MapPinned,
  GraduationCap,
  Waves,
  AlertTriangle,
} from "lucide-react";

interface PropertyOverviewProps {
  property: Property;
}

export function PropertyOverview({ property }: PropertyOverviewProps) {
  const monthlyPayment = calculateMonthlyPayment(property.loanBalance);
  const ownerIsAbsentee = property.ownerType.toLowerCase().includes("absentee");

  return (
    <div className="space-y-6">
      {/* Owner Information Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            Owner Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Owner Name</p>
              <p className="font-medium">{property.ownerName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Owner Type</p>
              <div className="flex items-center gap-2">
                <p className="font-medium">{property.ownerType}</p>
                {ownerIsAbsentee && (
                  <Badge variant="secondary" className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    Absentee
                  </Badge>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mailing Address</p>
              <p className="font-medium">{property.mailingAddress}</p>
            </div>
            {property.ownerAddress !== property.mailingAddress && (
              <div>
                <p className="text-sm text-muted-foreground">Owner Address (if different)</p>
                <p className="font-medium">{property.ownerAddress}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mortgage Information Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5" />
            Mortgage Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Loan Balance</p>
              <p className="text-lg font-bold text-[#f97316]">
                {formatCurrency(property.loanBalance)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loan Type</p>
              <p className="font-medium">{property.loanType}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lender Name</p>
              <p className="font-medium">{property.lenderName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Origination Date</p>
              <p className="font-medium">{formatDate(property.originationDate)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Est. Monthly Payment</p>
              <p className="text-lg font-bold">{formatCurrency(monthlyPayment)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tax Information Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <DollarSign className="h-5 w-5" />
            Tax Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Assessed Value</p>
              <p className="text-lg font-bold">{formatCurrency(property.assessedValue)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Annual Taxes</p>
              <p className="text-lg font-bold">{formatCurrency(property.annualTaxes)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tax Delinquency</p>
              {property.taxDelinquency > 0 ? (
                <div>
                  <p className="text-lg font-bold text-[#ef4444]">
                    {formatCurrency(property.taxDelinquency)}
                  </p>
                </div>
              ) : (
                <p className="text-lg font-bold text-[#10b981]">None</p>
              )}
            </div>
          </div>
          {property.taxDelinquency > 0 && (
            <Alert variant="destructive" className="bg-red-50 border-red-200 dark:bg-red-950 dark:border-red-800">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                Property has {formatCurrency(property.taxDelinquency)} in tax delinquency.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Property Details Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Home className="h-5 w-5" />
            Property Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Beds</p>
              <p className="text-lg font-bold">{property.beds}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Baths</p>
              <p className="text-lg font-bold">{property.baths}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Sqft</p>
              <p className="text-lg font-bold">{formatNumber(property.sqft)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lot Size</p>
              <p className="text-lg font-bold">{formatNumber(property.lotSize)} sqft</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Year Built</p>
              <p className="text-lg font-bold">{property.yearBuilt}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Garage</p>
              <p className="text-lg font-bold">{property.garage} spaces</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pool</p>
              <p className="text-lg font-bold">{property.hasPool ? "Yes" : "No"}</p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm text-muted-foreground">Property Use</p>
            <p className="font-medium">{property.propertyUse}</p>
          </div>
        </CardContent>
      </Card>

      {/* Location Card */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPinned className="h-5 w-5" />
            Location
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Flood Zone</p>
              <p className="font-medium">{property.floodZone}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">School District</p>
              <p className="font-medium">{property.schoolDistrict}</p>
            </div>
          </div>
          {/* Map Embed Placeholder */}
          <div className="mt-4 aspect-video rounded-lg bg-muted overflow-hidden">
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
              <div className="text-center">
                <MapPinned className="h-12 w-12 mx-auto mb-2 text-blue-500 opacity-50" />
                <p className="text-sm text-blue-700 dark:text-blue-300">Map View</p>
                <p className="text-xs text-blue-500 dark:text-blue-400">
                  {property.city}, {property.state}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
