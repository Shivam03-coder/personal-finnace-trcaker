import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import getStartDateAndEndDate from "@/utils/get-dates";
import { TransactionType } from "@prisma/client";
import z from "zod";


export const budgetRouter = createTRPCRouter({
  upsertBudget: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(1).max(1_000_000_000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.auth.userId;
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

  getCurrentBudget: protectedProcedure
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

      const userId = ctx.auth.userId;

      if (!isAccount) throw new Error("Account not found");

      const { endDate, startDate } = getStartDateAndEndDate();

      const expense = await ctx.db.transaction.aggregate({
        where: {
          accountId: input.accountId,
          date: {
            lte: endDate,
            gte: startDate,
          },
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
