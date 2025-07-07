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
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const startOfRange = new Date(currentYear, currentMonth, 1);
  const endOfRange = new Date(currentYear, currentMonth, 7, 23, 59, 59);

  const date = faker.date.between({
    from: startOfRange,
    to: endOfRange,
  });

const transactions = Array.from({ length: 30 }).map(() => {
  const isRecurring = Math.random() > 0.7;

  // Always 1–7 of current month
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const startOfRange = new Date(currentYear, currentMonth, 1);
  const endOfRange = new Date(currentYear, currentMonth, 7, 23, 59, 59);

  const date = faker.date.between({
    from: startOfRange,
    to: endOfRange,
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
    accountId: "686a5a79888994d8c74486c9",
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
