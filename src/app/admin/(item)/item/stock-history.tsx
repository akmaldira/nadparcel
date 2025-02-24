import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatDate, formatNumber } from "@/lib/utils";
import { ItemWithHistories } from "@/types/type";
import { Eye } from "lucide-react";

export default function ItemStockHistory({
  item,
}: {
  item: ItemWithHistories;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Riwayat Stok {item.name}</DialogTitle>
          <DialogDescription>
            Riwayat ini berdasarkan penambahan stok yang dilakukan oleh admin
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[80vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Tanggal</TableHead>
                <TableHead>Penambahan</TableHead>
                <TableHead>Harga Satuan</TableHead>
                <TableHead className="text-right">Ditambah Oleh</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {item.histories.map((history) => (
                <TableRow key={history.id}>
                  <TableCell>{formatDate(history.createdAt)}</TableCell>
                  <TableCell>{formatNumber(history.updatedStock)}</TableCell>
                  <TableCell>{formatCurrency(history.priceEachItem)}</TableCell>
                  <TableCell className="text-right">
                    {history.createdBy}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
