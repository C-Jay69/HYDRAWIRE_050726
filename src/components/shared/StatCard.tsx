import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, LucideIcon } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  trend?: number;
  icon?: LucideIcon;
  className?: string;
}

export function StatCard({ label, value, trend, icon: Icon, className }: StatCardProps) {
  const isPositive = trend && trend > 0;
  const isNegative = trend && trend < 0;

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center gap-2">
        {Icon && <Icon className="h-4 w-4 text-muted-foreground" />}
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold">{value}</span>
        {trend !== undefined && (
          <span
            className={cn(
              "flex items-center text-sm font-medium",
              isPositive && "text-[#10b981]",
              isNegative && "text-[#ef4444]",
              !isPositive && !isNegative && "text-muted-foreground"
            )}
          >
            {isPositive && <TrendingUp className="h-3 w-3 mr-0.5" />}
            {isNegative && <TrendingDown className="h-3 w-3 mr-0.5" />}
            {trend > 0 ? "+" : ""}
            {trend.toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}
