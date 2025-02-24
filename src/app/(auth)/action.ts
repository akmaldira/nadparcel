"use server";

import { signIn, signOut } from "@/lib/auth";
import { hashPassword } from "@/lib/bcrypt";
import { ADMIN_ROUTE, LOGIN_ROUTE } from "@/lib/const";
import { prisma } from "@/lib/prisma";
import { ServerAction } from "@/types/type";
import { User } from "@prisma/client";
import { AuthError } from "next-auth";
import { z } from "zod";
import { loginSchema, registerSchema } from "./schema";

export async function loginAction(
  values: z.infer<typeof loginSchema>
): Promise<ServerAction<null>> {
  try {
    await signIn("credentials", {
      ...values,
      redirect: false,
    });

    return {
      status: "success",
      data: null,
      redirect: ADMIN_ROUTE,
      message: "Anda berhasil masuk.",
    };
  } catch (error: any) {
    if (error instanceof AuthError) {
      return {
        status: "error",
        error: error.cause?.err?.message || "Terjadi kesalahan saat masuk.",
      };
    }
    return {
      status: "error",
      error: error.message,
    };
  }
}

export async function logoutAction() {
  await signOut();
}

export async function registerAction(
  values: z.infer<typeof registerSchema>
): Promise<ServerAction<Omit<User, "password">>> {
  try {
    const isEmailExists = await prisma.user.findUnique({
      where: { email: values.email },
    });

    if (isEmailExists) {
      return {
        status: "error",
        error: "Email sudah terdaftar",
      };
    }

    const user = await prisma.user.create({
      data: {
        name: values.name,
        email: values.email,
        password: hashPassword(values.password),
      },
    });

    const { password, ...userData } = user;

    return {
      status: "success",
      data: userData,
      message: "Berhasil mendaftar, silahkan login",
      redirect: LOGIN_ROUTE,
    };
  } catch (error: any) {
    return {
      status: "error",
      error: error.message,
    };
  }
}
