import { ITEM_CATEGORIES } from "@/lib/const";
import { prisma } from "@/lib/prisma";
import ItemTable from "./table";

export default async function AdminItemPage() {
  const itemCategory = ITEM_CATEGORIES.CART;

  const items = await prisma.item.findMany({
    where: {
      categoryId: itemCategory.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      histories: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  return (
    <div>
      <ItemTable items={items} categoryId={itemCategory.id} />
    </div>
  );
}
