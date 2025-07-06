import type { $Enums } from "@prisma/client";

export type AccountTypeValues = `${AccountType}`;

export const AccountTypeLabels: Record<AccountType, string> = {
  SAVINGS: "Savings Account",
  CHECKING: "Checking Account",
  BUSINESS: "Business Account",
  INVESTMENT: "Investment Account",
  RETIREMENT: "Retirement Account",
  CREDIT: "Credit Account",
  JOINT: "Joint Account",
};

export interface FinanceCardData {
  id: string;
  title: string;
  amount: string;
  icon: React.ReactNode;
  statusText: string;
  trendIcon: React.ReactNode;
  secondaryText: string;
  className?: string;
}

export interface AccountDetailsTypes {
  id: string;
  createdAt: Date;
  accountName: string;
  accountType: $Enums.AccountType;
  accountBalance: number;
  isDefaultAccount: boolean;
  currency: string;
  status: $Enums.AccountStatus;
}
