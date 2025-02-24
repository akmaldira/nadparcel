"use client";

import { DataTable, DataTableHeader } from "@/components/data-table/data-table";
import { Input } from "@/components/ui/input";
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

import { User } from "@prisma/client";
import AddUserDialog from "./add-dialog";
import { columns } from "./columns";

export default function UserTable({
  users,
}: {
  users: Omit<User, "password">[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: users,
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
            placeholder="Cari pengguna..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <AddUserDialog />
        </div>
      </DataTableHeader>
    </DataTable>
  );
}
