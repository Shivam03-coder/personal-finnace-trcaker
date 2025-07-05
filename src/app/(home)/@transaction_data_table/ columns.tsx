import type { ColumnDef } from "@tanstack/react-table";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { IconDotsVertical } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { IconCircleCheckFilled, IconLoader } from "@tabler/icons-react";
import { toast } from "sonner";
import { DragHandle } from "./drag-handle";
import ExpenseCellViewer from "./expense-cell-viewer";

export const expenseSchema = z.object({
  id: z.number(),
  description: z.string(),
  category: z.string(),
  amount: z.number(),
  date: z.string(),
  paymentMethod: z.string(),
  tags: z.array(z.string()).optional(),
  recurring: z.boolean().optional(),
  notes: z.string().optional(),
});

export const columns: ColumnDef<z.infer<typeof expenseSchema>>[] = [
  {
    id: "drag",
    header: () => null,
    cell: ({ row }) => <DragHandle id={row.original.id} />,
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
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      return <ExpenseCellViewer expense={row.original} />;
    },
    enableHiding: false,
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="w-32">
        <Badge variant="outline" className="text-muted-foreground px-1.5">
          {row.original.category}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="w-full text-right">Amount</div>,
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.description}`,
            success: "Done",
            error: "Error",
          });
        }}
      >
        <Label htmlFor={`${row.original.id}-amount`} className="sr-only">
          Amount
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-20 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.amount}
          id={`${row.original.id}-amount`}
          type="number"
          step="0.01"
        />
      </form>
    ),
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => (
      <form
        onSubmit={(e) => {
          e.preventDefault();
          toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
            loading: `Saving ${row.original.description}`,
            success: "Done",
            error: "Error",
          });
        }}
      >
        <Label htmlFor={`${row.original.id}-date`} className="sr-only">
          Date
        </Label>
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-28 border-transparent bg-transparent shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={row.original.date}
          id={`${row.original.id}-date`}
          type="date"
        />
      </form>
    ),
  },
  {
    accessorKey: "paymentMethod",
    header: "Payment Method",
    cell: ({ row }) => {
      return (
        <>
          <Label htmlFor={`${row.original.id}-payment`} className="sr-only">
            Payment Method
          </Label>
          <Select defaultValue={row.original.paymentMethod}>
            <SelectTrigger
              className="w-36 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              id={`${row.original.id}-payment`}
            >
              <SelectValue placeholder="Select payment method" />
            </SelectTrigger>
            <SelectContent align="end">
              <SelectItem value="cash">Cash</SelectItem>
              <SelectItem value="credit">Credit Card</SelectItem>
              <SelectItem value="debit">Debit Card</SelectItem>
              <SelectItem value="bank">Bank Transfer</SelectItem>
              <SelectItem value="digital">Digital Wallet</SelectItem>
            </SelectContent>
          </Select>
        </>
      );
    },
  },
  {
    accessorKey: "recurring",
    header: "Recurring",
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        {row.original.recurring ? (
          <IconCircleCheckFilled className="h-4 w-4 fill-green-500 dark:fill-green-400" />
        ) : (
          <div className="border-muted-foreground/30 h-4 w-4 rounded-full border" />
        )}
      </div>
    ),
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => (
      <div className="flex flex-wrap gap-1">
        {row.original.tags?.map((tag, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="px-1.5 py-0.5 text-xs"
          >
            {tag}
          </Badge>
        )) || <span className="text-muted-foreground text-sm">No tags</span>}
      </div>
    ),
  },
  {
    id: "actions",
    cell: () => (
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
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
