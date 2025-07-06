"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { accountSchema } from "@/schema/account.schema";
import { DialogFooter } from "@/components/ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { $Enums } from "@prisma/client";
import { api } from "@/trpc/react";
import { useAppToasts } from "@/hooks/use-app-toast";

interface AddAccountFormProps {
  setOpen: (open: boolean) => void;
}

function AddAccountForm({ setOpen }: AddAccountFormProps) {
  const form = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
  });

  const { ErrorToast, SuccessToast } = useAppToasts();

  const createAccount = api.account.createAccount.useMutation();

  const apiutils = api.useUtils();

  function onSubmit(values: z.infer<typeof accountSchema>) {
    createAccount.mutateAsync(values, {
      onSuccess: () => {
        SuccessToast({
          title: "Account created successfully!",
          description: "Your new account is ready to use.",
        });
        setOpen(false);
        apiutils.account.getAccountDetails.invalidate();
      },
      onError: (error) => {
        let errorMessage = "Failed to create account";
        if (error instanceof Error) {
          errorMessage = error.message;
        } else if (typeof error === "string") {
          errorMessage = error;
        }
        ErrorToast({
          title: "Account creation failed",
          description: errorMessage,
        });
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="font-lexend w-full space-y-8 p-3"
      >
        <FormField
          control={form.control}
          name="accountName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="XYZ"
                  type="text"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="SAVINGS" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.values($Enums.AccountType).map((value) => (
                    <SelectItem
                      key={value}
                      className="capitalize"
                      value={value}
                    >
                      {value.toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Balance</FormLabel>
              <FormControl>
                <Input
                  placeholder="000.00"
                  type="number"
                  {...field}
                  value={field.value ?? ""}
                  onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isDefaultAccount"
          render={({ field }) => (
            <FormItem className="bg-muted/50 hover:bg-muted/30 flex flex-row items-start space-y-0 space-x-3 rounded-lg border p-4 transition-colors">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="mt-0.5"
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel className="text-sm font-medium">
                  Set as default account
                </FormLabel>
                <p className="mt-1 text-xs whitespace-nowrap">
                  Note: Only one account can be set as default at a time.
                </p>
                <FormMessage className="text-xs" />
              </div>
            </FormItem>
          )}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button size={"sm"} variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button size={"sm"} className="cursor-pointer" type="submit">
            Save changes
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
}

export default AddAccountForm;
