"use server";

import { handleActionError, ServerActionException } from "@/lib/action-utils";
import { getUserAndValidateRoles } from "@/lib/auth";
import { FORBIDDEN_ROUTE } from "@/lib/const";
import { prisma } from "@/lib/prisma";
import { uploadFile } from "@/lib/uploader";
import { ServerAction } from "@/types/type";
import { Parcel } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { addParcelSchema } from "./schema";

export async function addParcelAction(
  values: z.infer<typeof addParcelSchema>
): Promise<ServerAction<Parcel>> {
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

    const data = await addParcelSchema.parseAsync(values);

    const urls = [] as string[];
    if (data.images && data.images.length > 0) {
      for (const image of data.images) {
        const path = await uploadFile(image);
        urls.push(path);
      }
    }

    if (data.cartId && data.cartId !== "" && data.cartId !== "null") {
      const cart = await prisma.item.findUnique({
        where: {
          id: data.cartId,
        },
      });

      if (!cart) {
        return handleActionError(
          new ServerActionException({
            error: "Keranjang yang dipilih tidak ditemukan",
          })
        );
      }
    }

    const items = await prisma.item.findMany({
      where: {
        id: {
          in: data.items.map((item) => item.id),
        },
      },
    });

    if (items.length !== data.items.length) {
      return handleActionError(
        new ServerActionException({
          error: "Item yang dipilih tidak ditemukan",
        })
      );
    }

    const parcel = await prisma.parcel.create({
      data: {
        name: data.name,
        price: data.price,
        workerWage: data.workerWage,
        images: urls,
        createdBy: user.email!,
        cartId:
          data.cartId && data.cartId !== "" && data.cartId !== "null"
            ? data.cartId
            : null,
        items: {
          createMany: {
            data: data.items.map((item) => ({
              itemId: item.id,
              quantity: item.quantity,
            })),
          },
        },
      },
    });

    revalidatePath("/admin/parcel");
    return {
      status: "success",
      data: parcel,
      redirect: "/admin/parcel",
      message: "Parsel berhasil ditambahkan",
    };
  } catch (error) {
    return handleActionError(error);
  }
}

export async function deleteParcelAction(
  id: string
): Promise<ServerAction<Parcel>> {
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

    const parcel = await prisma.parcel.findUnique({
      where: {
        id,
      },
    });

    if (!parcel) {
      return handleActionError(
        new ServerActionException({
          error: "Parsel tidak ditemukan",
        })
      );
    }

    const [deletedParcel, _deletedItems] = await prisma.$transaction([
      prisma.parcel.update({
        where: {
          id,
        },
        data: {
          deletedAt: new Date(),
          deletedBy: user.email!,
        },
      }),
      prisma.parcelToItem.updateMany({
        where: {
          parcelId: id,
        },
        data: {
          deletedAt: new Date(),
        },
      }),
    ]);

    revalidatePath("/admin/parcel");
    return {
      status: "success",
      data: deletedParcel,
      message: "Parsel berhasil dihapus",
    };
  } catch (error) {
    return handleActionError(error);
  }
}
