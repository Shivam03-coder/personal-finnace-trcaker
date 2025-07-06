import { AccountType } from "@prisma/client";
import { z } from "zod";

export const accountSchema = z.object({
  accountName: z
    .string()
    .min(5, "Account name must be at least 5 characters")
    .max(100, "Account name cannot exceed 100 characters"),
  accountType: z.nativeEnum(AccountType),
  accountBalance: z
    .number()
    .min(0, "Balance cannot be negative")
    .max(100_000_000, "Balance cannot exceed 100,000,000"),
  isDefaultAccount: z.boolean().default(false).optional(),
});

export type Account = z.infer<typeof accountSchema>;
