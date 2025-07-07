"use client";
import React from "react";
import FinanceSummaryCards from "./finance-summary-cards";
import TransactionDataTable from "./transaction-data-table";
import DailyExpenseChart from "./daily-expense-chart";
import BudgetCharts from "./budget-charts";

const DashboardHomePage = () => {
  return (
    <div className="page">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <FinanceSummaryCards />
          <BudgetCharts />
          <div className="px-4 lg:px-6">
            <DailyExpenseChart />
          </div>
          <TransactionDataTable />
        </div>
      </div>
    </div>
  );
};

export default DashboardHomePage;
