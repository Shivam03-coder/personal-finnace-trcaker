import { createCallerFactory, createTRPCRouter } from "@/server/api/trpc";
import { accountRouter } from "./routers/account";
import { transactionRouter } from "./routers/transaction";
import { budgetRouter } from "./routers/budget";

export const appRouter = createTRPCRouter({
  account: accountRouter,
  transaction: transactionRouter,
  budget: budgetRouter,
});

export type AppRouter = typeof appRouter;

export const createCaller = createCallerFactory(appRouter);
