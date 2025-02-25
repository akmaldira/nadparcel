"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"; // Shadcn UI import
import { Input } from "@/components/ui/input"; // Shandcn UI Input
import { formatCurrency } from "@/lib/utils";
import React, { useReducer } from "react";
import { UseFormReturn } from "react-hook-form";

type TextInputProps = {
  form: UseFormReturn<any>;
  name: string;
  label: string;
  placeholder: string;
};

export default function MoneyInputForm(props: TextInputProps) {
  const defaultValue = props.form.getValues(props.name);

  const [value, setValue] = useReducer((_: any, next: string) => {
    const digits = next.replace(/\D/g, "");
    return formatCurrency(Number(digits));
  }, formatCurrency(defaultValue));

  React.useEffect(() => {
    setValue(defaultValue.toString());
  }, [defaultValue]);

  function handleChange(
    realChangeFn: (value: number) => void,
    formattedValue: string
  ) {
    const digits = formattedValue.replace(/\D/g, "");
    const realValue = Number(digits);
    realChangeFn(realValue);
  }

  return (
    <FormField
      control={props.form.control}
      name={props.name}
      render={({ field }) => {
        field.value = value;
        const _change = field.onChange;

        return (
          <FormItem>
            <FormLabel>{props.label}</FormLabel>
            <FormControl>
              <Input
                placeholder={props.placeholder}
                type="text"
                {...field}
                onChange={(ev) => {
                  setValue(ev.target.value);
                  handleChange(_change, ev.target.value);
                }}
                value={value}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
