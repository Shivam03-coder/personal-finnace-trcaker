import { DataTable } from "@/components/data-table";
import React from "react";
import { expenseColumns } from "./ expense-table-cols";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { curren_account_transaction_table_cols } from "./curren-account-transaction-table-cols";

const TransactionDataTable = () => {
  const { data, isLoading } =
    api.transaction.getDefaultAccountsTransactions.useQuery();

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }
  return (
    <DataTable
      data={data ?? []}
      columns={curren_account_transaction_table_cols}
    />
  );
};

export default TransactionDataTable;
