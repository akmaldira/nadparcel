import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CashierItem, ParcelWithRelation } from "@/types/type";
import Image from "next/image";

export default function ParcelCard({
  item,
  onSelect,
}: {
  item: ParcelWithRelation;
  onSelect: (data: CashierItem) => void;
}) {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden flex flex-col border transition-all duration-300 ease-in-out hover:shadow-lg">
      <div className="relative w-full pt-[100%] bg-background/50">
        <Image
          src={item.images[0] || "/no-image.png"}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
          className="transition-all duration-300 ease-in-out"
          style={{
            objectFit: "contain",
          }}
        />
      </div>
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <h2 className="text-lg font-semibold">{item.name}</h2>
        <p className="text-base">{formatCurrency(item.price)}</p>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
          {item.description}
        </p>
        <Button
          className="w-full mt-2"
          onClick={() =>
            onSelect({
              type: "parcel",
              id: item.id,
              name: item.name,
              price: item.price,
              quantity: 1,
            })
          }
        >
          Tambah
        </Button>
      </div>
    </div>
  );
}
