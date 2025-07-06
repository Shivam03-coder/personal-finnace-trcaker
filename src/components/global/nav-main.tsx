"use client";

import {
  IconCirclePlusFilled,
  IconMail,
  IconMoneybag,
  type Icon,
} from "@tabler/icons-react";

import { Button } from "@/components/ui/button";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "next-view-transitions";
import { ArrowLeftRight } from "lucide-react";
import { useCallback, useState } from "react";
import AddTransactionSheet from "@/app/(dashboard)/transactions/add-transaction-dialog";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: Icon;
  }[];
}) {
  const [open, setOpen] = useState<boolean>(false);
  const handleQuickCreateTransaction = useCallback(() => {
    setOpen(true);
  }, []);

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              tooltip="Quick Create Transaction"
              className="bg-primary text-primary-foreground hover:bg-primary/90 active:bg-primary/90 min-w-8 duration-200 ease-linear"
              onClick={handleQuickCreateTransaction}
            >
              <IconMoneybag />
              <span>Create Transaction</span>
            </SidebarMenuButton>

            {open && <AddTransactionSheet open={open} setOpen={setOpen} />}

            <Button
              size="icon"
              className="size-8 group-data-[collapsible=icon]:opacity-0"
              variant="outline"
            >
              <ArrowLeftRight />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <Link key={item.title} href={item.url}>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </Link>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
