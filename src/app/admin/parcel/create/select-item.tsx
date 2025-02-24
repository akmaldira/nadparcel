"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn, formatCurrency } from "@/lib/utils";
import { Item } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ControllerRenderProps } from "react-hook-form";

type SelectItemProps = {
  inputedItems: {
    id: string;
    quantity: number;
  }[];
  field: ControllerRenderProps<any, `items.${number}.id`>;
  items: Item[];
};
export default function SelectItemComponent({
  inputedItems,
  field,
  items,
}: SelectItemProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  return (
    <Popover open={dialogOpen} onOpenChange={setDialogOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-full justify-between",
              !field.value && "text-muted-foreground"
            )}
          >
            {field.value
              ? `${
                  items.find((item) => item.id === field.value)?.name
                } (${formatCurrency(
                  items.find((item) => item.id === field.value)?.maxPrice || 0
                )})`
              : "Pilih item"}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput
            placeholder="Cari item..."
            className="md:w-[20rem] lg:w-[34rem] h-9"
          />
          <CommandList>
            <CommandEmpty className="flex items-center flex-col justify-center pt-2">
              Item tidak ditemukan.
              <Link
                href="/admin/item"
                className={cn(buttonVariants({ variant: "link" }))}
              >
                Tambah Item
              </Link>
            </CommandEmpty>
            <CommandGroup>
              {items
                .filter((item) => !inputedItems.find((s) => s.id === item.id))
                .map((item) => (
                  <CommandItem
                    value={item.id}
                    key={item.id}
                    onSelect={() => {
                      field.onChange(item.id);
                      setDialogOpen(false);
                    }}
                  >
                    {item.name} ({formatCurrency(item.maxPrice)}
                    )
                    <Check
                      className={cn(
                        "ml-auto",
                        item.id === field.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
