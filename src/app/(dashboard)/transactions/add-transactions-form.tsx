"use client";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import { TagsInput } from "@/components/ui/tags-input";
import { transactionSchema } from "@/schema/transaction.schema";
import { SheetClose, SheetFooter } from "@/components/ui/sheet";
import {
  CurrencyType,
  RecurringInterval,
  TransactionStatus,
  TransactionType,
} from "@prisma/client";
import { api } from "@/trpc/react";
import { useAppToasts } from "@/hooks/use-app-toast";
import { useReadLocalStorage } from "usehooks-ts";

interface AddTransactionFormProps {
  setOpen: (open: boolean) => void;
}

export default function AddTransactionForm({
  setOpen,
}: AddTransactionFormProps) {
  const form = useForm<z.infer<typeof transactionSchema>>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      tags: ["expense"],
      date: new Date(),
    },
  });
  const defaultAccountId = useReadLocalStorage("default_accountId") as string;

  const { ErrorToast, SuccessToast } = useAppToasts();
  const createTransactions = api.transaction.createTransactions.useMutation();
  const utils = api.useUtils();

  async function onSubmit(values: z.infer<typeof transactionSchema>) {
    console.log("🧭 Form submitted with values:", values);

    if (!defaultAccountId) {
      ErrorToast({
        title: "Missing Account ID",
        description: "Please select a default account in settings first.",
      });
      return;
    }

    try {
      const formattedValues = {
        ...values,
        accountId: defaultAccountId,
      };

      console.log("🚀 Sending to API:", formattedValues);

      await createTransactions.mutateAsync(formattedValues);

      SuccessToast({
        title: "Transaction Created",
        description: "Your transaction was successfully added.",
      });

      await utils.transaction.getTransactions.invalidate();

      setOpen(false);

      form.reset();
    } catch (error: any) {
      console.error("Transaction creation error:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong while creating the transaction. Please try again.";

      ErrorToast({
        title: "Failed to Create Transaction",
        description: errorMessage,
      });
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mx-auto w-full space-y-8 px-6 py-8"
      >
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Amount</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter amount (e.g., 23456.78)"
                    type="number"
                    {...field}
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;
                      field.onChange(
                        value === "" ? undefined : parseFloat(value),
                      );
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="currency"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Currency</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="JPY">JPY (¥)</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select transaction type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TransactionType).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
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
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transaction Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(TransactionStatus).map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
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
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Transaction Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>

                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="recurringInterval"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurring Interval</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select interval" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(RecurringInterval).map((rct) => (
                      <SelectItem className="" key={rct} value={rct}>
                        {rct}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter transaction details (e.g., 'Dinner at Italian Restaurant')"
                  className="resize-none"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormDescription>
                Detailed description of the transaction
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Transaction Tags</FormLabel>
              <FormControl>
                <TagsInput
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Add tags (e.g., food, travel, utilities)"
                />
              </FormControl>
              <FormDescription>
                Categorize your transaction with tags
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <SheetFooter className="flex flex-row">
          <SheetClose className="flex-1" asChild>
            <Button type="button" variant="secondary">
              Cancel
            </Button>
          </SheetClose>
          <Button
            className="flex-1"
            type="submit"
            disabled={createTransactions.isPending}
          >
            {createTransactions.isPending ? "Adding..." : "Add Transaction"}
          </Button>
        </SheetFooter>
      </form>
    </Form>
  );
}
