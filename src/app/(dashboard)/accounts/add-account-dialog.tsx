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

function AddAccountDialog({ open, setOpen }: AddAccountDialogProps) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>ADD YOUR ACCOUNT</DialogTitle>
        </DialogHeader>
        <AddAccountForm />
        <DialogFooter>
          <DialogClose asChild>
            <Button size={"sm"} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button size={"sm"} type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddAccountDialog;
