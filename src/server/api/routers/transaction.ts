import { transactionSchema } from "@/schema/transaction.schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import z from "zod";
import { subDays, startOfDay } from "date-fns";
import { getDefaultAccountId, getTransactions } from "@/server/action";
import {
  applyTransactionEffect,
  getIncrementAndDecrementOfAmount,
  reverseTransactionEffect,
} from "@/utils/get-amount";

export const transactionRouter = createTRPCRouter({
  createTransactions: protectedProcedure
    .input(transactionSchema)
    .mutation(async ({ ctx, input }) => {
      const accountId = await getDefaultAccountId();

      const acc = await ctx.db.account.findUnique({
        where: {
          id: accountId,
        },
      });

      if (!acc) throw new Error("Account not found");

      const transactionType = input.type;

      await ctx.db.$transaction(async (tx) => {
        await tx.transaction.create({
          data: {
            ...input,
            userId: ctx.auth.userId,
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

  getTransactions: protectedProcedure.query(async ({ ctx, input }) => {
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

  getTransactionsByAccounts: protectedProcedure
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

  deleteTransaction: protectedProcedure
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

  getLast7DaysSummary: protectedProcedure.query(async ({ ctx }) => {
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

  getDefaultAccountsTransactions: protectedProcedure.query(async ({ ctx }) => {
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

  getDailySummary: protectedProcedure
    .input(z.object({ days: z.number().min(1).max(365).default(7) }))
    .query(async ({ ctx, input }) => {
      const transactions = await getTransactions(ctx.db, input.days, ctx.auth.userId);

      const dates = Array.from({ length: input.days })
        .map((_, i) => {
          const d = subDays(new Date(), i);
          return startOfDay(d).toISOString().split("T")[0];
        })
        .reverse();

      const dailySummary: Record<
        string,
        { income: number; expense: number; net: number }
      > = {};

      for (const date of dates) {
        dailySummary[date!] = { income: 0, expense: 0, net: 0 };
      }

      for (const tx of transactions) {
        const txDate = startOfDay(tx.date)
          .toISOString()
          .split("T")[0] as string;
        if (!dailySummary[txDate]) continue;

        const isIncome = tx.type === "DEPOSIT" || tx.type === "REFUND";
        const isExpense =
          tx.type === "WITHDRAWAL" ||
          tx.type === "PAYMENT" ||
          tx.type === "TRANSFER";

        if (isIncome) {
          dailySummary[txDate].income += tx.amount;
          dailySummary[txDate].net += tx.amount;
        } else if (isExpense) {
          dailySummary[txDate].expense += tx.amount;
          dailySummary[txDate].net -= tx.amount;
        }
      }

      return dates.map((date) => ({
        date,
        ...dailySummary[date!],
      }));
    }),

  editTransaction: protectedProcedure
    .input(
      transactionSchema.extend({
        id: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;
      const accountId = await getDefaultAccountId();
      const [account, existingTransaction] = await Promise.all([
        ctx.db.account.findUnique({
          where: {
            id: accountId,
            isDefaultAccount: true,
          },
        }),
        ctx.db.transaction.findUnique({
          where: { id },
        }),
      ]);

      if (!account) throw new Error("Account not found");
      if (!existingTransaction) throw new Error("Transaction not found");

      await ctx.db.$transaction(async (tx) => {
        await tx.account.update({
          where: { id: account.id },
          data: {
            accountBalance: reverseTransactionEffect(
              existingTransaction.type,
              account.accountBalance,
              existingTransaction.amount,
            ),
          },
        });

        const updatedTransaction = await tx.transaction.update({
          where: { id },
          data: updateData,
        });

        await tx.account.update({
          where: { id: account.id },
          data: {
            accountBalance: applyTransactionEffect(
              input.type,
              account.accountBalance,
              input.amount,
            ),
          },
        });

        return updatedTransaction;
      });
    }),
});
