import { accountSchema } from "@/schema/account.schema";
import { getTotalExpenseAndIncomeAllAccounts } from "@/server/action";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import z from "zod";

export const accountRouter = createTRPCRouter({
  createAccount: protectedProcedure
    .input(accountSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.isDefaultAccount) {
        await ctx.db.account.updateMany({ data: { isDefaultAccount: false } });
      }

      const userId = ctx.auth.userId;

      return ctx.db.account.create({
        data: {
          accountName: input.accountName,
          accountType: input.accountType,
          accountBalance: input.accountBalance,
          isDefaultAccount: input.isDefaultAccount,
          userId,
        },
      });
    }),

  getAccountDetails: protectedProcedure.query(async ({ ctx }) => {
    const acc = await ctx.db.account.findMany({
      select: {
        id: true,
        accountName: true,
        accountBalance: true,
        accountType: true,
        currency: true,
        status: true,
        createdAt: true,
        isDefaultAccount: true,
      },
    });

    return {
      defaultAccountId: acc.find((a) => a.isDefaultAccount === true)?.id,
      accounts: acc,
    };
  }),

  deleteAccount: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.account.delete({
        where: {
          id: input.accountId,
        },
      });
    }),

  updateDefaultAccount: protectedProcedure
    .input(
      z.object({
        accountId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.$transaction(async (tx) => {
        await tx.account.updateMany({ data: { isDefaultAccount: false } });
        await tx.account.update({
          where: {
            id: input.accountId,
          },
          data: {
            isDefaultAccount: true,
          },
        });
      });
    }),

  getDefaultAccountsTransactions: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.transaction.findMany({
      where: {
        status: "COMPLETED",
      },
      select: {
        amount: true,
        type: true,
      },
    });
  }),

  getSummary: protectedProcedure.query(async () => {
    return await getTotalExpenseAndIncomeAllAccounts();
  }),
});
