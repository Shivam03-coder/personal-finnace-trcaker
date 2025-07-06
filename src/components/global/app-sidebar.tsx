"use client";

import {
  IconDashboard,
  IconInnerShadowTop,
  IconPigMoney,
  IconReceipt,
  IconTrendingUp,
  IconWallet,
} from "@tabler/icons-react";

import { NavMain } from "@/components/global/nav-main";
import { NavUser } from "@/components/global/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "next-view-transitions";

const data = {
  user: {
    name: "Alex Johnson",
    email: "alex@example.com",
    avatar: "/avatars/alex.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Accounts",
      url: "/accounts",
      icon: IconWallet,
    },
    {
      title: "Transactions",
      url: "/transactions",
      icon: IconReceipt,
    },
    {
      title: "Budgets",
      url: "/budgets",
      icon: IconPigMoney,
    },
    {
      title: "Investments",
      url: "/investments",
      icon: IconTrendingUp,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">FIN-TRACK APP</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
