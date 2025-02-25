import { ITEM_CATEGORIES } from "@/lib/const";
import { prisma } from "@/lib/prisma";
import CashierClientPage from "./client";

export default async function CashierPage() {
  const cartCategory = ITEM_CATEGORIES.CART;
  const parcels = await prisma.parcel.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      cart: true,
      items: {
        include: {
          item: true,
        },
      },
    },
  });

  const carts = await prisma.item.findMany({
    where: {
      categoryId: cartCategory.id,
    },
    orderBy: {
      name: "asc",
    },
  });
  return (
    <div>
      <CashierClientPage parcels={parcels} carts={carts} />
    </div>
  );
}
