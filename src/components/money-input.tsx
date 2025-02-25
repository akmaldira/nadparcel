"use client";

import { formatCurrency } from "@/lib/utils";
import React from "react";
import { Input } from "./ui/input";

type TextInputProps = {
  placeholder: string;
  value?: string;
  onChange?: (value: number) => void;
  disabled?: boolean;
  max?: number;
};

export default function MoneyInput(props: TextInputProps) {
  const [value, setValue] = React.useReducer((_: any, next: string) => {
    const digits = Number(next.replace(/\D/g, ""));
    let realValue = Number(digits);
    if (props.max) {
      if (realValue > props.max) {
        realValue = props.max;
      }
    }
    return formatCurrency(realValue);
  }, formatCurrency(Number(props.value || "0")));

  React.useEffect(() => {
    setValue(props.value?.toString() || "0");
  }, [props.value]);

  function handleChange(formattedValue: string) {
    const digits = formattedValue.replace(/\D/g, "");
    let realValue = Number(digits);
    if (props.max) {
      if (realValue > props.max) {
        realValue = props.max;
      }
    }
    if (props.onChange) {
      props.onChange(realValue);
    }
  }

  return (
    <Input
      placeholder={props.placeholder}
      type="text"
      onChange={(ev) => {
        setValue(ev.target.value);
        handleChange(ev.target.value);
      }}
      value={value}
      disabled={props.disabled}
    />
  );
}
