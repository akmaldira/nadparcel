import { z } from "zod";

export const addParcelSchema = z.object({
  name: z
    .string()
    .min(1, "Nama tidak boleh kosong")
    .max(255, "Nama terlalu panjang"),
  price: z.coerce.number().min(0, "Harga tidak boleh kurang dari 0"),
  workerWage: z.coerce
    .number()
    .min(0, "Upah Pekerja tidak boleh kurang dari 0"),
  images: z
    .array(
      z.instanceof(File).refine((file) => file.size < 5 * 1024 * 1024, {
        message: "Maksimal ukuran gambar adalah 5MB",
      })
    )
    .max(5, {
      message: "Maksimal 5 gambar",
    })
    .nullable(),
  cartId: z.string().nullable(),
  items: z
    .array(
      z.object({
        id: z.string().min(1, "Item harus dipilih"),
        quantity: z.coerce.number().min(1).default(1),
      })
    )
    .min(1),
});
