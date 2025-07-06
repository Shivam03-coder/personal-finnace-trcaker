import { transactionSchema } from "@/schema/transaction.schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import z from "zod";

export const transactionRouter = createTRPCRouter({
  createTransactions: publicProcedure
    .input(transactionSchema)
    .mutation(async ({ ctx, input }) => {
      const isAccount = await ctx.db.account.findUnique({
        where: {
          id: input.accountId,
          isDefaultAccount: true,
        },
      });

      if (!isAccount) throw new Error("Account not found");

      await ctx.db.transaction.create({
        data: {
          ...input,
          userId: "65c0d2d242fd32ba15fdee12",
          accountId: input.accountId as string,
        },
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
});
