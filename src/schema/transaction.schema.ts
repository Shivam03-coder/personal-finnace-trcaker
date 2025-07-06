import {
  CurrencyType,
  RecurringInterval,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import z from "zod";

export const transactionSchema = z.object({
  amount: z.number().min(1).max(10000000),
  currency: z.nativeEnum(CurrencyType),
  type: z.nativeEnum(TransactionType),
  description: z.string().min(7).max(1000),
  date: z.coerce.date(),
  status: z.nativeEnum(TransactionStatus),
  recurringInterval: z.nativeEnum(RecurringInterval),
  tags: z.array(z.string()),
  accountId: z.string().optional(),
});
