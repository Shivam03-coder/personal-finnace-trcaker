import { DataTable } from "@/components/data-table";
import React from "react";
import { expenseColumns } from "./ expense-table-cols";
import data from "@/data/index.json";

const TransactionDataTable = () => {
  return <DataTable columns={expenseColumns} data={data} />;
};

export default TransactionDataTable;
