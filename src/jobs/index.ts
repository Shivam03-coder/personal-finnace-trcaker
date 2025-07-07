import { inngest } from "@/lib/inngest";
import { db } from "@/server/db";
import type { RecurringInterval } from "@prisma/client";

function isTransactionDue(transaction: any) {
  if (!transaction.isRecurring) return false;

  const now = new Date();

  if (!transaction.lastTimeRecurringProcessed) return true;

  if (transaction.nextRecurringDate && transaction.nextRecurringDate <= now) {
    return true;
  }

  return false;
}

function calculateNextRecurringDate(
  currentDate: Date,
  interval: RecurringInterval,
) {
  const nextDate = new Date(currentDate);

  switch (interval) {
    case "DAILY":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "WEEKLY":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "MONTHLY":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "QUARTERLY":
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case "YEARLY":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      nextDate.setMonth(nextDate.getMonth() + 1);
  }

  return nextDate;
}

export const processRecurringTransaction = inngest.createFunction(
  {
    id: "process-recurring-transaction",
    name: "Process Recurring Transaction",
    throttle: {
      limit: 10,
      period: "1m",
      key: "event.data.userId",
    },
  },
  { event: "transaction.recurring.process" },
  async ({ event, step }) => {
    if (!event?.data?.transactionId || !event?.data?.userId) {
      console.error("Invalid event data:", event);
      return { error: "Missing required event data" };
    }

    const result = await step.run("process-transaction", async () => {
      try {
        const transaction = await db.transaction.findUnique({
          where: {
            id: event.data.transactionId,
            userId: event.data.userId,
          },
          include: {
            account: true,
            user: {
              select: {
                id: true,
                email: true,
                name: true,
              },
            },
          },
        });

        if (!transaction || !isTransactionDue(transaction)) {
          return {
            success: false,
            reason: "Transaction not found or not due for processing",
          };
        }

        if (!transaction.isRecurring || transaction.status !== "COMPLETED") {
          return {
            success: false,
            reason: "Transaction is not a completed recurring transaction",
          };
        }

        const currentDate = new Date();

        await db.$transaction(async (tx) => {
          const newTransaction = await tx.transaction.create({
            data: {
              type: transaction.type,
              amount: transaction.amount,
              currency: transaction.currency,
              description: `${transaction.description} (Recurring)`,
              date: currentDate,
              status: "COMPLETED",
              isRecurring: false,
              tags: transaction.tags,
              userId: transaction.userId,
              accountId: transaction.accountId,
            },
          });

          const balanceChange =
            transaction.type === "PAYMENT" ||
            transaction.type === "TRANSFER" ||
            transaction.type === "WITHDRAWAL"
              ? -transaction.amount
              : transaction.amount;

          await tx.account.update({
            where: { id: transaction.accountId },
            data: {
              accountBalance: {
                increment: balanceChange,
              },
            },
          });

          await tx.transaction.update({
            where: { id: transaction.id },
            data: {
              lastTimeRecurringProcessed: currentDate,
              nextRecurringDate: calculateNextRecurringDate(
                currentDate,
                transaction.recurringInterval!,
              ),
            },
          });

          return {
            success: true,
            newTransactionId: newTransaction.id,
            amount: transaction.amount,
            type: transaction.type,
            accountId: transaction.accountId,
            nextRecurringDate: calculateNextRecurringDate(
              currentDate,
              transaction.recurringInterval!,
            ),
          };
        });

        return {
          success: true,
          transactionId: transaction.id,
          processed: true,
        };
      } catch (error: any) {
        console.error("Error processing recurring transaction:", error);
        return {
          success: false,
          error: error?.message,
          transactionId: event.data.transactionId,
        };
      }
    });

    return result;
  },
);

export const triggerRecurringTransactions = inngest.createFunction(
  {
    id: "trigger-recurring-transactions",
    name: "Trigger Recurring Transactions",
  },
  { cron: "0 0 * * *" },
  async ({ step }) => {
    const recurringTransactions = await step.run(
      "fetch-recurring-transactions",
      async () => {
        try {
          const currentDate = new Date();

          return await db.transaction.findMany({
            where: {
              isRecurring: true,
              status: "COMPLETED",
              recurringInterval: {
                not: null,
              },
              OR: [
                { lastTimeRecurringProcessed: null },
                {
                  nextRecurringDate: {
                    lte: currentDate,
                  },
                },
              ],
            },
            select: {
              id: true,
              userId: true,
              amount: true,
              type: true,
              description: true,
              recurringInterval: true,
              lastTimeRecurringProcessed: true,
              nextRecurringDate: true,
            },
            take: 1000,
          });
        } catch (error) {
          console.error("Error fetching recurring transactions:", error);
          return [];
        }
      },
    );

    const processedCount = await step.run("send-recurring-events", async () => {
      if (recurringTransactions.length === 0) {
        return 0;
      }

      try {
        const events = recurringTransactions.map((transaction) => ({
          name: "transaction.recurring.process",
          data: {
            transactionId: transaction.id,
            userId: transaction.userId,
          },
        }));

        const batchSize = 50;
        let totalSent = 0;

        for (let i = 0; i < events.length; i += batchSize) {
          const batch = events.slice(i, i + batchSize);
          await inngest.send(batch);
          totalSent += batch.length;
        }

        return totalSent;
      } catch (error) {
        console.error("Error sending recurring transaction events:", error);
        return 0;
      }
    });

    return {
      triggered: processedCount,
      totalFound: recurringTransactions.length,
      timestamp: new Date().toISOString(),
    };
  },
);
