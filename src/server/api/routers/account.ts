import { accountSchema } from "@/schema/account.schema";
import {
  getDefaultAccountId,
  getTotalExpenseAndIncomeCurrentAccount,
} from "@/server/action";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import z from "zod";

export const accountRouter = createTRPCRouter({
  createAccount: publicProcedure
    .input(accountSchema)
    .mutation(async ({ ctx, input }) => {
      if (input.isDefaultAccount) {
        await ctx.db.account.updateMany({ data: { isDefaultAccount: false } });
      }

      return ctx.db.account.create({
        data: {
          accountName: input.accountName,
          accountType: input.accountType,
          accountBalance: input.accountBalance,
          isDefaultAccount: input.isDefaultAccount,
          userId: "65c0d2d242fd32ba15fdee12",
        },
      });
    }),

  getAccountDetails: publicProcedure.query(async ({ ctx }) => {
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

  deleteAccount: publicProcedure
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

  updateDefaultAccount: publicProcedure
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

  getDefaultAccountsTransactions: publicProcedure.query(async ({ ctx }) => {
    const accountId = await getDefaultAccountId();

    return await ctx.db.transaction.findMany({
      where: {
        accountId,
        status: "COMPLETED",
      },
      select: {
        amount: true,
        type: true,
      },
    });
  }),

  getSummary: publicProcedure.query(async () => {
    return await getTotalExpenseAndIncomeCurrentAccount();
  }),
});
