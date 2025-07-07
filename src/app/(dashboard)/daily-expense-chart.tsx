"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Card,
  CardAction,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useEffect, useState } from "react";
import { api } from "@/trpc/react";

const chartConfig = {
  income: {
    label: "Income",
    color: "var(--income-color)",
  },
  expense: {
    label: "Expense",
    color: "var(--expense-color)",
  },
  net: {
    label: "Net",
    color: "var(--net-color)",
  },
} satisfies ChartConfig;

export default function DailyExpenseChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [selectedView, setSelectedView] = useState<
    "income" | "expense" | "net"
  >("net");

  const { data: transactions = [] } = api.transaction.getDailySummary.useQuery({
    days: timeRange === "7d" ? 7 : timeRange === "30d" ? 30 : 90,
  });

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  // Process the data for the chart
  const chartData = transactions.map((item) => ({
    date: item.date,
    income: item.income,
    expense: item.expense,
    net: item.net,
  }));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Transaction Summary</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Track your income and expenses over time
          </span>
          <span className="@[540px]/card:hidden">Your transaction trends</span>
        </CardDescription>
        <CardAction className="flex flex-col gap-4 sm:flex-row">
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="30d">Last 30 days</ToggleGroupItem>
            <ToggleGroupItem value="90d">Last 3 months</ToggleGroupItem>
            <ToggleGroupItem value="7d">Last 7 days</ToggleGroupItem>
          </ToggleGroup>

          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Last 30 days" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={selectedView}
            onValueChange={(v) =>
              setSelectedView(v as "income" | "expense" | "net")
            }
          >
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Select view"
            >
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="net" className="rounded-lg">
                Net Balance
              </SelectItem>
              <SelectItem value="income" className="rounded-lg">
                Income
              </SelectItem>
              <SelectItem value="expense" className="rounded-lg">
                Expenses
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="fillIncome" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillExpense" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillNet" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                  indicator="dot"
                  formatter={(value) => `₹${value}`}
                />
              }
            />

            {selectedView === "net" ? (
              <Area
                dataKey="net"
                type="natural"
                fill="url(#fillNet)"
                stroke="#3b82f6"
              />
            ) : selectedView === "income" ? (
              <Area
                dataKey="income"
                type="natural"
                fill="url(#fillIncome)"
                stroke="#22c55e"
              />
            ) : (
              <Area
                dataKey="expense"
                type="natural"
                fill="url(#fillExpense)"
                stroke="#f43f5e"
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
