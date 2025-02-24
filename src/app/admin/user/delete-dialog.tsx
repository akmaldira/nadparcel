"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { handleActionResponse } from "@/lib/utils";

import { User } from "@prisma/client";
import { Trash } from "lucide-react";
import React from "react";
import { deleteUserAction } from "./action";

export default function DeleteUserDialog({
  user,
}: {
  user: Omit<User, "password">;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const onDelete = async () => {
    startTransition(async () => {
      const response = await deleteUserAction(user.id);
      handleActionResponse(response);
      setDialogOpen(false);
    });
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          <Trash />
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Apakah anda yakin ingin menghapus pengguna ini?
          </DialogTitle>
          <DialogDescription>
            {user.name} akan dihapus secara permanen dan tidak dapat dipulihkan
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center gap-4 mt-4">
          <Button className="w-full" onClick={() => setDialogOpen(false)}>
            Batal
          </Button>
          <Button
            className="w-full"
            variant="destructive"
            disabled={isPending}
            onClick={() => onDelete()}
          >
            {isPending ? "Hapus..." : "Hapus"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
