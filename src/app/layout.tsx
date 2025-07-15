import "@/styles/globals.css";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import AppRootProvider from "@/providers/app-providers";
import { appfonts } from "@/fonts";
import { ClerkProvider } from "@clerk/nextjs";

export const metadata: Metadata = {
  title: {
    default: "FinTrack | Personal Finance Dashboard",
    template: "%s | FinTrack",
  },
  description:
    "Take control of your finances with FinTrack - Budgeting, expense tracking, and financial insights in one place.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html suppressHydrationWarning lang="en" className={appfonts}>
      <body>
        <TRPCReactProvider>
          <ClerkProvider afterSignOutUrl="/sign-in">
            <AppRootProvider>
              <main className="flex min-h-screen flex-col">{children}</main>
            </AppRootProvider>
          </ClerkProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
