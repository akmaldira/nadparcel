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

import { Item } from "@prisma/client";
import { Trash } from "lucide-react";
import React from "react";
import { deleteItemAction } from "../action";

export default function DeleteItemDialog({ item }: { item: Item }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const onDelete = async () => {
    startTransition(async () => {
      const response = await deleteItemAction(item.id);
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
          <DialogTitle>Apakah anda yakin ingin menghapus item ini?</DialogTitle>
          <DialogDescription>
            {item.name} akan dihapus secara permanen dan tidak dapat dipulihkan
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
