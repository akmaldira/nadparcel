import { prisma } from "@/lib/prisma";
import ParcelTable from "./table";

export default async function ParcelPage() {
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
  return (
    <div>
      <ParcelTable parcels={parcels} />
    </div>
  );
}
