import { accountSchema } from "@/schema/account.schema";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

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
});
