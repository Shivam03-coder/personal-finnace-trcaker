"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import EditTransactionForm from "./edit-transaction-form";
import type z from "zod";
import type { transactionSchema } from "@/schema/transaction.schema";

interface EditTransactionSheetProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  data: z.infer<typeof transactionSchema>;
  trasactionId: string;
}

function EditTransactionSheet({
  open,
  setOpen,
  data,
  trasactionId,
}: EditTransactionSheetProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="right"
        className="min-h-screen w-full overflow-y-auto sm:max-w-lg"
      >
        <SheetHeader className="hidden">
          <SheetTitle className="text-left">Add New Transaction</SheetTitle>
        </SheetHeader>
        <EditTransactionForm
          trasactionId={trasactionId}
          data={data}
          setOpen={setOpen}
        />
      </SheetContent>
    </Sheet>
  );
}

export default EditTransactionSheet;
