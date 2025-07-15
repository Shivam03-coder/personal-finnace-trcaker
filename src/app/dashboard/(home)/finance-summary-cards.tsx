"use client";

import type { FinanceCardData } from "@/types/app";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Receipt,
  Wallet,
} from "lucide-react";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import FinanceSummaryCard from "@/components/global/summary-card";

export default function FinanceSummaryCards() {
  const { data, isLoading } = api.account.getSummary.useQuery();

  const summary = {
    totalIncome: data?.totalIncome ?? 0,
    totalExpense: data?.totalExpense ?? 0,
    netIncome: data?.netIncome ?? 0,
    totalBudget: data?.totalBudget ?? 0,
    remainingBalance: data?.remainingBalance ?? 0,
  };

  const cardsData: FinanceCardData[] = [
    {
      id: "income",
      title: "Total Income",
      amount: `₹${summary.totalIncome.toLocaleString("en-IN")}`,
      icon: <IndianRupee className="size-5 text-emerald-600" />,
      statusText: "Excellent savings rate",
      trendIcon: <TrendingUp className="size-4 text-emerald-600" />,
      secondaryText: "Income this month",
    },
    {
      id: "expenses",
      title: "Total Expenses",
      amount: `₹${summary.totalExpense.toLocaleString("en-IN")}`,
      icon: <Receipt className="size-5 text-rose-600" />,
      statusText:
        summary.totalExpense < summary.totalBudget
          ? "Under budget this month"
          : "Over budget",
      trendIcon: <TrendingDown className="size-4 text-rose-600" />,
      secondaryText: "Expenses this month",
    },
    {
      id: "net-income",
      title: "Net Income",
      amount: `₹${summary.netIncome.toLocaleString("en-IN")}`,
      icon: <Wallet className="size-5 text-blue-600" />,
      statusText:
        summary.netIncome >= 0 ? "Positive cash flow" : "Negative cash flow",
      trendIcon:
        summary.netIncome >= 0 ? (
          <TrendingUp className="size-4 text-blue-600" />
        ) : (
          <TrendingDown className="size-4 text-red-600" />
        ),
      secondaryText: `Net gain/loss`,
    },
    {
      id: "budget",
      title: "Total Budget",
      amount: `₹${summary.totalBudget.toLocaleString("en-IN")}`,
      icon: <PiggyBank className="size-5 text-violet-600" />,
      statusText: `₹${summary.remainingBalance.toLocaleString("en-IN")} remaining`,
      trendIcon: null,
      secondaryText: "Monthly allocation",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-4">
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[160px] rounded-2xl" />
          ))
        : cardsData.map((card) => (
            <FinanceSummaryCard key={card.id} data={card} />
          ))}
    </div>
  );
}
