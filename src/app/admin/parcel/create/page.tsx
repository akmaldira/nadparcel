import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ITEM_CATEGORIES } from "@/lib/const";
import { prisma } from "@/lib/prisma";
import CreateParcelForm from "./form";

export default async function CreateParcelPage() {
  const cartCategory = ITEM_CATEGORIES.CART;
  const itemCategory = ITEM_CATEGORIES.ITEM;

  const carts = await prisma.item.findMany({
    where: {
      categoryId: cartCategory.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  const items = await prisma.item.findMany({
    where: {
      categoryId: itemCategory.id,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div>
      <Card className="mb-10">
        <CardHeader>Buat Parsel Baru</CardHeader>
        <CardContent>
          <CreateParcelForm items={items} carts={carts} />
        </CardContent>
      </Card>
    </div>
  );
}
