"use client";

import * as React from "react";
import {
  Eye,
  ListPlus,
  CreditCard,
  Search,
  TrendingUp,
  Clock,
  MapPin,
  FileText,
  Zap,
  Plus,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

function StatCard({ title, value, description, icon: Icon, trend, color }: StatCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={cn("p-2 rounded-lg", color)}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-bold">{value}</span>
          {trend && (
            <span
              className={cn(
                "text-xs font-medium flex items-center",
                trend.isPositive ? "text-emerald-500" : "text-red-500"
              )}
            >
              <TrendingUp
                className={cn(
                  "h-3 w-3 mr-0.5",
                  !trend.isPositive && "rotate-180"
                )}
              />
              {trend.value}%
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </CardContent>
    </Card>
  );
}

interface ActivityItemProps {
  icon: React.ElementType;
  title: string;
  description: string;
  time: string;
  color: string;
}

function ActivityItem({ icon: Icon, title, description, time, color }: ActivityItemProps) {
  return (
    <div className="flex items-start gap-4 py-3">
      <div className={cn("p-2 rounded-lg", color)}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate">{title}</p>
        <p className="text-xs text-muted-foreground truncate">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground whitespace-nowrap">{time}</span>
    </div>
  );
}

interface QuickActionProps {
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

function QuickAction({ title, description, icon: Icon, color }: QuickActionProps) {
  return (
    <button className="flex items-center gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors text-left w-full">
      <div className={cn("p-3 rounded-lg", color)}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-muted-foreground" />
    </button>
  );
}

// Mock user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  initials: "JD",
};

// Mock stats
const stats = [
  {
    title: "Properties Viewed",
    value: 1247,
    description: "Last 30 days",
    icon: Eye,
    trend: { value: 12, isPositive: true },
    color: "bg-[#1a56db]",
  },
  {
    title: "Lists Created",
    value: 8,
    description: "3 active lists",
    icon: ListPlus,
    trend: { value: 2, isPositive: true },
    color: "bg-[#f97316]",
  },
  {
    title: "Credits Remaining",
    value: 342,
    description: "Out of 500/month",
    icon: CreditCard,
    color: "bg-[#10b981]",
  },
  {
    title: "Active Searches",
    value: 5,
    description: "2 new matches",
    icon: Search,
    trend: { value: 25, isPositive: true },
    color: "bg-[#8b5cf6]",
  },
];

// Mock recent activity
const recentActivity = [
  {
    icon: MapPin,
    title: "New property match found",
    description: "123 Oak Street, Austin, TX - matches your 'Austin Investors' search",
    time: "2m ago",
    color: "bg-[#1a56db]",
  },
  {
    icon: FileText,
    title: "List exported",
    description: "Foreclosure leads - Houston Area exported to CSV",
    time: "15m ago",
    color: "bg-[#f97316]",
  },
  {
    icon: Zap,
    title: "Skip trace completed",
    description: "25 new phone numbers added to 'Texas Investors' list",
    time: "1h ago",
    color: "bg-[#10b981]",
  },
  {
    icon: Clock,
    title: "Campaign launched",
    description: 'Summer Investor Blast - 1,247 recipients',
    time: "3h ago",
    color: "bg-[#8b5cf6]",
  },
  {
    icon: Search,
    title: "Search saved",
    description: "Pre-foreclosures in Harris County, TX",
    time: "5h ago",
    color: "bg-[#1a56db]",
  },
];

// Quick actions
const quickActions = [
  {
    title: "New Property Search",
    description: "Search properties by address, city, or criteria",
    icon: Search,
    color: "bg-[#1a56db]",
  },
  {
    title: "Create Lead List",
    description: "Build and manage your property lead lists",
    icon: ListPlus,
    color: "bg-[#f97316]",
  },
  {
    title: "Run Skip Trace",
    description: "Get phone numbers and emails for your leads",
    icon: Zap,
    color: "bg-[#10b981]",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 lg:p-8 pb-24 md:pb-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user.name.split(" ")[0]}
          </h1>
          <p className="text-muted-foreground mt-1">
            Here&apos;s what&apos;s happening with your property investments today.
          </p>
        </div>
        <Button className="bg-[#1a56db] hover:bg-[#1a4bc7] w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          New Search
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity - Takes 2 columns on large screens */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest property and campaign updates</CardDescription>
              </div>
              <Button variant="ghost" size="sm" className="text-[#1a56db]">
                View All
                <ArrowRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="divide-y">
              {recentActivity.map((activity, index) => (
                <ActivityItem key={index} {...activity} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {quickActions.map((action, index) => (
              <QuickAction key={index} {...action} />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
