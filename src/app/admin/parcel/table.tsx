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

import { buttonVariants } from "@/components/ui/button";
import { ADMIN_ROUTE } from "@/lib/const";
import { cn } from "@/lib/utils";
import { ParcelWithRelation } from "@/types/type";
import { Plus } from "lucide-react";
import Link from "next/link";
import { columns } from "./columns";

export default function ParcelTable({
  parcels,
}: {
  parcels: ParcelWithRelation[];
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data: parcels,
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
            placeholder="Cari parsel..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <Link
            href={ADMIN_ROUTE + "/parcel/create"}
            className={cn(buttonVariants())}
          >
            <Plus />
            Parcel
          </Link>
        </div>
      </DataTableHeader>
    </DataTable>
  );
}
