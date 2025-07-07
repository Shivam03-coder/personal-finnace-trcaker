"use server";
import type { PrismaClient } from "@prisma/client";
import { db } from "./db";
import { getDateRange } from "@/utils/get-dates";
import { userId } from "./api/routers/budget";

export async function ReceiptScanner(file: File) {
  try {
  } catch (error) {}
}

export async function getDefaultAccountId() {
  return await db.account
    .findFirst({
      where: {
        isDefaultAccount: true,
      },
    })
    .then((value) => value?.id);
}

export const getTransactions = async (prisma: PrismaClient, days: number) => {
  const { startDate, endDate } = getDateRange(days);

  return await prisma.transaction.findMany({
    where: {
      userId: userId,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    select: {
      id: true,
      amount: true,
      type: true,
      date: true,
      description: true,
    },
    orderBy: {
      date: "asc",
    },
  });
};

export const getTotalExpenseAndIncomeAllAccounts = async () => {
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const expensesResult = await db.transaction.aggregate({
    where: {
      userId,
      type: {
        in: ["PAYMENT", "TRANSFER", "WITHDRAWAL"],
      },
      date: { gte: startOfMonth },
      status: "COMPLETED",
    },
    _sum: {
      amount: true,
    },
  });
  const totalExpense = expensesResult._sum.amount ?? 0;

  const incomeResult = await db.transaction.aggregate({
    where: {
      userId,
      type: {
        in: ["DEPOSIT", "WITHDRAWAL"],
      },
      date: { gte: startOfMonth },
    },
    _sum: {
      amount: true,
    },
  });
  const totalIncome = incomeResult._sum.amount ?? 0;

  const netIncome = totalIncome - totalExpense;

  const budget = await db.budget.findUnique({
    where: { userId },
  });
  const totalBudget = budget?.amount ?? 0;

  const remainingBalance = totalBudget - totalExpense;

  return {
    totalExpense,
    totalIncome,
    netIncome,
    totalBudget,
    remainingBalance,
  };
};
