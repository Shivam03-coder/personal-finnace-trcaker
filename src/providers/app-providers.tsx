"use client";
import { Toaster } from "@/components/ui/sonner";
import { ViewTransitions } from "next-view-transitions";
const AppRootProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ViewTransitions>
      <Toaster />
      <div className="flex min-h-screen w-full flex-col">{children}</div>
    </ViewTransitions>
  );
};

export default AppRootProvider;
