import { ServerActionError } from "@/types/type";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import "server-only";
import { ZodError } from "zod";

export class ServerActionException extends Error {
  redirect: string | undefined;

  constructor({ error, redirect }: { error: string; redirect?: string }) {
    super(error);
    this.name = "ServerActionException";
    this.redirect = redirect;
  }
}

export function handleActionError(error: unknown): ServerActionError {
  if (isRedirectError(error)) {
    return {
      status: "error",
      error: "Anda dialihkan dari aksi ini",
      redirect: "/forbidden", // need change in the future
    };
  } else if (error instanceof ServerActionException) {
    return {
      status: "error",
      error: error.message,
      redirect: error.redirect,
    };
  } else if (error instanceof ZodError) {
    const message = error.errors
      .map((err) => `Inputan yang anda kirim tidak valid: ${err.message}`)
      .join(", ");
    return {
      status: "error",
      error: message,
    };
  } else if (error instanceof Error) {
    return {
      status: "error",
      error: error.message,
    };
  }

  return {
    status: "error",
    error: "Terjadi kesalahan tidak diketahui",
  };
}
