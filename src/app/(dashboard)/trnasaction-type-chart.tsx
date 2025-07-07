"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts";
import { api } from "@/trpc/react";
import { TransactionType } from "@prisma/client";
import React, { useMemo } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Skeleton } from "@/components/ui/skeleton";

const allTransactionTypes: TransactionType[] = [
  "DEPOSIT",
  "WITHDRAWAL",
  "TRANSFER",
  "PAYMENT",
  "REFUND",
];

function TransactionTypeRadarChart() {
  const { data: transactions, isLoading } =
    api.account.getDefaultAccountsTransactions.useQuery();

  const chartData = useMemo(() => {
    const initial: Record<TransactionType, number> = {
      DEPOSIT: 0,
      WITHDRAWAL: 0,
      TRANSFER: 0,
      PAYMENT: 0,
      REFUND: 0,
    };

    if (!transactions)
      return allTransactionTypes.map((type) => ({ type, amount: 0 }));

    const sums = transactions.reduce(
      (acc, tx) => {
        acc[tx.type] += Math.abs(tx.amount);
        return acc;
      },
      { ...initial },
    );

    return allTransactionTypes.map((type) => ({
      type,
      amount: sums[type] || 0,
    }));
  }, [transactions]);

  const chartConfig = {
    amount: {
      label: "Transaction Amount",
      color: "var(--chart-1)",
    },
  } satisfies ChartConfig;

  if (isLoading) return <Skeleton className="h-full w-full rounded-lg" />;

  return (
    <Card>
      <CardHeader className="items-center pb-4">
        <CardTitle>Transaction Type Analysis</CardTitle>
        <CardDescription>Distribution of transactions by type</CardDescription>
      </CardHeader>
      <CardContent className="pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[380px]"
        >
          <RadarChart
            data={chartData}
            outerRadius={90} // Increased radius for better visibility
          >
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent formatter={(value) => `₹${value}`} />
              }
            />
            <PolarGrid gridType="circle" />
            <PolarAngleAxis
              dataKey="type"
              tick={{ fontSize: 12 }} // Adjust font size if needed
            />
            <Radar
              name="Transactions"
              dataKey="amount"
              fill="var(--color-primary)"
              fillOpacity={0.6}
              stroke="var(--color-primary)"
              dot={{
                r: 4,
                fillOpacity: 1,
              }}
            />
          </RadarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

export default TransactionTypeRadarChart;
