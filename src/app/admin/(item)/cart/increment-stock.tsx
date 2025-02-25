"use client";

import MoneyInput from "@/components/money-input-form";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { AutosizeTextarea } from "@/components/ui/auto-resize-textarea";
import { Input } from "@/components/ui/input";
import { cn, handleActionResponse } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getItemListAction, incrementStockAction } from "../action";
import { incrementStockSchema } from "../schema";

export default function IncrementStockDialog({
  item,
  categoryId,
}: {
  item?: Item;
  categoryId: string;
}) {
  const [items, setItems] = React.useState<Item[]>([]);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<z.infer<typeof incrementStockSchema>>({
    resolver: zodResolver(incrementStockSchema),
    defaultValues: {
      id: item?.id || "",
      stock: 0,
      priceEachItem: 0,
      notes: "",
    },
  });

  React.useEffect(() => {
    if (!dialogOpen) {
      form.reset();
    }

    if (item) {
      setItems([item]);
    } else {
      startTransition(async () => {
        const response = await getItemListAction(categoryId);
        const data = handleActionResponse(response);
        if (data) {
          setItems(data);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item, dialogOpen]);

  function onSubmit(values: z.infer<typeof incrementStockSchema>) {
    startTransition(async () => {
      const response = await incrementStockAction(values);
      handleActionResponse(response);
      setDialogOpen(false);
      form.reset();
    });
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="w-full" variant={item ? "default" : "secondary"}>
          <Plus />
          Stok
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Stok {item && item.name}</DialogTitle>
          <DialogDescription>
            Pastikan data yang diinputkan sudah benar
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Nama Keranjang</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                          disabled={!!item}
                        >
                          {field.value
                            ? items.find((item) => item.id === field.value)
                                ?.name
                            : "Pilih keranjang"}
                          <ChevronsUpDown className="opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Command>
                        <CommandInput
                          placeholder="Cari keranjang..."
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>Tidak ada keranjang</CommandEmpty>
                          <CommandGroup>
                            {items.map((item) => (
                              <CommandItem
                                value={item.id}
                                key={item.id}
                                onSelect={() => {
                                  form.setValue("id", item.id);
                                }}
                              >
                                {item.name}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    item.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="stock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Penambahan Stok (pcs)</FormLabel>
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
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="notes">Catatan (Boleh Kosong)</FormLabel>
                  <FormControl>
                    <AutosizeTextarea id="notes" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center pt-4">
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? "Menambah..." : "Tambah Stok"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
