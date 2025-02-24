"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { ColumnDef } from "@tanstack/react-table";

import { ActionDialog } from "@/components/data-table/action-dialog";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ParcelWithRelation } from "@/types/type";
import DeleteParcelDialog from "./delete-dialog";
import ImageDialog from "./image-dialog";
import ItemDialog from "./item-dialog";
import RevenueDialog from "./revenue-dialog";

export const columns: ColumnDef<ParcelWithRelation>[] = [
  {
    accessorKey: "images",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Gambar" className="px-2" />
    ),
    cell: ({ row }) => <ImageDialog parcel={row.original} />,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" />
    ),
    filterFn: (row, _, filterValues) => {
      const userInfoString = [
        row.original.name?.toLowerCase(),
        formatCurrency(row.original.price),
        formatDate(row.original.createdAt).toLowerCase(),
      ]
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
    accessorKey: "cart",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Keranjang" />
    ),
    cell: ({ row }) => row.original.cart?.name || "Tidak Pakai Keranjang",
  },
  {
    accessorKey: "items",
    header: "Item",
    cell: ({ row }) => <ItemDialog parcel={row.original} />,
  },
  {
    accessorKey: "revenue",
    header: "Keuntungan",
    cell: ({ row }) => <RevenueDialog parcel={row.original} />,
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const parcel = row.original;
      const actionItems = [<DeleteParcelDialog key={1} parcel={parcel} />];

      return <ActionDialog items={actionItems} />;
    },
  },
];
