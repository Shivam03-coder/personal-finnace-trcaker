"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { IconDotsVertical } from "@tabler/icons-react";
import type { Row } from "@tanstack/react-table";
import React, { useCallback, useState } from "react";
import type { TransactionDetails } from "@/types/app";
import EditTransactionSheet from "./edit-transaction-sheet";
import type { Z } from "node_modules/@faker-js/faker/dist/airline-CLphikKp";
import type z from "zod";
import type { transactionSchema } from "@/schema/transaction.schema";

interface TransactionActionProps {
  row: Row<TransactionDetails>;
  onEdit?: (row: Row<TransactionDetails>) => void;
  onDelete?: (row: Row<TransactionDetails>) => void;
}

const TransactionAction = ({ row, onDelete }: TransactionActionProps) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [open, setOpen] = useState<boolean>(false);

  const handleEdit = useCallback(() => {
    setOpen(true);
  }, []);

  const handleDeleteClick = useCallback(() => {
    setShowDeleteAlert(true);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    onDelete?.(row);
    setShowDeleteAlert(false);
  }, [onDelete, row]);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
            size="icon"
          >
            <IconDotsVertical />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-32">
          <DropdownMenuItem onClick={handleEdit}>Edit</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={handleDeleteClick}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              transaction and remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Transaction
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {open && (
        <EditTransactionSheet
          open={open}
          setOpen={setOpen}
          data={row.original as z.infer<typeof transactionSchema>}
          trasactionId={row.original.id}
        />
      )}
    </>
  );
};

export default TransactionAction;
