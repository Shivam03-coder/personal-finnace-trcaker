"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { IconRefresh, IconCalendarEvent } from "@tabler/icons-react";
import { DragHandle } from "@/components/data-table/drag-handle";
import type {
  TransactionType,
  TransactionStatus,
  RecurringInterval,
} from "@prisma/client";
import { format } from "date-fns";
import type { TransactionDetails } from "@/types/app";
import TransactionAction from "./transaction-table-actions";
import { api } from "@/trpc/react";
import { useAppToasts } from "@/hooks/use-app-toast";

const getTransactionTypeColor = (type: TransactionType) => {
  switch (type) {
    case "DEPOSIT":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "WITHDRAWAL":
      return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    case "TRANSFER":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "PAYMENT":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "REFUND":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getStatusColor = (status: TransactionStatus) => {
  switch (status) {
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200";
    case "PENDING":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200";
    case "FAILED":
      return "bg-rose-100 text-rose-800 dark:bg-rose-900 dark:text-rose-200";
    case "CANCELLED":
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

const getRecurringColor = (interval: RecurringInterval | null) => {
  if (!interval) return "";

  switch (interval) {
    case "DAILY":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
    case "WEEKLY":
      return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    case "BIWEEKLY":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    case "MONTHLY":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    case "QUARTERLY":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200";
    case "YEARLY":
      return "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
  }
};

export const transactionColumns: ColumnDef<TransactionDetails>[] = [
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
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => (
      <div
        className={`font-medium ${row.original.type === "DEPOSIT" ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
      >
        {new Intl.NumberFormat(undefined, {
          style: "currency",
          currency: row.original.currency || "USD",
        }).format(row.original.amount)}
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span
        className={`${getTransactionTypeColor(row.original.type)} rounded-full px-3 py-1 text-xs font-medium`}
      >
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <IconCalendarEvent className="text-muted-foreground h-4 w-4" />
        {format(new Date(row.original.date), "MMM dd, yyyy")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`${getStatusColor(row.original.status)} rounded-full px-3 py-1 text-xs font-medium`}
      >
        {row.original.status}
      </span>
    ),
  },
  {
    accessorKey: "isRecurring",
    header: "Recurring",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.isRecurring ? (
          <>
            <IconRefresh className="text-muted-foreground h-4 w-4" />
            <span
              className={`${getRecurringColor(row.original.recurringInterval)} rounded-full px-2 py-0.5 text-xs`}
            >
              {row.original.recurringInterval}
            </span>
          </>
        ) : (
          <span className="font-lexend rounded-2xl bg-pink-100 px-2 py-0.5 text-xs text-black uppercase">
            One-time
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags?.map((tag) => (
          <span
            key={tag}
            className="rounded-full bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700"
          >
            {tag}
          </span>
        ))}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { ErrorToast, SuccessToast } = useAppToasts();
      const deleteTransaction = api.transaction.deleteTransaction.useMutation();

      const utils = api.useUtils();

      return (
        <TransactionAction
          row={row}
          onDelete={(row) => {
            deleteTransaction.mutateAsync(
              { transactionId: row.original.id },
              {
                onSuccess: () => {
                  SuccessToast({
                    title: "Transaction deleted",
                    description: "Transaction has been removed successfully",
                  });
                  utils.transaction.invalidate();
                },
                onError: (error) => {
                  ErrorToast({
                    title: "Deletion failed",
                    description:
                      error.message || "Failed to delete transaction",
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
