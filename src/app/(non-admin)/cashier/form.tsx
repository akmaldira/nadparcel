"use client";

import MoneyInput from "@/components/money-input";
import { PhoneInput } from "@/components/phone-input";
import { AutosizeTextarea } from "@/components/ui/auto-resize-textarea";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";
import { CashierItem } from "@/types/type";
import { Eye, Trash } from "lucide-react";
import React from "react";
import { toast } from "sonner";
import { z } from "zod";
import InvoicePrint from "./invoice-print";
import { addTransactionSchema } from "./schema";

function OrderDetail({
  items,
  setItems,
}: {
  items: CashierItem[];
  setItems: React.Dispatch<React.SetStateAction<CashierItem[]>>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Nama</TableHead>
          <TableHead>Harga/pcs</TableHead>
          <TableHead>Jumlah</TableHead>
          <TableHead>Harga</TableHead>
          <TableHead>Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium whitespace-pre-wrap">
              {item.name}
            </TableCell>
            <TableCell>{formatCurrency(item.price)}</TableCell>
            <TableCell className="w-20">
              <Input
                value={item.quantity}
                onChange={(e) => {
                  const number = parseInt(e.target.value, 10);
                  if (!isNaN(number)) {
                    setItems(
                      items.map((i) =>
                        i.id === item.id
                          ? {
                              ...i,
                              quantity: number,
                            }
                          : i
                      )
                    );
                  } else {
                    setItems(
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      items.map((i) =>
                        i.id === item.id
                          ? {
                              ...i,
                              quantity: "",
                            }
                          : i
                      )
                    );
                  }
                }}
                type="number"
                min={1}
              />
            </TableCell>
            <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
            <TableCell>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => {
                  setItems(items.filter((i) => i.id !== item.id));
                }}
              >
                <Trash />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

type AdditionalInfo = Omit<z.infer<typeof addTransactionSchema>, "items">;

function AdditionalInfoForm({
  additionalInfo,
  setAdditionalInfo,
  className,
}: {
  additionalInfo: AdditionalInfo;
  setAdditionalInfo: React.Dispatch<React.SetStateAction<AdditionalInfo>>;
  className?: string;
}) {
  return (
    <div className={cn("space-y-2 px-1", className)}>
      <div>
        <Label>Nama Kostumer</Label>
        <Input
          placeholder="Nama Kostumer"
          value={additionalInfo.costumerName}
          onChange={(e) =>
            setAdditionalInfo({
              ...additionalInfo,
              costumerName: e.target.value,
            })
          }
        />
      </div>
      <div>
        <Label>No. Telepon (Jika Ada)</Label>
        <PhoneInput
          placeholder="No. Telepon"
          defaultCountry="ID"
          value={additionalInfo.costumerPhone || ""}
          onChange={(e) =>
            setAdditionalInfo({
              ...additionalInfo,
              costumerPhone: e?.toString() || null,
            })
          }
        />
      </div>
      <div className="flex items-start gap-4">
        <div className="w-full">
          <Label>Total Harga</Label>
          <MoneyInput
            placeholder="Total Harga"
            value={additionalInfo.totalPrice.toString()}
            disabled
          />
        </div>
        <div className="w-full">
          <Label>Harga Akhir</Label>
          <MoneyInput
            placeholder="Harga Akhir"
            value={additionalInfo.priceAfterDiscount.toString()}
            max={additionalInfo.totalPrice}
            onChange={(value) =>
              setAdditionalInfo({
                ...additionalInfo,
                priceAfterDiscount: value,
              })
            }
          />
        </div>
      </div>
      <div>
        <Label>Jumlah Pembayaran (DP)</Label>
        <MoneyInput
          placeholder="Jumlah Pembayaran"
          value={additionalInfo.downPayment.toString()}
          max={additionalInfo.totalPrice}
          onChange={(value) =>
            setAdditionalInfo({
              ...additionalInfo,
              downPayment: Number(value),
            })
          }
        />
      </div>
      <div>
        <Label>Catatan</Label>
        <AutosizeTextarea
          placeholder="Contoh: Coca cola diganti sprite atau pembayaran ditransfer"
          value={additionalInfo.notes || ""}
          onChange={(e) =>
            setAdditionalInfo({ ...additionalInfo, notes: e.target.value })
          }
        />
      </div>
    </div>
  );
}

export default function CashierForm({
  state,
  afterSubmit,
  showBill,
}: {
  state: {
    items: CashierItem[];
    setItems: React.Dispatch<React.SetStateAction<CashierItem[]>>;
  };
  afterSubmit: () => void;
  showBill: boolean;
}) {
  const { items, setItems } = state;
  const [additionalInfo, setAdditionalInfo] = React.useState<AdditionalInfo>({
    costumerName: "",
    costumerPhone: "",
    totalPrice: 0,
    priceAfterDiscount: 0,
    downPayment: 0,
    paymentMethod: "CASH",
    notes: "",
  });
  const [finalData, setFinalData] = React.useState<z.infer<
    typeof addTransactionSchema
  > | null>(null);
  const [alertDialog, setAlertDialog] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  React.useEffect(() => {
    setAdditionalInfo((prev) => ({
      ...prev,
      totalPrice: items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
      priceAfterDiscount: items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      ),
    }));
  }, [items]);

  function onNextAction() {
    const finalData = {
      ...additionalInfo,
      items: items,
    } as unknown as z.infer<typeof addTransactionSchema>;

    const result = addTransactionSchema.safeParse(finalData);
    if (!result.success) {
      toast.error(result.error.errors[0].message);
      return;
    }
    setFinalData(result.data);
    setAlertDialog(true);
  }

  function onSubmit() {
    startTransition(async () => {
      const finalData = {
        ...additionalInfo,
        items: items,
      } as unknown as z.infer<typeof addTransactionSchema>;

      const result = addTransactionSchema.safeParse(finalData);
      if (!result.success) {
        toast.error(result.error.errors[0].message);
        return;
      }
      console.log(result.data);
      afterSubmit();
    });
  }

  function onReset() {
    setItems([]);
    setAdditionalInfo({
      costumerName: "",
      costumerPhone: "",
      totalPrice: 0,
      priceAfterDiscount: 0,
      downPayment: 0,
      paymentMethod: "CASH",
      notes: "",
    });
    setFinalData(null);
  }

  return (
    <>
      <Card
        className={cn(
          "hidden lg:block",
          "sticky top-24 h-[85svh] shrink-0 bg-sidebar text-sidebar-foreground shadow transition-all duration-300 ease-in-out transform overflow-hidden",
          showBill
            ? "ml-4 lg:w-[30rem] xl:w-[35rem] translate-x-0 opacity-100"
            : "w-0 translate-x-full opacity-0 pointer-events-none"
        )}
      >
        <CardHeader className="text-3xl font-bold">Order</CardHeader>
        <CardContent>
          <ScrollArea className="h-[58vh]">
            <OrderDetail items={items} setItems={setItems} />
            <Separator />
            <AdditionalInfoForm
              additionalInfo={additionalInfo}
              setAdditionalInfo={setAdditionalInfo}
              className="mt-4"
            />
          </ScrollArea>
        </CardContent>
        <CardFooter className="flex flex-col">
          <Button className="w-full mt-6" onClick={() => onNextAction()}>
            Lanjutkan
          </Button>
          <Button
            className="w-full mt-2"
            variant="destructive"
            onClick={() => onReset()}
          >
            Reset
          </Button>
        </CardFooter>
      </Card>
      <Drawer>
        <DrawerTrigger asChild>
          <Button
            className={cn(
              "bg-green-500 hover:bg-green-700 lg:hidden bottom-10 right-10 flex items-center gap-2 transition-all duration-1000 ease-in-out",
              showBill
                ? "fixed opacity-100 translate-y-0 animate-bounce"
                : "fixed opacity-0 translate-y-10 pointer-events-none"
            )}
            variant="secondary"
          >
            <Eye />
            Lihat Orderan ({items.length})
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Order</DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className="px-4">
            <OrderDetail items={items} setItems={setItems} />
          </div>
          <DrawerFooter>
            <Button onClick={() => onNextAction()}>Buat Order</Button>
            <DrawerClose asChild>
              <Button variant="destructive" onClick={() => onReset()}>
                Reset
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Dialog open={alertDialog} onOpenChange={setAlertDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apakah data ini sudah benar?</DialogTitle>
            <DialogDescription>
              Pastikan informasi yang diinputkan sudah benar
            </DialogDescription>
          </DialogHeader>
          {finalData && <InvoicePrint data={finalData} />}
          <div className="flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setAlertDialog(false)}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={() => onSubmit()}
              disabled={isPending}
            >
              {isPending ? "Buat Orderan..." : "Buat Orderan"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
