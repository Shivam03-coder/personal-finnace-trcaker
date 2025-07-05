import type { FinanceCardData } from "@/types/app";
import {
  IndianRupee,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  Receipt,
  Wallet,
} from "lucide-react";
import FinanceSummaryCard from "./summary-card";

export default function FinanceSummaryCards() {
  const cardsData: FinanceCardData[] = [
    {
      id: "income",
      title: "Total Income",
      amount: "₹3,32,000",
      icon: <IndianRupee className="size-5 text-emerald-600" />,
      statusText: "Excellent savings rate",
      trendIcon: <TrendingUp className="size-4 text-emerald-600" />,
      secondaryText: "Salary: ₹2,85,000 | Other: ₹47,000",
    },
    {
      id: "expenses",
      title: "Total Expenses",
      amount: "₹56,250",
      icon: <Receipt className="size-5 text-rose-600" />,
      statusText: "Under budget this month",
      trendIcon: <TrendingDown className="size-4 text-rose-600" />,
      secondaryText: "Rent: ₹25,000 | Food: ₹15,000",
    },
    {
      id: "net-income",
      title: "Net Income",
      amount: "₹2,75,750",
      icon: <Wallet className="size-5 text-blue-600" />,
      statusText: "Strong financial health",
      trendIcon: <TrendingUp className="size-4 text-blue-600" />,
      secondaryText: "Savings rate: 83.1%",
    },
    {
      id: "budget",
      title: "Total Budget",
      amount: "₹1,50,000",
      icon: <PiggyBank className="size-5 text-violet-600" />,
      statusText: "₹93,750 remaining",
      trendIcon: null,
      secondaryText: "Monthly allocation",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-4">
      {cardsData.map((card) => (
        <FinanceSummaryCard key={card.id} data={card} />
      ))}
    </div>
  );
}
