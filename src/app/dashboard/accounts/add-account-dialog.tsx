import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AddAccountForm from "./add-account-form";

interface AddAccountDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

function AddAccountDialog({ open = true, setOpen }: AddAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader className="hidden">
          <DialogTitle>ADD YOUR ACCOUNT</DialogTitle>
        </DialogHeader>
        <div className="mx-auto">

        <AddAccountForm setOpen={setOpen} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AddAccountDialog;
