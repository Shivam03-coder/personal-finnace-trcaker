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
import React, { useState } from "react";
import type { AccountDetailsTypes } from "@/types/app";

interface AccountActionProps {
  row: Row<AccountDetailsTypes>;
  onEdit?: (row: Row<AccountDetailsTypes>) => void;
  onMakeDefault?: (row: Row<AccountDetailsTypes>) => void;
  onDelete?: (row: Row<AccountDetailsTypes>) => void;
}

const AccountAction = ({
  row,
  onMakeDefault,
  onDelete,
}: AccountActionProps) => {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleMakeDefault = () => {
    onMakeDefault?.(row);
  };

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  const handleDeleteConfirm = () => {
    onDelete?.(row);
    setShowDeleteAlert(false);
  };

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
          <DropdownMenuItem onClick={handleMakeDefault}>
            Make default
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            disabled={row.original.isDefaultAccount}
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
              account
              {row.original.accountName && ` "${row.original.accountName}"`} and
              remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default AccountAction;
