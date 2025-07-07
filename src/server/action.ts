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
