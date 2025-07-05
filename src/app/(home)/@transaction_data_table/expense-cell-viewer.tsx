"use client";
import type z from "zod";
import { useIsMobile } from "@/hooks/use-mobile";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription, DrawerFooter, DrawerClose, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { expenseSchema } from "./schema";

export default function ExpenseCellViewer({ expense }: { expense: z.infer<typeof expenseSchema> }) {
  const isMobile = useIsMobile();

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {expense.description}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Expense Details</DrawerTitle>
          <DrawerDescription>
            {new Date(expense.date).toLocaleDateString()} • {expense.category}
          </DrawerDescription>
        </DrawerHeader>
        
        <div className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Amount</Label>
              <div className="text-2xl font-bold">
                ${expense.amount.toFixed(2)}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div>{expense.paymentMethod}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Description</Label>
            <Input defaultValue={expense.description} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select defaultValue={expense.category}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Food">Food</SelectItem>
                  <SelectItem value="Utilities">Utilities</SelectItem>
                  <SelectItem value="Transportation">Transportation</SelectItem>
                  {/* ... other categories */}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" defaultValue={expense.date} />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Tags</Label>
            {/* Tag input component would go here */}
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox id="recurring" defaultChecked={expense.recurring} />
            <Label htmlFor="recurring">Recurring Expense</Label>
          </div>
          
          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea 
              defaultValue={expense.notes || ""} 
              placeholder="Additional notes about this expense..."
            />
          </div>
        </div>
        
        <DrawerFooter>
          <Button>Save Changes</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}