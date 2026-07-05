import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const statusColors: Record<string, string> = {
  active: "bg-[#1a56db] text-white",
  off_market: "bg-gray-500 text-white",
  pre_foreclosure: "bg-[#f97316] text-white",
  foreclosure: "bg-[#ef4444] text-white",
  auction: "bg-purple-600 text-white",
  reo: "bg-[#ef4444] text-white",
  pending: "bg-yellow-500 text-white",
  sold: "bg-green-600 text-white",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  off_market: "Off Market",
  pre_foreclosure: "Pre-Foreclosure",
  foreclosure: "Foreclosure",
  auction: "Auction",
  reo: "REO",
  pending: "Pending",
  sold: "Sold",
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const colorClass = statusColors[status.toLowerCase()] || "bg-gray-500 text-white";
  const label = statusLabels[status.toLowerCase()] || status.toUpperCase();

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wide",
        colorClass,
        className
      )}
    >
      {label}
    </span>
  );
}
