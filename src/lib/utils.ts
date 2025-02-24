import { ServerAction } from "@/types/type";
import { $Enums } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { ADMIN_ROUTE, CASHIER_ROUTE, INDEX_ROUTE, WORKER_ROUTE } from "./const";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nextRouteByRole(userRole: $Enums.UserRole) {
  if (["ROOT", "ADMIN"].includes(userRole)) {
    return ADMIN_ROUTE;
  } else if (["CASHIER"].includes(userRole)) {
    return CASHIER_ROUTE;
  } else if (["WORKER"].includes(userRole)) {
    return WORKER_ROUTE;
  }
  return INDEX_ROUTE;
}

export function handleActionResponse<T>(response: ServerAction<T>) {
  if (response.redirect) {
    window.location.href = response.redirect;
  }
  if (response.status === "success") {
    if (response.message) toast.success(response.message);
    return response.data;
  } else {
    toast.error(response.error);
    return null;
  }
}

export function formatCurrency(
  amount: number,
  currency: string = "IDR",
  locale: string = "id-ID"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date, locale: string = "id-ID") {
  return new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  }).format(date);
}

export function formatNumber(number: number, locale: string = "id-ID") {
  return new Intl.NumberFormat(locale, {
    minimumFractionDigits: 0,
  }).format(number);
}
