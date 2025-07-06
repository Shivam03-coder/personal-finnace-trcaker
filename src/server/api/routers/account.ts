import { accountSchema } from "@/schema/account.schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import z from "zod";

export const accountRouter = createTRPCRouter({
  createAccount: publicProcedure
    .input(accountSchema)
    .mutation(async ({ ctx, input }) => {
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
    return ctx.db.account.findMany({
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
});
