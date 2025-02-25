import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { CashierItem } from "@/types/type";
import { Item } from "@prisma/client";

export default function CartCard({
  item,
  onSelect,
}: {
  item: Item;
  onSelect: (data: CashierItem) => void;
}) {
  return (
    <div className="bg-card text-card-foreground rounded-lg shadow-md overflow-hidden flex flex-col border transition-all duration-300 ease-in-out hover:shadow-lg">
      <div className="p-4 flex flex-col gap-2 flex-grow justify-between">
        <div>
          <h2 className="text-lg font-semibold">{item.name}</h2>
          <p className="text-base">{formatCurrency(item.maxPrice)}</p>
        </div>
        <Button
          className="w-full mt-2"
          onClick={() =>
            onSelect({
              type: "cart",
              id: item.id,
              name: item.name,
              price: item.maxPrice,
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
