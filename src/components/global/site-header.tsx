import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { IconInnerShadowTop } from "@tabler/icons-react";
import { Github } from "lucide-react";
import { Link } from "next-view-transitions";

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Link className="flex items-center gap-x-2" href="/">
          <IconInnerShadowTop className="!size-5" />
          <span className="text-base font-semibold">FIN-TRACK APP</span>
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <a
            href="https://github.com/shadcn-ui/ui/tree/main/apps/v4/app/(examples)/dashboard"
            rel="noopener noreferrer"
            target="_blank"
            className="dark:text-foreground bg-amber-100 p-2 rounded-full"
          >
            <Github />
          </a>
        </div>
      </div>
    </header>
  );
}
