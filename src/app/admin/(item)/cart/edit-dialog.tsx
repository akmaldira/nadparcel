"use client";

import MoneyInput from "@/components/money-input-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { handleActionResponse } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import { Pencil } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { editItemAction } from "../action";
import { editItemSchema } from "../schema";

export default function EditCartDialog({ item }: { item: Item }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof editItemSchema>>({
    resolver: zodResolver(editItemSchema),
    defaultValues: {
      id: item.id,
      name: item.name,
      maxPrice: item.maxPrice,
    },
  });

  function onSubmit(values: z.infer<typeof editItemSchema>) {
    startTransition(async () => {
      const response = await editItemAction(values);
      handleActionResponse(response);
      setDialogOpen(false);
      form.reset();
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full">
          <Pencil />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Keranjang</DialogTitle>
          <DialogDescription>
            Pastikan data yang diinputkan sudah benar
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Keranjang Tingkat 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MoneyInput
              form={form}
              name="maxPrice"
              label="Harga Tertinggi"
              placeholder="Contoh: 20.000"
            />
            <div className="flex items-center pt-4">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
