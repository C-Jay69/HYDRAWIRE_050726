"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, List, Mail, BarChart3, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useMobile } from "@/hooks/use-mobile";

interface MobileNavProps {
  className?: string;
}

const mobileNavItems = [
  { title: "Search", href: "/search", icon: Map },
  { title: "Lists", href: "/lists", icon: List },
  { title: "Campaigns", href: "/campaigns", icon: Mail },
  { title: "Analytics", href: "/analytics", icon: BarChart3 },
  { title: "More", href: "/more", icon: MoreHorizontal },
];

export function MobileNav({ className }: MobileNavProps) {
  const pathname = usePathname();
  const isMobile = useMobile();

  if (!isMobile) {
    return null;
  }

  return (
    <nav
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden",
        className
      )}
    >
      <div className="flex items-center justify-around h-16 px-2">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 py-2 px-3 rounded-lg transition-colors",
                isActive
                  ? "text-[#1a56db]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.title}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
