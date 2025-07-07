import { transactionSchema } from "@/schema/transaction.schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import getStartDateAndEndDate from "@/utils/get-dates";
import { TransactionType } from "@prisma/client";
import z from "zod";

const userId = "65c0d2d242fd32ba15fdee12";

export const budgetRouter = createTRPCRouter({
  upsertBudget: publicProcedure
    .input(
      z.object({
        amount: z.number().min(1).max(1_000_000_000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (!userId) {
        throw new Error("Unauthorized");
      }

      const { startDate, endDate } = getStartDateAndEndDate();

      await ctx.db.budget.upsert({
        where: { userId },
        create: {
          userId,
          amount: input.amount,
          startDate,
          endDate,
        },
        update: {
          amount: input.amount,
          startDate,
          endDate,
        },
      });

      return { success: true };
    }),

  getCurrentBudget: publicProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const isAccount = await ctx.db.account.findUnique({
        where: {
          id: input.accountId,
          isDefaultAccount: true,
        },
      });

      if (!isAccount) throw new Error("Account not found");

      const { endDate, startDate } = getStartDateAndEndDate();

      const expense = await ctx.db.transaction.aggregate({
        where: {
          accountId: input.accountId,
          // date: {
          //   lte: endDate,
          //   gte: startDate,
          // },
          userId,
          type: {
            in: [
              TransactionType.PAYMENT,
              TransactionType.WITHDRAWAL,
              TransactionType.TRANSFER,
            ],
          },
        },
        _sum: {
          amount: true,
        },
      });
      console.log("🚀 ~ .query ~ expense:", expense);

      const budget = await ctx.db.budget.findFirst({
        where: {
          userId,
        },
      });

      return {
        budget: budget ? { ...budget, amount: budget.amount } : null,
        currentExpense: expense._sum.amount ?? 0.0,
      };
    }),
});
