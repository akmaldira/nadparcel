import { z } from "zod";

const transactionItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  price: z.coerce.number(),
  quantity: z.coerce.number(),
  type: z.enum(["cart", "parcel"]),
});

export const addTransactionSchema = z.object({
  costumerName: z
    .string()
    .min(1, "Nama tidak boleh kosong")
    .max(255, "Nama terlalu panjang"),
  costumerPhone: z.string().nullable(),
  items: z
    .array(transactionItemSchema)
    .min(1, "Anda harus memilih item untuk membuat orderan"),
  totalPrice: z.coerce.number(),
  priceAfterDiscount: z.coerce.number(),
  downPayment: z.coerce.number(),
  paymentMethod: z.enum(["CASH", "TRANSFER"]),
  printPriceAfterDiscount: z.boolean().default(false).optional(),
  notes: z.string().nullable(),
});
