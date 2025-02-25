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
import { ScrollArea } from "@/components/ui/scroll-area";
import { ParcelWithRelation } from "@/types/type";
import { Eye } from "lucide-react";
import NextImage from "next/image";
import React from "react";

interface ImageDimensions {
  width: number;
  height: number;
}

export default function ImageDialog({
  parcel,
}: {
  parcel: ParcelWithRelation;
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [dimensions, setDimensions] = React.useState<
    (ImageDimensions | null)[]
  >([]);

  React.useEffect(() => {
    const loadImageDimensions = async () => {
      const newDimensions = await Promise.all(
        parcel.images.map((image) => {
          return new Promise<ImageDimensions | null>((resolve) => {
            const img = new Image();
            img.onload = () => {
              resolve({
                width: img.width,
                height: img.height,
              });
            };
            img.onerror = () => resolve(null);
            img.src = image;
          });
        })
      );
      setDimensions(newDimensions);
    };

    if (dialogOpen) {
      loadImageDimensions();
    }
  }, [dialogOpen, parcel.images]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="icon">
          <Eye />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[700px] lg:max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Gambar Pada {parcel.name}</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
          <div className="grid grid-cols-2 gap-4">
            {parcel.images.map((image, i) => (
              <NextImage
                key={i}
                src={image}
                alt={image.split("/").pop() || ""}
                width={dimensions[i]?.width || 0}
                height={dimensions[i]?.height || 0}
                className="rounded-lg"
              />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
