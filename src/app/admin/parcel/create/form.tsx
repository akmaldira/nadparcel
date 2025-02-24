"use client";

import FileUploadIcon from "@/components/icon/file-upload";
import MoneyInput from "@/components/money-input";
import { Button } from "@/components/ui/button";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@/components/ui/file-uploader";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn, formatCurrency, handleActionResponse } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { Item } from "@prisma/client";
import { Plus, Trash } from "lucide-react";
import Image from "next/image";
import React from "react";
import { DropzoneOptions } from "react-dropzone";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { addParcelAction } from "../action";
import { addParcelSchema } from "../schema";
import SelectItemComponent from "./select-item";

const tempKey = "create_parcel";
export default function CreateParcelForm({
  items,
  carts,
}: {
  items: Item[];
  carts: Item[];
}) {
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<z.infer<typeof addParcelSchema>>({
    resolver: zodResolver(addParcelSchema),
    defaultValues: {
      name: "",
      price: 0,
      workerWage: 0,
      images: [],
      cartId: null,
      items: [
        {
          id: "",
          quantity: 1,
        },
      ],
    },
  });
  const watch = form.watch();

  function getTempItem() {
    const tempItem = localStorage.getItem(tempKey);
    if (tempItem) {
      try {
        const tempItemJson = JSON.parse(tempItem) as z.infer<
          typeof addParcelSchema
        >;
        return tempItemJson;
      } catch (_) {
        //
      }
    }
    return undefined;
  }

  React.useEffect(() => {
    const tempItem = getTempItem();
    if (tempItem) {
      form.reset(tempItem);
      setTimeout(() => {
        form.setValue("cartId", tempItem.cartId || null);
      }, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  form.watch((value) => {
    const baseValue = getTempItem();
    localStorage.setItem(
      tempKey,
      JSON.stringify({
        name: value.name || baseValue?.name || "",
        price: value.price || baseValue?.price || 0,
        workerWage: value.workerWage || baseValue?.workerWage || 0,
        images: [],
        cartId: value.cartId || baseValue?.cartId || null,
        items: value.items || baseValue?.items || [],
      })
    );
  });

  function onSubmit(values: z.infer<typeof addParcelSchema>) {
    startTransition(async () => {
      const response = await addParcelAction(values);
      handleActionResponse(response);
      form.reset();
      setTimeout(() => {
        localStorage.removeItem(tempKey);
      }, 0);
    });
  }

  const dropZoneConfig = {
    multiple: true,
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".gif", ".webp", ".svg", ".heic"],
    },
  } satisfies DropzoneOptions;

  const {
    fields: fieldItems,
    remove: removeItem,
    append: addItem,
  } = useFieldArray({
    name: "items",
    control: form.control,
  });

  function calculateBasePrice() {
    let basePrice = 0;
    if (watch.cartId) {
      const cart = carts.find((i) => i.id === watch.cartId);
      if (cart) {
        basePrice += cart.maxPrice;
      }
    }
    watch.items.forEach((item) => {
      const baseItem = items.find((i) => i.id === item.id);
      if (baseItem) {
        basePrice += baseItem.maxPrice * item.quantity;
      }
    });
    basePrice += watch.workerWage;
    return basePrice;
  }

  function calculateRevenue() {
    let revenue = 0;
    const basePrice = calculateBasePrice();

    revenue += watch.price - basePrice;
    return revenue;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="images"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Foto Parsel (Boleh Kosong)</FormLabel>
              <FileUploader
                value={field.value}
                onValueChange={field.onChange}
                dropzoneOptions={dropZoneConfig}
                className="relative bg-background rounded-lg p-2"
              >
                <FileInput className="outline-dashed outline-1 outline-white">
                  <div className="flex items-center justify-center flex-col pt-3 pb-4 w-full ">
                    <FileUploadIcon
                      acceptedExts={Object.values(
                        dropZoneConfig.accept["image/*"]
                      ).map((ext) => ext.slice(1).toUpperCase())}
                    />
                  </div>
                </FileInput>
                <FileUploaderContent className="flex items-center flex-row gap-2">
                  {field &&
                    field.value &&
                    field.value.length > 0 &&
                    field.value.map((file, i) => (
                      <FileUploaderItem
                        key={i}
                        index={i}
                        className="w-56 h-56 p-0 rounded-md overflow-hidden"
                        aria-roledescription={`file ${i + 1} containing ${
                          file.name
                        }`}
                      >
                        <Image
                          src={URL.createObjectURL(file)}
                          alt={file.name}
                          fill
                          className="p-0 object-contain"
                        />
                      </FileUploaderItem>
                    ))}
                </FileUploaderContent>
              </FileUploader>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama Parsel</FormLabel>
              <FormControl>
                <Input placeholder="Contoh: Paket Parsel 300" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="cartId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keranjang</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value || undefined}
                value={field.value || undefined}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih keranjang" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="null">
                    Tidak pakai keranjang (Rp 0)
                  </SelectItem>
                  {carts.map((cart) => (
                    <SelectItem key={cart.id} value={cart.id}>
                      {cart.name} ({formatCurrency(cart.maxPrice)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-end gap-4 w-full">
          {fieldItems.map((item, index) => (
            <div key={item.id} className="flex items-end gap-2 w-full">
              <FormField
                control={form.control}
                name={`items.${index}.id`}
                render={({ field }) => (
                  <FormItem className="flex flex-col w-full">
                    {index == 0 && <FormLabel>Nama Item</FormLabel>}
                    <SelectItemComponent
                      inputedItems={watch.items}
                      field={field}
                      items={items}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`items.${index}.quantity`}
                render={({ field }) => (
                  <FormItem className="w-20">
                    {index == 0 && <FormLabel>Jumlah</FormLabel>}
                    <FormMessage />
                    <FormControl>
                      <Input
                        placeholder="Contoh: 2"
                        {...field}
                        type="number"
                        min={1}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <Button
                variant="destructive"
                size="icon"
                type="button"
                disabled={index == 0}
                onClick={() => removeItem(index)}
              >
                <Trash />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            onClick={() => addItem({ id: "", quantity: 1 })}
          >
            <Plus /> Tambah Item
          </Button>
        </div>
        <MoneyInput
          form={form}
          name="workerWage"
          label="Upah Pekerja Untuk Parsel Ini"
          placeholder="Contoh: 8.000"
        />
        <MoneyInput
          form={form}
          name="price"
          label="Harga Jual"
          placeholder="Contoh: 300.000"
        />
        <div>
          <div className="flex items-center w-full gap-4">
            <div className="flex flex-col gap-3 w-full pt-2">
              <Label>Harga Modal</Label>
              <Input
                value={formatCurrency(calculateBasePrice())}
                readOnly
                disabled
              />
            </div>
            <div className="flex flex-col gap-3 w-full pt-2">
              <Label>Keuntungan Kasar</Label>
              <Input
                value={`${formatCurrency(calculateRevenue())}`}
                readOnly
                disabled
                className={cn(
                  calculateRevenue() < 0 ? "text-red-500" : "text-green-500"
                )}
              />
            </div>
          </div>
          <p className="text-base mt-2 text-gray-500">
            Catatan: Kalkulasi keuntungan berdasarkan tipe keranjang dan item
            yang diisi pada saat membuat parsel, belum ada kalkulasi dengan lem,
            plastik, dll.
          </p>
        </div>
        <div className="flex w-full justify-end pt-4">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Menyimpan..." : "Simpan"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
