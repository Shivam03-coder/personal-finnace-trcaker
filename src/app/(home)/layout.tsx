import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { type ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SectionCards } from "@/components/section-cards";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";

interface RootLayoutProps {
  children: ReactNode;
  summary_cards: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
};

export default RootLayout;
