"use client";

import { DataTable, DataTableHeader } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
import { ItemWithHistories } from "@/types/type";
import {
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import React from "react";
import AddItemDialog from "./add-dialog";
import { columns } from "./columns";
import IncrementStockDialog from "./increment-stock";

export default function ItemTable({
  items,
  categoryId,
}: {
  items: ItemWithHistories[];
  categoryId: string;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: items,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
  });
  return (
    <DataTable columns={columns} table={table}>
      <DataTableHeader>
        <div className="flex items-center justify-between gap-4 w-full">
          <Input
            placeholder="Cari item..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="flex items-center gap-4">
            <IncrementStockDialog categoryId={categoryId} />
            <AddItemDialog categoryId={categoryId} />
          </div>
        </div>
      </DataTableHeader>
    </DataTable>
  );
}
