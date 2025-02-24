"use server";

import { handleActionError, ServerActionException } from "@/lib/action-utils";
import { getUserAndValidateRoles } from "@/lib/auth";
import { hashPassword } from "@/lib/bcrypt";
import { FORBIDDEN_ROUTE } from "@/lib/const";
import { prisma } from "@/lib/prisma";
import { ServerAction } from "@/types/type";
import { User } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addUserSchema } from "./schema";

export async function deleteUserAction(
  id: string
): Promise<ServerAction<User>> {
  try {
    const user = await getUserAndValidateRoles({
      roles: ["ROOT"],
      forceRedirect: false,
    });

    if (!user) {
      return handleActionError(
        new ServerActionException({
          error: "Anda tidak memiliki akses untuk melakukan aksi ini",
          redirect: FORBIDDEN_ROUTE,
        })
      );
    }

    if (id == user.id) {
      return handleActionError(
        new ServerActionException({
          error: "Anda tidak dapat menghapus akun Anda sendiri",
        })
      );
    }

    const deletedUser = await prisma.user.delete({
      where: {
        id,
      },
    });

    revalidatePath("/admin/user");
    return {
      status: "success",
      data: deletedUser,
      message: "Pengguna berhasil dihapus",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function addUserAcion(
  values: z.infer<typeof addUserSchema>
): Promise<ServerAction<Omit<User, "password">>> {
  try {
    const user = await getUserAndValidateRoles({
      roles: ["ROOT"],
      forceRedirect: false,
    });

    if (!user) {
      return handleActionError(
        new ServerActionException({
          error: "Anda tidak memiliki akses untuk melakukan aksi ini",
          redirect: FORBIDDEN_ROUTE,
        })
      );
    }

    const data = await addUserSchema.parseAsync(values);

    const isEmailExists = await prisma.user.findUnique({
      where: {
        email: data.email,
      },
    });

    if (isEmailExists) {
      return handleActionError(
        new ServerActionException({
          error: "Email sudah terdaftar",
        })
      );
    }

    const createdUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashPassword(data.password),
        role: data.role,
      },
    });

    const { password, ...userData } = createdUser;

    revalidatePath("/admin/user");
    return {
      status: "success",
      data: userData,
      message: "Berhasil menambahkan pengguna",
    };
  } catch (error) {
    return handleActionError(error);
  }
}
