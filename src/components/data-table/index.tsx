"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type Row,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { useEffect, useId, useMemo, useState } from "react";
import { DraggableRow } from "./draggable-row";
import PaginationControls from "./pagination-controll";
import { TableToolbar } from "./table-tool-bar";

interface DataTableProps<TData extends { id: string | number }> {
  data: TData[];
  columns: ColumnDef<TData>[];
  defaultPageSize?: number;
  enableRowSelection?: boolean;
  enableDragging?: boolean;
  onRowReorder?: (reorderedData: TData[]) => void;
  showAddButton?: boolean;
  onAddClick?: () => void;
  enableSearch?: boolean;
  onSearch?: (value: string) => void;
  isLoading?: boolean;
}

export function DataTable<TData extends { id: string | number }>({
  data: initialData,
  columns,
  defaultPageSize = 10,
  enableRowSelection = true,
  enableDragging = false,
  onRowReorder,
  enableSearch,
  onAddClick,
  onSearch,
  showAddButton,
  isLoading = false,
}: DataTableProps<TData>) {
  const [data, setData] = useState<TData[]>(initialData);
  const [rowSelection, setRowSelection] = useState({});
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: defaultPageSize,
  });
  const sortableId = useId();
  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  // FIX 2: Update local data when initialData changes
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  // FIX 3: Generate dataIds from current data, not stale data
  const dataIds = useMemo<UniqueIdentifier[]>(
    () => data?.map(({ id }) => id) || [],
    [data],
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: enableRowSelection,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: (row, columnId, filterValue) => {
      return Object.values(row.original).some((value) =>
        String(value).toLowerCase().includes(String(filterValue).toLowerCase()),
      );
    },
  });

  useEffect(() => {
    if (enableSearch) {
      setColumnFilters((prev) => [
        ...prev.filter((filter) => filter.id !== "global"),
        ...(searchQuery
          ? [
              {
                id: "global",
                value: searchQuery,
              },
            ]
          : []),
      ]);
    }
  }, [searchQuery, enableSearch]);

  // FIX 4: Fixed drag end function
  function handleDragEnd(event: DragEndEvent) {
    if (!enableDragging) return;

    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setData((currentData) => {
        // Find indices from current data, not stale dataIds
        const oldIndex = currentData.findIndex((item) => item.id === active.id);
        const newIndex = currentData.findIndex((item) => item.id === over.id);

        // Validate indices
        if (oldIndex === -1 || newIndex === -1) {
          console.warn("Could not find item indices for drag operation");
          return currentData;
        }

        const newData = arrayMove(currentData, oldIndex, newIndex);

        // Call the onRowReorder callback if provided
        if (onRowReorder) {
          onRowReorder(newData);
        }

        return newData;
      });
    }
  }

  // FIX 5: Add loading state handling
  if (isLoading) {
    return (
      <div className="w-full">
        <div className="flex h-32 items-center justify-center">
          <div className="text-muted-foreground text-sm">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Tabs
      defaultValue="outline"
      className="w-full flex-col justify-start gap-6"
    >
      <TableToolbar
        table={table}
        showAddButton={showAddButton}
        onAddClick={onAddClick}
        searchValue={searchQuery}
        onSearchChange={(value) => {
          setSearchQuery(value);
          onSearch?.(value);
        }}
      />
      <TabsContent
        value="outline"
        className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
      >
        <div className="overflow-hidden rounded-lg border">
          {enableDragging ? (
            <DndContext
              collisionDetection={closestCenter}
              modifiers={[restrictToVerticalAxis]}
              onDragEnd={handleDragEnd}
              sensors={sensors}
              id={sortableId}
            >
              <Table>
                <TableHeader className="bg-muted sticky top-0 z-10">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id} colSpan={header.colSpan}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext(),
                                )}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody className="**:data-[slot=table-cell]:first:w-8">
                  {table?.getRowModel()?.rows?.length ? (
                    <SortableContext
                      items={dataIds}
                      strategy={verticalListSortingStrategy}
                    >
                      {table.getRowModel().rows.map((row) => (
                        <DraggableRow key={row.id} row={row} />
                      ))}
                    </SortableContext>
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="h-24 text-center"
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </DndContext>
          ) : (
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext(),
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className="**:data-[slot=table-cell]:first:w-8">
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
        <PaginationControls table={table} />
      </TabsContent>

      <TabsContent
        value="past-performance"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent value="key-personnel" className="flex flex-col px-4 lg:px-6">
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
      <TabsContent
        value="focus-documents"
        className="flex flex-col px-4 lg:px-6"
      >
        <div className="aspect-video w-full flex-1 rounded-lg border border-dashed"></div>
      </TabsContent>
    </Tabs>
  );
}
