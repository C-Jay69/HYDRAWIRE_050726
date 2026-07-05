"use client";

import * as React from "react";
import { Header } from "./Header";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { useMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const isMobile = useMobile();
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header onMenuClick={() => {}} />

      <div className="flex">
        {/* Desktop Sidebar */}
        {!isMobile && (
          <Sidebar
            defaultCollapsed={sidebarCollapsed}
            className="hidden lg:flex fixed left-0 top-16 bottom-0 z-40"
          />
        )}

        {/* Main Content */}
        <main
          className={cn(
            "flex-1 min-h-[calc(100vh-4rem)] transition-all duration-300",
            !isMobile && !sidebarCollapsed && "lg:ml-[280px]",
            !isMobile && sidebarCollapsed && "lg:ml-16"
          )}
        >
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
}
