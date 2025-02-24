"use client";

import { ActionDialog } from "@/components/data-table/action-dialog";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { ItemWithHistories } from "@/types/type";
import { ColumnDef } from "@tanstack/react-table";
import DeleteItemDialog from "./delete-dialog";
import IncrementStockDialog from "./increment-stock";
import ItemStockHistory from "./stock-history";

export const columns: ColumnDef<ItemWithHistories>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" className="px-2" />
    ),
    filterFn: (row, _, filterValues) => {
      const userInfoString = [row.original.name?.toLowerCase()]
        .filter(Boolean)
        .join(" ");

      const searchTerms = Array.isArray(filterValues)
        ? filterValues
        : [filterValues];

      return searchTerms.some((term) =>
        userInfoString.includes(term.toLowerCase())
      );
    },
  },
  {
    accessorKey: "stock",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Sisa Stok" />
    ),
    cell: ({ row }) => formatNumber(row.original.stock),
  },
  {
    accessorKey: "maxPrice",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Harga Tertinggi" />
    ),
    cell: ({ row }) => formatCurrency(row.original.maxPrice),
  },
  {
    accessorKey: "histories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Riwayat Stok" />
    ),
    cell: ({ row }) => <ItemStockHistory item={row.original} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const item = row.original;
      const actionItems = [
        <IncrementStockDialog
          key={1}
          item={item}
          categoryId={item.categoryId}
        />,
        <DeleteItemDialog key={2} item={item} />,
      ];

      return <ActionDialog items={actionItems} />;
    },
  },
];
