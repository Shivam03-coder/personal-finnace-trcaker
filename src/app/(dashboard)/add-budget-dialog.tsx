"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/trpc/react";
import { useAppToasts } from "@/hooks/use-app-toast";
import { useReadLocalStorage } from "usehooks-ts";

interface AddBudgetDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  initialAmount: number;
}

const AddBudgetDialog = ({
  open,
  setOpen,
  initialAmount,
}: AddBudgetDialogProps) => {
  const [amount, setAmount] = React.useState(initialAmount);
  const upsertBudget = api.budget.upsertBudget.useMutation();
  const defaultAccountId = useReadLocalStorage("default_accountId") as string;
  const { ErrorToast, SuccessToast, WarningToast } = useAppToasts();
  const utils = api.useUtils();

  const handleSave = async () => {
    if (!defaultAccountId) {
      WarningToast({
        title: "No Account Selected",
        description: "Please select a default account before setting a budget",
      });
      return;
    }

    if (!amount) {
      WarningToast({
        title: "Invalid Amount",
        description: "Please enter a valid budget amount",
      });
      return;
    }

    try {
      await upsertBudget.mutateAsync({
        amount,
      });

      SuccessToast({
        title: "Budget Updated",
        description: "Your budget has been successfully saved",
      });

      utils.budget.getCurrentBudget.invalidate();
      setOpen(false);
    } catch (error) {
      ErrorToast({
        title: "Update Failed",
        description: "There was an error saving your budget",
      });
      console.error("Budget update error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Edit Budget</DialogTitle>
          <DialogDescription>
            Enter your monthly budget amount below.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 py-2">
          <Label htmlFor="budgetAmount">Amount (₹)</Label>
          <Input
            id="budgetAmount"
            type="number"
            placeholder="Enter budget amount"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!amount}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddBudgetDialog;
