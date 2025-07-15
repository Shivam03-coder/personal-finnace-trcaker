import React from "react";
import BudgetPieChart from "./monthly-budget";
import TransactionTypeRadarChart from "./trnasaction-type-chart";
import LastSevenDaysNetTransaction from "./get-last7-days-summary";


const BudgetCharts = () => {
  return (
    <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 xl:gap-6 2xl:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-1">
        <BudgetPieChart />
      </div>
      
      <div className="lg:col-span-1">
        <TransactionTypeRadarChart />
      </div>
      
      <div className="lg:col-span-2 xl:col-span-1 2xl:col-span-1">
        <LastSevenDaysNetTransaction />
      </div>
    </div>
  );
};

export default BudgetCharts;