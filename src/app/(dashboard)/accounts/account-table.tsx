import { DataTable } from "@/components/data-table";
import type { AccountDetailsTypes } from "@/types/app";
import { accountColumns } from "./account-table-cols";

function AccountTable({ accounts }: { accounts: AccountDetailsTypes[] }) {
  return (
    <DataTable data={accounts} columns={accountColumns} enableDragging={true} />
  );
}

export default AccountTable;
