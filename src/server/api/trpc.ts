import { initTRPC } from "@trpc/server";
import superjson from "superjson";
import { ZodError } from "zod";

import { db } from "@/server/db";
import { auth } from "@clerk/nextjs/server";

export const createTRPCContext = async (opts: { headers: Headers }) => {
  const clerkUser = await auth();

  const user = await db.user.findUnique({
    where: {
      clerkUserId: clerkUser.userId as string,
    },
  });

  return {
    auth: {
      userId: user?.id,
    },
    db,
    ...opts,
  };
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createCallerFactory = t.createCallerFactory;

export const createTRPCRouter = t.router;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

const isAuth = t.middleware(({ next, ctx }) => {
  if (!ctx.auth?.userId) {
    throw new Error("Unauthorized");
  }
  return next({
    ctx: { ...ctx, auth: ctx.auth! as Required<typeof ctx.auth> },
  });
});

export const publicProcedure = t.procedure.use(timingMiddleware);
export const protectedProcedure = t.procedure.use(isAuth);
