"use client";
import { DataTable } from "@/components/data-table";
import { useCallback, useState } from "react";
import AddAccountDialog from "./add-account-dialog";
import { api } from "@/trpc/react";
import { Skeleton } from "@/components/ui/skeleton";
import { accountColumns } from "./account-table-cols";

function AccountTable() {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { data, isLoading } = api.account.getAccountDetails.useQuery();

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
        columns={accountColumns}
        enableDragging={true}
        enableRowSelection={true}
        showAddButton={true}
        onAddClick={handleOpenDialog}
        enableSearch={true}
      />
      <AddAccountDialog open={isDialogOpen} setOpen={setIsDialogOpen} />
    </>
  );
}

export default AccountTable;
