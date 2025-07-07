import { transactionSchema } from "@/schema/transaction.schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import z from "zod";
import { subDays, startOfDay } from "date-fns";
import { getDefaultAccountId } from "@/server/action";
import { getIncrementAndDecrementOfAmount } from "@/utils/get-amount";

export const transactionRouter = createTRPCRouter({
  createTransactions: publicProcedure
    .input(transactionSchema)
    .mutation(async ({ ctx, input }) => {
      const acc = await ctx.db.account.findUnique({
        where: {
          id: input.accountId,
          isDefaultAccount: true,
        },
      });

      if (!acc) throw new Error("Account not found");

      const transactionType = input.type;

      await ctx.db.$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            ...input,
            userId: "65c0d2d242fd32ba15fdee12",
            accountId: input.accountId as string,
          },
        });

        await tx.account.update({
          where: {
            id: acc.id,
          },
          data: {
            accountBalance: getIncrementAndDecrementOfAmount(
              transactionType,
              acc.accountBalance,
            ),
          },
        });
      });
    }),

  getTransactions: publicProcedure.query(async ({ ctx, input }) => {
    return ctx.db.transaction.findMany({
      select: {
        id: true,
        amount: true,
        date: true,
        currency: true,
        description: true,
        isRecurring: true,
        status: true,
        recurringInterval: true,
        tags: true,
        type: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  getTransactionsByAccounts: publicProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      return ctx.db.transaction.findMany({
        where: { accountId: input.accountId },
        select: {
          id: true,
          amount: true,
          date: true,
          currency: true,
          description: true,
          isRecurring: true,
          status: true,
          recurringInterval: true,
          tags: true,
          type: true,
        },
      });
    }),

  deleteTransaction: publicProcedure
    .input(
      z.object({
        transactionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.transaction.delete({
        where: {
          id: input.transactionId,
        },
      });
    }),

  getLast7DaysSummary: publicProcedure.query(async ({ ctx }) => {
    const today = new Date();
    const sevenDaysAgo = subDays(startOfDay(today), 6);

    const transactions = await ctx.db.transaction.findMany({
      where: {
        date: {
          gte: sevenDaysAgo,
          lte: today,
        },
      },
      select: {
        amount: true,
        type: true,
        date: true,
      },
    });

    return transactions;
  }),

  getDefaultAccountsTransactions: publicProcedure.query(async ({ ctx }) => {
    const accountId = await getDefaultAccountId();

    return await ctx.db.transaction.findMany({
      where: {
        accountId,
      },
      select: {
        id: true,
        amount: true,
        date: true,
        currency: true,
        description: true,
        isRecurring: true,
        status: true,
        recurringInterval: true,
        tags: true,
        type: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),
});
