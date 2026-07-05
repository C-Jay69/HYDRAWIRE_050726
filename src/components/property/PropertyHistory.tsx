"use client";

import { Transaction, formatCurrency, formatDate } from "@/lib/format";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ShoppingCart,
  Tag,
  Receipt,
  Users,
  DollarSign,
  Calendar,
  FileText,
} from "lucide-react";

// Generate sample transaction history
function generateSampleHistory(propertyId: string): Transaction[] {
  return [
    {
      id: `${propertyId}-tx-1`,
      type: "ownership",
      date: "2024-06-15",
      description: "Ownership transfer to current owner",
      source: "County Records",
    },
    {
      id: `${propertyId}-tx-2`,
      type: "purchase",
      date: "2024-06-15",
      description: "Purchased at auction",
      amount: 385000,
      source: "Auction.com",
    },
    {
      id: `${propertyId}-tx-3`,
      type: "listing",
      date: "2024-08-01",
      description: "Listed for sale",
      amount: 449000,
      source: "MLS",
    },
    {
      id: `${propertyId}-tx-4`,
      type: "listing",
      date: "2024-10-15",
      description: "Price reduction",
      amount: 429000,
      source: "MLS",
    },
    {
      id: `${propertyId}-tx-5`,
      type: "listing",
      date: "2025-01-10",
      description: "Listing expired, relisted",
      amount: 419000,
      source: "MLS",
    },
    {
      id: `${propertyId}-tx-6`,
      type: "tax",
      date: "2025-01-01",
      description: "Annual property tax assessment",
      amount: 5200,
      source: "County Tax Office",
    },
    {
      id: `${propertyId}-tx-7`,
      type: "ownership",
      date: "2025-03-01",
      description: "Owner name updated in records",
      source: "County Records",
    },
  ];
}

interface PropertyHistoryProps {
  propertyId: string;
}

const transactionIcons: Record<Transaction["type"], React.ReactNode> = {
  purchase: <ShoppingCart className="h-4 w-4" />,
  listing: <Tag className="h-4 w-4" />,
  tax: <Receipt className="h-4 w-4" />,
  ownership: <Users className="h-4 w-4" />,
};

const transactionColors: Record<Transaction["type"], string> = {
  purchase: "bg-[#1a56db] text-white",
  listing: "bg-[#f97316] text-white",
  tax: "bg-[#10b981] text-white",
  ownership: "bg-purple-600 text-white",
};

const transactionLabels: Record<Transaction["type"], string> = {
  purchase: "Purchase",
  listing: "Listing",
  tax: "Tax",
  ownership: "Ownership",
};

export function PropertyHistory({ propertyId }: PropertyHistoryProps) {
  const transactions = generateSampleHistory(propertyId).sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border" />

            {/* Timeline Items */}
            <div className="space-y-6">
              {transactions.map((tx, index) => (
                <div key={tx.id} className="relative flex gap-4">
                  {/* Icon Circle */}
                  <div
                    className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full ${transactionColors[tx.type]}`}
                  >
                    {transactionIcons[tx.type]}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${transactionColors[tx.type]}`}
                          >
                            {transactionLabels[tx.type]}
                          </span>
                        </div>
                        <p className="font-medium mt-1">{tx.description}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(tx.date)}
                          {tx.source && (
                            <span className="ml-2">via {tx.source}</span>
                          )}
                        </p>
                      </div>
                      {tx.amount !== undefined && (
                        <div className="text-right">
                          <p className="text-lg font-bold">{formatCurrency(tx.amount)}</p>
                          <p className="text-xs text-muted-foreground">
                            {tx.type === "listing" ? "Listing Price" : tx.type === "purchase" ? "Sale Price" : "Tax Amount"}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Last Sale Price</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    transactions.find((t) => t.type === "purchase")?.amount || 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-[#1a56db]/10 rounded-full">
                <ShoppingCart className="h-6 w-6 text-[#1a56db]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current List Price</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    transactions.filter((t) => t.type === "listing").sort((a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                    )[0]?.amount || 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-[#f97316]/10 rounded-full">
                <Tag className="h-6 w-6 text-[#f97316]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Annual Taxes</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    transactions.find((t) => t.type === "tax")?.amount || 0
                  )}
                </p>
              </div>
              <div className="p-3 bg-[#10b981]/10 rounded-full">
                <Receipt className="h-6 w-6 text-[#10b981]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
