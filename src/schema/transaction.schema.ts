import {
  RecurringInterval,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import z from "zod";

const RecurringIntervalEnum = z.enum([
  "DAILY",
  "WEEKLY",
  "BIWEEKLY",
  "MONTHLY",
  "QUARTERLY",
  "YEARLY",
  "ONE_TIME",
]);

export const transactionSchema = z.object({
  amount: z.number().min(1).max(10000000),
  type: z.nativeEnum(TransactionType),
  description: z.string().min(7).max(1000),
  date: z.coerce.date(),
  status: z.nativeEnum(TransactionStatus),
  recurringInterval: RecurringIntervalEnum,
  tags: z.array(z.string()),
  accountId: z.string().optional(),
});
