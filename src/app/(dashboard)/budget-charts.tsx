import React from "react";
import BudgetPieChart from "./monthly-budget";
import TransactionTypeRadarChart from "./trnasaction-type-chart";
import LastSevenDaysNetTransaction from "./get-last7-days-summary";

const BudgetCharts = () => {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @3xl/main:grid-cols-4">
      <BudgetPieChart />
      <TransactionTypeRadarChart />
      <LastSevenDaysNetTransaction />
    </div>
  );
};

export default BudgetCharts;
