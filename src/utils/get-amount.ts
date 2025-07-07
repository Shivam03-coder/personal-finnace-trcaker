import type { TransactionType } from "@prisma/client";

export function getIncrementAndDecrementOfAmount(
  type: TransactionType,
  amount: number,
) {
  const incomeTypes: TransactionType[] = ["DEPOSIT", "REFUND"];
  const expenseTypes: TransactionType[] = ["WITHDRAWAL", "TRANSFER", "PAYMENT"];

  if (incomeTypes.includes(type)) {
    return Math.abs(amount);
  }

  if (expenseTypes.includes(type)) {
    return -Math.abs(amount);
  }
  return amount;
}
