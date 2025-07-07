"use client";

import { TrendingUp, Wallet, Pencil } from "lucide-react";
import { Pie, PieChart, Cell, ResponsiveContainer } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useReadLocalStorage } from "usehooks-ts";
import { api } from "@/trpc/react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const COLORS = ["#0088FE", "#FF8042"];

function BudgetPieChart() {
  const defaultAccountId = useReadLocalStorage("default_accountId") as string;
  const [isEditing, setIsEditing] = useState(false);

  const { data, isLoading, error } = api.budget.getCurrentBudget.useQuery({
    accountId: defaultAccountId,
  });

  if (isLoading) return <Skeleton className="h-[300px] w-full rounded-lg" />;
  if (error)
    return (
      <div className="p-4 text-center text-red-500">
        Error loading budget data
      </div>
    );

  const remaining = Math.max(
    0,
    (data?.budget?.amount ?? 0) - (data?.currentExpense ?? 0),
  );
  const expenses = data?.currentExpense ?? 0;
  const budgetPercentage = data?.budget
    ? ((expenses / data.budget.amount) * 100).toFixed(1)
    : "0";

  const chartData = [
    { name: "Remaining", value: remaining },
    { name: "Expenses", value: expenses },
  ];

  return (
    <Card className="h-full shadow-amber-200 shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wallet className="text-primary h-5 w-5" />
            <CardDescription className="text-sm">
              Budget Overview
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 rounded-full p-0"
            onClick={() => setIsEditing(!isEditing)}
          >
            <Pencil className="h-4 w-4" />
            <span className="sr-only">Edit budget</span>
          </Button>
        </div>
        <CardTitle className="pt-1 text-3xl font-semibold">
          ₹{(data?.budget?.amount ?? 0).toLocaleString("en-IN")}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col items-center gap-6 px-4">
        <div className="relative h-40 w-full max-w-xs">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">Used</p>
              <p
                className={`text-xl font-medium ${
                  Number(budgetPercentage) > 75
                    ? "text-amber-500"
                    : "text-green-500"
                }`}
              >
                {budgetPercentage}%
              </p>
            </div>
          </div>
        </div>

        <div className="w-full max-w-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#0088FE]" />
              <span className="text-sm">Remaining</span>
            </div>
            <span className="text-sm font-medium">
              ₹
              {remaining.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#FF8042]" />
              <span className="text-sm">Expenses</span>
            </div>
            <span className="text-sm font-medium">
              ₹
              {expenses.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default BudgetPieChart;
