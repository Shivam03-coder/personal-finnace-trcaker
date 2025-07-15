"use client";

import { TrendingUp } from "lucide-react";
import React, { useMemo } from "react";
import { subDays, startOfDay, format } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TransactionType } from "@prisma/client";

import { api } from "@/trpc/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const LastSevenDaysNetTransaction = () => {
  const {
    data: transactions = [],
    isLoading,
    error,
  } = api.transaction.getLast7DaysSummary.useQuery();

  const today = new Date();

  const chartData = useMemo(() => {
    const dates = Array.from({ length: 7 })
      .map((_, i) => startOfDay(subDays(today, i)))
      .reverse();

    const summary: Record<
      string,
      { income: number; expense: number; net: number }
    > = {};

    for (const d of dates) {
      const dateKey = d.toISOString().split("T")[0] as string;
      summary[dateKey] = { income: 0, expense: 0, net: 0 };
    }

    for (const tx of transactions) {
      const txDateKey = startOfDay(new Date(tx.date))
        .toISOString()
        .split("T")[0] as string;
      if (!summary[txDateKey]) continue;

      const isIncome =
        tx.type === TransactionType.DEPOSIT ||
        tx.type === TransactionType.REFUND;
      const isExpense =
        tx.type === TransactionType.WITHDRAWAL ||
        tx.type === TransactionType.PAYMENT ||
        tx.type === TransactionType.TRANSFER;

      if (isIncome) {
        summary[txDateKey].income += tx.amount;
        summary[txDateKey].net += tx.amount;
      } else if (isExpense) {
        summary[txDateKey].expense += tx.amount;
        summary[txDateKey].net -= tx.amount;
      }
    }

    return dates.map((d) => {
      const dateKey = d.toISOString().split("T")[0];
      const { income, expense, net } = summary[dateKey!]!;
      return {
        date: format(d, "MMM d"),
        Income: income,
        Expense: expense,
        Net: net,
      };
    });
  }, [transactions, today]);

  if (isLoading) return <Skeleton className="w-full col-span-2 min-h-[400px] rounded-lg" />;

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Net Transactions - Last 7 Days</CardTitle>
        <CardDescription>Daily income and expenses overview</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `₹${v}`}
            />
            <Tooltip
              cursor={{ fill: "var(--muted)" }}
              contentStyle={{ borderRadius: 8, fontFamily: "font-lexend" }}
              formatter={(value: number) => `₹${value.toFixed(2)}`}
            />
            <Bar dataKey="Income" fill="var(--chart-1)" radius={4} />
            <Bar dataKey="Expense" fill="var(--chart-2)" radius={4} />
            <Bar dataKey="Net" fill="var(--chart-3)" radius={4} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default LastSevenDaysNetTransaction;
