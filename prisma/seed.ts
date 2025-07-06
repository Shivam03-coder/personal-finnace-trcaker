import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const transactionTypes: (
    | "DEPOSIT"
    | "WITHDRAWAL"
    | "TRANSFER"
    | "PAYMENT"
    | "REFUND"
  )[] = ["DEPOSIT", "WITHDRAWAL", "TRANSFER", "PAYMENT", "REFUND"];

  const transactionStatuses: (
    | "PENDING"
    | "COMPLETED"
    | "FAILED"
    | "CANCELLED"
  )[] = ["PENDING", "COMPLETED", "FAILED", "CANCELLED"];

  const recurringIntervals: (
    | "DAILY"
    | "WEEKLY"
    | "BIWEEKLY"
    | "MONTHLY"
    | "QUARTERLY"
    | "YEARLY"
  )[] = ["DAILY", "WEEKLY", "BIWEEKLY", "MONTHLY", "QUARTERLY", "YEARLY"];

  const budgetCategories: (
    | "GROCERIES"
    | "RENT"
    | "UTILITIES"
    | "ENTERTAINMENT"
    | "SAVINGS"
    | "TRANSPORT"
    | "OTHER"
  )[] = [
    "GROCERIES",
    "RENT",
    "UTILITIES",
    "ENTERTAINMENT",
    "SAVINGS",
    "TRANSPORT",
    "OTHER",
  ];

  const transactions = Array.from({ length: 30 }).map((_, i) => {
    const isRecurring = Math.random() > 0.7; // 30% chance of being recurring
    const date = faker.date.between({
      from: "2023-01-01T00:00:00.000Z",
      to: "2023-12-31T00:00:00.000Z",
    });

    return {
      amount: parseFloat(
        faker.finance.amount({
          min: 5,
          max: 10000,
          dec: 5,
          symbol: "",
          autoFormat: true,
        }),
      ),
      currency: "INR",
      type: faker.helpers.arrayElement(transactionTypes),
      description: faker.finance.transactionDescription(),
      date: date,
      status: faker.helpers.arrayElement(transactionStatuses),
      isRecurring: isRecurring,
      recurringInterval: isRecurring
        ? faker.helpers.arrayElement(recurringIntervals)
        : null,
      lastTimeRecurringProcessed: isRecurring
        ? faker.date.recent({ days: 30 })
        : null,
      tags: [faker.helpers.arrayElement(budgetCategories)],
      userId: "65c0d2d242fd32ba15fdee12",
      accountId: "686a5a79888994d8c74486c9",
    };
  });

  await prisma.transaction.createMany({
    data: transactions,
  });

  console.log("Seeded 30 transactions");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
