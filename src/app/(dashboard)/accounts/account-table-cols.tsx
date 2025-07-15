"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconCircleCheckFilled } from "@tabler/icons-react";
import { DragHandle } from "@/components/data-table/drag-handle";
import type { AccountType, AccountStatus } from "@prisma/client";
import AccountAction from "./account-action";
import type { AccountDetailsTypes } from "@/types/app";
import { useAppToasts } from "@/hooks/use-app-toast";
import { api } from "@/trpc/react";

const getAccountTypeColor = (type: AccountType) => {
  switch (type) {
    case "CHECKING":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "SAVINGS":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "CREDIT":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "INVESTMENT":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "LOAN":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusColor = (status: AccountStatus) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    case "INACTIVE":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    case "CLOSED":
      return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200";
    case "PENDING":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export const accountColumns: ColumnDef<AccountDetailsTypes>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={Number(row.original.id)} />,
  },
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "accountName",
    header: "Account Name",
    cell: ({ row }) => (
      <div className="font-medium">{row.original.accountName}</div>
    ),
  },
  {
    accessorKey: "accountType",
    header: "Account Type",
    cell: ({ row }) => (
      <span
        className={`${getAccountTypeColor(row.original.accountType)} rounded-full px-3.5 py-[5px] text-xs font-medium`}
      >
        {row.original.accountType}
      </span>
    ),
  },
  {
    accessorKey: "accountBalance",
    header: () => <div className="text-center">Account Balance</div>,
    cell: ({ row }) => (
      <div className="text-center font-medium">
        {new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: row.original.currency || "USD",
        }).format(row.original.accountBalance)}
      </div>
    ),
  },
  {
    accessorKey: "currency",
    header: "Currency",
    cell: ({ row }) => (
      <span className="font-lexend rounded-full bg-blue-100 px-2.5 py-[5px] text-xs text-gray-800 dark:bg-gray-700 dark:text-gray-300">
        {row.original.currency}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Account Status",
    cell: ({ row }) => (
      <span
        className={`${getStatusColor(row.original.status)} rounded-full px-2.5 py-0.5 text-xs font-medium`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "isDefaultAccount",
    header: () => <div className="text-center">Default</div>,
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.isDefaultAccount ? (
          <IconCircleCheckFilled className="h-4 w-4 fill-green-500 dark:fill-green-400" />
        ) : (
          <div className="border-muted-foreground/30 h-4 w-4 rounded-full border" />
        )}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { ErrorToast, SuccessToast, WarningToast } = useAppToasts();
      const deleteAccount = api.account.deleteAccount.useMutation();
      const updateDefaultAccount =
        api.account.updateDefaultAccount.useMutation();
      const utils = api.useUtils();
      return (
        <AccountAction
          row={row}
          onEdit={(row) => {}}
          onMakeDefault={(row) => {
            if (!row.original.id) {
              WarningToast({
                title: "Error",
                description: "Cannot set default account without an ID",
              });
              return;
            }

            updateDefaultAccount.mutateAsync(
              { accountId: row.original.id },
              {
                onSuccess: () => {
                  SuccessToast({
                    title: "Default account updated",
                    description: `${row.original.accountName || "This account"} is now your default account`,
                  });
                  utils.account.getAccountDetails.invalidate();
                },
                onError: (error) => {
                  ErrorToast({
                    title: "Update failed",
                    description:
                      error.message || "Failed to set default account",
                  });
                },
              },
            );
          }}
          onDelete={(row) => {
            if (!row.original.id) {
              WarningToast({
                title: "Error",
                description: "Cannot delete account without an ID",
              });
              return;
            }

            deleteAccount.mutateAsync(
              { accountId: row.original.id },
              {
                onSuccess: () => {
                  SuccessToast({
                    title: "Account deleted successfully",
                    description: `${row.original.accountName} has been removed`,
                  });
                  utils.account.getAccountDetails.invalidate();
                },
                onError: (error) => {
                  ErrorToast({
                    title: "Deletion failed",
                    description: error.message || "Failed to delete account",
                  });
                },
              },
            );
          }}
        />
      );
    },
  },
];
