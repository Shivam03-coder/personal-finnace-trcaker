import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { type CSSProperties, type ReactNode } from "react";
import { SiteHeader } from "@/components/global/site-header";
import { AppSidebar } from "@/components/global/app-sidebar";

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
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
