import { CurrencyType, PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();

async function main() {
  const transactionTypes = [
    "DEPOSIT",
    "WITHDRAWAL",
    "TRANSFER",
    "PAYMENT",
    "REFUND",
  ] as const;
  const transactionStatuses = [
    "PENDING",
    "COMPLETED",
    "FAILED",
    "CANCELLED",
  ] as const;
  const recurringIntervals = [
    "DAILY",
    "WEEKLY",
    "BIWEEKLY",
    "MONTHLY",
    "QUARTERLY",
    "YEARLY",
  ] as const;
  const budgetCategories = [
    "GROCERIES",
    "RENT",
    "UTILITIES",
    "ENTERTAINMENT",
    "SAVINGS",
    "TRANSPORT",
    "OTHER",
  ] as const;

  const acc = await prisma.account.findFirst({
    where: {
      isDefaultAccount: true,
    },
  });
  // Calculate date range
  const today = new Date();
  const currentYear = today.getFullYear();
  const mayFirst = new Date(currentYear, 4, 1); // May = month 4

  const transactions = Array.from({ length: 30 }).map(() => {
    const isRecurring = Math.random() > 0.7; // 30% chance of being recurring
    const date = faker.date.between({
      from: mayFirst,
      to: today,
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
      currency: "INR" as CurrencyType,
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
      accountId: acc?.id!,
    };
  });

  await prisma.transaction.createMany({
    data: transactions,
  });

  console.log("Seeded 30 transactions between May 1st and today");
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
