"use client";

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import AddTransactionForm from "./add-transactions-form";
import { Button } from "@/components/ui/button";

interface AddTransactionSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AddTransactionSheet({ open, setOpen }: AddTransactionSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="min-h-screen w-full rounded-l-2xl overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader className="hidden">
          <SheetTitle className="text-left">Add New Transaction</SheetTitle>
        </SheetHeader>
        <AddTransactionForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>
  );
}

export default AddTransactionSheet;
