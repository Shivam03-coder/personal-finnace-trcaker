import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import React, { type ReactNode } from "react";
import { AppSidebar } from "./app-sidebar";
import { SiteHeader } from "@/components/site-header";

interface RootLayoutProps {
  finance_summary_cards: ReactNode;
  daily_expense_chart: ReactNode;
  transaction_data_table: ReactNode;
}

const RootLayout = ({
  finance_summary_cards,
  daily_expense_chart,
  transaction_data_table,
}: RootLayoutProps) => {
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
        <div className="page">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {finance_summary_cards}
              <div className="px-4 lg:px-6">{daily_expense_chart}</div>
              {transaction_data_table}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default RootLayout;
