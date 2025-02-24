"use server";

import { handleActionError, ServerActionException } from "@/lib/action-utils";
import { getUserAndValidateRoles } from "@/lib/auth";
import { FORBIDDEN_ROUTE } from "@/lib/const";
import { prisma } from "@/lib/prisma";
import { ItemWithHistories, ServerAction } from "@/types/type";
import { Item } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addItemSchema, incrementStockSchema } from "./schema";

export async function addItemAction(
  values: z.infer<typeof addItemSchema>
): Promise<ServerAction<Item>> {
  try {
    const user = await getUserAndValidateRoles({
      roles: ["ROOT", "ADMIN"],
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

    const data = await addItemSchema.parseAsync(values);

    const item = await prisma.item.create({
      data: {
        name: data.name,
        createdBy: user.email!,
        stock: data.stock,
        categoryId: data.categoryId,
        histories:
          data.stock > 0
            ? {
                create: {
                  updatedStock: data.stock,
                  priceEachItem: data.priceEachItem,
                  createdBy: user.email!,
                },
              }
            : undefined,
      },
      include: {
        histories: data.stock > 0,
      },
    });

    revalidatePath("/admin/item");
    return {
      status: "success",
      data: item,
      message: "Item berhasil ditambahkan",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function getItemListAction(
  categoryId: string
): Promise<ServerAction<Item[]>> {
  try {
    const user = await getUserAndValidateRoles({
      roles: ["ROOT", "ADMIN"],
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

    const items = await prisma.item.findMany({
      where: {
        categoryId: categoryId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      status: "success",
      data: items,
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function incrementStockAction(
  values: z.infer<typeof incrementStockSchema>
): Promise<ServerAction<ItemWithHistories>> {
  try {
    const user = await getUserAndValidateRoles({
      roles: ["ROOT", "ADMIN"],
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

    const item = await prisma.item.findUnique({
      where: {
        id: values.id,
      },
    });

    if (!item) {
      return handleActionError(
        new ServerActionException({
          error: "Item tidak ditemukan",
        })
      );
    }

    const updatedItem = await prisma.item.update({
      where: {
        id: item.id,
      },
      data: {
        stock: {
          increment: values.stock,
        },
        histories: {
          create: {
            updatedStock: values.stock,
            priceEachItem: values.priceEachItem,
            createdBy: user.email!,
            notes: values.notes || null,
          },
        },
      },
      include: {
        histories: true,
      },
    });

    revalidatePath("/admin/item");
    return {
      status: "success",
      data: updatedItem,
      message: "Stock item berhasil diperbarui",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteItemAction(
  id: string
): Promise<ServerAction<Item>> {
  try {
    const user = await getUserAndValidateRoles({
      roles: ["ROOT", "ADMIN"],
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

    const item = await prisma.item.findUnique({
      where: {
        id,
      },
    });

    if (!item) {
      return handleActionError(
        new ServerActionException({
          error: "Item tidak ditemukan",
        })
      );
    }

    const [deletedItem, _deletedItemHistories] = await prisma.$transaction([
      prisma.item.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
          deletedBy: user.email!,
        },
      }),
      prisma.itemHistory.updateMany({
        where: {
          itemId: id,
        },
        data: {
          deletedAt: new Date(),
          deletedBy: user.email!,
        },
      }),
    ]);

    revalidatePath("/admin/item");
    return {
      status: "success",
      data: deletedItem,
      message: "Item berhasil dihapus",
    };
  } catch (error) {
    return handleActionError(error);
  }
}
