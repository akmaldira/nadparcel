import { ITEM_CATEGORIES } from "@/lib/const";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  const categories = Object.values(ITEM_CATEGORIES);

  await prisma.$transaction(
    categories.map((category) =>
      prisma.itemCategory.upsert({
        where: {
          id: category.id,
        },
        create: category,
        update: {
          name: category.name,
        },
      })
    )
  );
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
