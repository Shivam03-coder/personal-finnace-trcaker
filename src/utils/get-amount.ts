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



export function reverseTransactionEffect(
  type: TransactionType,
  currentBalance: number,
  amount: number,
): number {
  switch (type) {
    case "DEPOSIT":
    case "REFUND":
      return currentBalance - amount;
    case "WITHDRAWAL":
    case "PAYMENT":
      return currentBalance + amount;
    case "TRANSFER":
      return currentBalance + amount;
    default:
      return currentBalance;
  }
}

export function applyTransactionEffect(
  type: TransactionType,
  currentBalance: number,
  amount: number,
): number {
  switch (type) {
    case "DEPOSIT":
    case "REFUND":
      return currentBalance + amount;
    case "WITHDRAWAL":
    case "PAYMENT":
      return currentBalance - amount;
    case "TRANSFER":
      // Handle transfer based on your business logic
      return currentBalance - amount; // Simplified example
    default:
      return currentBalance;
  }
}
