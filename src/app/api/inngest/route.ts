import {
  processRecurringTransaction,
  triggerRecurringTransactions,
} from "@/jobs";
import { inngest } from "@/lib/inngest";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [processRecurringTransaction, triggerRecurringTransactions],
});
