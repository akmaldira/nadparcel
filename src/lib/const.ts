import { $Enums } from "@prisma/client";

export const INDEX_ROUTE = "/";
export const LOGIN_ROUTE = "/login";
export const REGISTER_ROUTE = "/register";
export const ADMIN_ROUTE = "/admin";
export const CASHIER_ROUTE = "/cashier";
export const WORKER_ROUTE = "/worker";

export const FORBIDDEN_ROUTE = "/forbidden";

export const ID_USER_ROLE = {
  ROOT: "Root",
  ADMIN: "Admin",
  CASHIER: "Kasir",
  WORKER: "Pekerja",
  USER: "Pengguna",
} as Record<$Enums.UserRole, string>;

export const ITEM_CATEGORIES = {
  CART: {
    id: "cm7iwzcxg00000clafc3b1kcx",
    name: "Keranjang",
  },
  ITEM: {
    id: "cm7iwzjvu00010clad0os2ef8",
    name: "Item",
  },
} as Record<string, { id: string; name: string }>;
