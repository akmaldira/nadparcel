"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn, formatCurrency } from "@/lib/utils";
import { ParcelWithRelation } from "@/types/type";
import { Eye } from "lucide-react";

export default function RevenueDialog({
  parcel,
}: {
  parcel: ParcelWithRelation;
}) {
  const cartPrice = parcel.cart?.maxPrice || 0;
  const itemPrice = parcel.items.reduce(
    (acc, item) => acc + item.item.maxPrice * item.quantity || 0,
    0
  );
  const workerWage = parcel.workerWage || 0;
  const cost = cartPrice + itemPrice + workerWage;
  const revenue = parcel.price - cost;
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keuntungan Pada {parcel.name}</DialogTitle>
          <DialogDescription>
            Keuntungan ini merupakan keuntungan kotor, karena tidak ada
            kalkulasi kebutuhan lainnya seperti plastik, lem, dll
          </DialogDescription>
        </DialogHeader>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Keterangan</TableHead>
              <TableHead className="text-right">Harga</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium whitespace-nowrap">
                Harga Jual
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(parcel.price)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="whitespace-nowrap">Keranjang</TableCell>
              <TableCell className="text-right text-red-500">
                - {formatCurrency(cartPrice)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="whitespace-nowrap">Item</TableCell>
              <TableCell className="text-right text-red-500">
                - {formatCurrency(itemPrice)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="whitespace-nowrap">Upah Pekerja</TableCell>
              <TableCell className="text-right text-red-500">
                - {formatCurrency(workerWage)}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium whitespace-nowrap">
                Keuntungan
              </TableCell>
              <TableCell
                className={cn(
                  "text-right",
                  revenue > 0 ? "text-green-500" : "text-red-500"
                )}
              >
                {revenue > 0 && "+"}
                {formatCurrency(revenue)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </DialogContent>
    </Dialog>
  );
}
