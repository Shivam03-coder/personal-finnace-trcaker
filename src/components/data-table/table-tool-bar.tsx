"use client";

import type { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconLayoutColumns, IconPlus, IconSearch } from "@tabler/icons-react";

interface TableToolbarProps<TData> {
  table: Table<TData>;
  showAddButton?: boolean;
  onAddClick?: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function TableToolbar<TData>({
  table,
  showAddButton = false,
  onAddClick,
  searchValue,
  onSearchChange,
}: TableToolbarProps<TData>) {
  return (
    <div className="flex flex-col gap-2 px-4 py-2 lg:flex-row lg:items-center lg:justify-between lg:px-6">
      {/* Left side: Columns and Add */}
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <IconLayoutColumns className="mr-1" size={18} />
              <span className="hidden lg:inline">Customize Columns</span>
              <span className="lg:hidden">Columns</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            {table
              .getAllColumns()
              .filter(
                (column) =>
                  typeof column.accessorFn !== "undefined" &&
                  column.getCanHide(),
              )
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {showAddButton && (
          <Button size="sm" onClick={onAddClick}>
            <IconPlus className="mr-1" size={18} />
            <span className="hidden lg:inline">Add Section</span>
            <span className="lg:hidden">Add</span>
          </Button>
        )}
      </div>

      {/* Right side: Search */}
      <div className="flex w-full items-center gap-2 lg:w-auto">
        <div className="relative w-full lg:w-64">
          <IconSearch
            className="text-muted-foreground absolute top-2.5 left-2.5"
            size={16}
          />
          <Input
            className="pl-8"
            size={20}
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
