import { z } from "zod";

export const addItemSchema = z
  .object({
    name: z
      .string()
      .min(1, "Nama tidak boleh kosong")
      .max(255, "Nama terlalu panjang"),
    stock: z.coerce.number().min(0, "Stock tidak boleh kurang dari 0"),
    priceEachItem: z.coerce.number().min(0, "Harga tidak boleh kurang dari 0"),
    categoryId: z.string().min(1, "Kategori tidak boleh kosong"),
  })
  .refine((v) => !(v.stock > 0) || v.priceEachItem > 0, {
    message: "Harga harus diisi jika stock lebih dari 0",
    path: ["priceEachItem"],
  });

export const incrementStockSchema = z
  .object({
    id: z.string(),
    stock: z.coerce.number().min(0, "Stock tidak boleh kurang dari 0"),
    priceEachItem: z.coerce.number().min(0, "Harga tidak boleh kurang dari 0"),
    notes: z.optional(z.string()),
  })
  .refine((v) => v.stock > 0, {
    message: "Penambahan stok harus lebih dari 0",
    path: ["stock"],
  })
  .refine((v) => !(v.stock > 0) || v.priceEachItem > 0, {
    message: "Harga harus diisi jika stock lebih dari 0",
    path: ["priceEachItem"],
  });

export const editItemSchema = z.object({
  id: z.string().min(1, "ID tidak boleh kosong"),
  name: z
    .string()
    .min(1, "Nama tidak boleh kosong")
    .max(255, "Nama terlalu panjang"),
  maxPrice: z.coerce.number().min(0, "Harga tidak boleh kurang dari 0"),
});
