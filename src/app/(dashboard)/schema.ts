import { z } from "zod";

export const expenseSchema = z.object({
  id: z.number(),
  description: z.string(),
  category: z.string(),
  amount: z.number(),
  date: z.string(),
  paymentMethod: z.string(),
  tags: z.array(z.string()).optional(),
  recurring: z.boolean().optional(),
  notes: z.string().optional(),
});
