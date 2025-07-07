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

// Expense data for different categories
const expenseData = [
  {
    date: "2024-04-01",
    food: 1200,
    transport: 500,
    entertainment: 800,
    bills: 2500,
  },
  { date: "2024-04-02", food: 800, transport: 300, entertainment: 0, bills: 0 },
  {
    date: "2024-04-03",
    food: 1500,
    transport: 700,
    entertainment: 1200,
    bills: 0,
  },
  {
    date: "2024-04-04",
    food: 900,
    transport: 400,
    entertainment: 500,
    bills: 3500,
  },
  {
    date: "2024-04-05",
    food: 1800,
    transport: 600,
    entertainment: 1500,
    bills: 0,
  },
  {
    date: "2024-04-06",
    food: 700,
    transport: 200,
    entertainment: 2000,
    bills: 0,
  },
  {
    date: "2024-04-07",
    food: 1200,
    transport: 500,
    entertainment: 300,
    bills: 0,
  },
  {
    date: "2024-04-08",
    food: 1000,
    transport: 400,
    entertainment: 700,
    bills: 2800,
  },
  { date: "2024-04-09", food: 600, transport: 300, entertainment: 0, bills: 0 },
  {
    date: "2024-04-10",
    food: 1300,
    transport: 450,
    entertainment: 900,
    bills: 0,
  },
  {
    date: "2024-04-11",
    food: 950,
    transport: 350,
    entertainment: 1100,
    bills: 3200,
  },
  {
    date: "2024-04-12",
    food: 1100,
    transport: 500,
    entertainment: 600,
    bills: 0,
  },
  {
    date: "2024-04-13",
    food: 1400,
    transport: 600,
    entertainment: 1800,
    bills: 0,
  },
  {
    date: "2024-04-14",
    food: 800,
    transport: 200,
    entertainment: 400,
    bills: 0,
  },
  {
    date: "2024-04-15",
    food: 1600,
    transport: 700,
    entertainment: 1200,
    bills: 2700,
  },
  { date: "2024-04-16", food: 750, transport: 300, entertainment: 0, bills: 0 },
  {
    date: "2024-04-17",
    food: 900,
    transport: 400,
    entertainment: 700,
    bills: 3100,
  },
  {
    date: "2024-04-18",
    food: 1700,
    transport: 650,
    entertainment: 1500,
    bills: 0,
  },
  {
    date: "2024-04-19",
    food: 850,
    transport: 350,
    entertainment: 500,
    bills: 0,
  },
  {
    date: "2024-04-20",
    food: 1100,
    transport: 450,
    entertainment: 900,
    bills: 2900,
  },
  {
    date: "2024-04-21",
    food: 600,
    transport: 200,
    entertainment: 300,
    bills: 0,
  },
  {
    date: "2024-04-22",
    food: 1300,
    transport: 500,
    entertainment: 1100,
    bills: 0,
  },
  {
    date: "2024-04-23",
    food: 950,
    transport: 400,
    entertainment: 600,
    bills: 3300,
  },
  {
    date: "2024-04-24",
    food: 1200,
    transport: 550,
    entertainment: 800,
    bills: 0,
  },
  {
    date: "2024-04-25",
    food: 800,
    transport: 300,
    entertainment: 400,
    bills: 0,
  },
  {
    date: "2024-04-26",
    food: 1500,
    transport: 600,
    entertainment: 1300,
    bills: 3000,
  },
  {
    date: "2024-04-27",
    food: 700,
    transport: 250,
    entertainment: 500,
    bills: 0,
  },
  {
    date: "2024-04-28",
    food: 1000,
    transport: 400,
    entertainment: 700,
    bills: 0,
  },
  {
    date: "2024-04-29",
    food: 1400,
    transport: 550,
    entertainment: 1000,
    bills: 3400,
  },
  {
    date: "2024-04-30",
    food: 900,
    transport: 350,
    entertainment: 600,
    bills: 0,
  },
];

const chartConfig = {
  total: {
    label: "Total Expenses",
  },
  food: {
    label: "Food",
    color: "var(--food-color)",
  },
  transport: {
    label: "Transport",
    color: "var(--transport-color)",
  },
  entertainment: {
    label: "Entertainment",
    color: "var(--entertainment-color)",
  },
  bills: {
    label: "Bills",
    color: "var(--bills-color)",
  },
} satisfies ChartConfig;

export default function DailyExpenseChart() {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = useState<string>("30d");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = expenseData.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-04-30");
    let daysToSubtract = 30;
    if (timeRange === "90d") {
      daysToSubtract = 90;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const dataWithTotals = filteredData.map((item) => ({
    ...item,
    total: item.food + item.transport + item.entertainment + item.bills,
  }));

  const displayData =
    selectedCategory === "all"
      ? dataWithTotals
      : dataWithTotals.map((item) => ({
          date: item.date,
          [selectedCategory]: item[selectedCategory as keyof typeof item],
        }));

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Expense Tracker</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Track your spending over time
          </span>
          <span className="@[540px]/card:hidden">Your spending trends</span>
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

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Select category"
            >
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all" className="rounded-lg">
                All categories
              </SelectItem>
              <SelectItem value="food" className="rounded-lg">
                Food
              </SelectItem>
              <SelectItem value="transport" className="rounded-lg">
                Transport
              </SelectItem>
              <SelectItem value="entertainment" className="rounded-lg">
                Entertainment
              </SelectItem>
              <SelectItem value="bills" className="rounded-lg">
                Bills
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
          <AreaChart data={displayData}>
            <defs>
              <linearGradient id="fillFood" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillTransport" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient
                id="fillEntertainment"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillBills" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#f97316" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.1} />
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

            {selectedCategory === "all" ? (
              <>
                <Area
                  dataKey="food"
                  type="natural"
                  fill="url(#fillFood)"
                  stroke="#22c55e"
                  stackId="1"
                />
                <Area
                  dataKey="transport"
                  type="natural"
                  fill="url(#fillTransport)"
                  stroke="#3b82f6"
                  stackId="1"
                />
                <Area
                  dataKey="entertainment"
                  type="natural"
                  fill="url(#fillEntertainment)"
                  stroke="#f43f5e"
                  stackId="1"
                />
                <Area
                  dataKey="bills"
                  type="natural"
                  fill="url(#fillBills)"
                  stroke="#f97316"
                  stackId="1"
                />
              </>
            ) : (
              <Area
                dataKey={selectedCategory}
                type="natural"
                fill={`url(#fill${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)})`}
                stroke={"#8b5cf6"}
              />
            )}
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
