"use client";
import { DataTable } from "@/components/data-table";
import { useCallback, useState } from "react";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { transactionColumns } from "./transactions-table-cols";
import AddTransactionDialog from "./add-transaction-dialog";

function TransactionTable() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { data, isLoading } =
    api.transaction.getDefaultAccountsTransactions.useQuery();

  const handleOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

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
    <>
      <DataTable
        data={data ?? []}
        columns={transactionColumns}
        enableDragging={true}
        enableRowSelection={true}
        showAddButton={true}
        onAddClick={handleOpenDialog}
        enableSearch={true}
      />
      <AddTransactionDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
    </>
  );
}

export default TransactionTable;
