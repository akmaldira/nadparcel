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
import { Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { addItemAction } from "../action";
import { addItemSchema } from "../schema";

export default function AddItemDialog({ categoryId }: { categoryId: string }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof addItemSchema>>({
    resolver: zodResolver(addItemSchema),
    defaultValues: {
      name: "",
      stock: 0,
      priceEachItem: 0,
      categoryId: categoryId,
    },
  });

  function onSubmit(values: z.infer<typeof addItemSchema>) {
    startTransition(async () => {
      const response = await addItemAction(values);
      handleActionResponse(response);
      setDialogOpen(false);
      form.reset();
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus />
          Keranjang
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Keranjang</DialogTitle>
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
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Stok Awal (pcs)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: 100"
                      {...field}
                      type="number"
                      min={0}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <MoneyInput
              form={form}
              name="priceEachItem"
              label="Harga Satuan"
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
