"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { ColumnDef } from "@tanstack/react-table";

import BadgeRole from "@/components/badge-role";
import { ActionDialog } from "@/components/data-table/action-dialog";
import { formatDate } from "@/lib/utils";
import { User } from "@prisma/client";
import DeleteUserDialog from "./delete-dialog";

export const columns: ColumnDef<Omit<User, "password">>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Nama" className="px-2" />
    ),
    filterFn: (row, _, filterValues) => {
      const userInfoString = [
        row.original.name?.toLowerCase(),
        row.original.email.toLowerCase(),
        row.original.role.toLowerCase(),
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => <BadgeRole role={row.original.role} />,
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Dibuat Pada" />
    ),
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
      const actionItems = [<DeleteUserDialog key={1} user={user} />];

      return <ActionDialog items={actionItems} />;
    },
  },
];
