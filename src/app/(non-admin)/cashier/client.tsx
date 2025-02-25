"use client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CashierItem, ParcelWithRelation } from "@/types/type";
import { Item } from "@prisma/client";
import React from "react";
import CartCard from "./cart-card";
import CashierForm from "./form";
import ParcelCard from "./parcel-card";

export default function CashierClientPage({
  parcels,
  carts,
}: {
  parcels: ParcelWithRelation[];
  carts: Item[];
}) {
  const [showBill, setShowBill] = React.useState(false);
  const [selectedItems, setSelectedItems] = React.useState<CashierItem[]>([]);

  React.useEffect(() => {
    if (selectedItems.length === 0) {
      setShowBill(false);
    }
  }, [selectedItems]);

  function onSelect(data: CashierItem) {
    setShowBill(true);
    setTimeout(() => {
      setSelectedItems((prev) => {
        const isDuplicate = prev.some((item) => item.id === data.id);
        if (isDuplicate) {
          return prev.map((item) => {
            if (item.id === data.id) {
              return { ...item, quantity: item.quantity + 1 };
            } else {
              return item;
            }
          });
        }
        return [...prev, { ...data, quantity: 1 }];
      });
    }, 0);
  }

  return (
    <div className="flex justify-start relative">
      <Card className={cn("transition-all duration-300 h-[200vh] w-full")}>
        <CardHeader className="text-3xl font-bold">
          Produk NAD Parsel
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" defaultValue={["parcel", "cart"]}>
            <AccordionItem value="parcel" disabled>
              <AccordionTrigger className="border-y text-2xl font-bold">
                Parsel
              </AccordionTrigger>
              <AccordionContent className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {parcels.map((parcel) => (
                  <ParcelCard
                    key={parcel.id}
                    item={parcel}
                    onSelect={onSelect}
                  />
                ))}
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="cart" disabled>
              <AccordionTrigger className="border-b text-2xl font-bold">
                Keranjang
              </AccordionTrigger>
              <AccordionContent className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {carts.map((cart) => (
                  <CartCard key={cart.id} item={cart} onSelect={onSelect} />
                ))}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>
      <CashierForm
        state={{
          items: selectedItems,
          setItems: setSelectedItems,
        }}
        afterSubmit={() => {}}
        showBill={showBill}
      />
    </div>
  );
}
