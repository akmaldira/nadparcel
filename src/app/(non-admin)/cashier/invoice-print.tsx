"use client";

import { formatCurrency } from "@/lib/utils";
import Image from "next/image";
import React from "react";
import { z } from "zod";
import { addTransactionSchema } from "./schema";

export default function InvoicePrint({
  data,
}: {
  data: z.infer<typeof addTransactionSchema>;
}) {
  const isDownPaymentEqualPriceAfterDiscount =
    data.downPayment === data.priceAfterDiscount;
  return (
    <div
      className="bg-white p-4 border border-gray-200 text-black relative"
      style={{
        width: "100%",
        maxWidth: "300px",
        margin: "0 auto",
        fontFamily: '"Courier New", monospace',
      }}
    >
      {isDownPaymentEqualPriceAfterDiscount && (
        <div className="absolute inset-0 flex items-center justify-center z-0 overflow-hidden pointer-events-none">
          <div className="transform rotate-[-45deg] text-6xl font-bold text-black/30 z-1">
            LUNAS
          </div>
        </div>
      )}

      <div className="text-center mb-3">
        <div className="flex items-center justify-center mb-2">
          <Image
            src={"/nadparcel-black.png"}
            alt="Nadparcel Logo"
            width={100}
            height={100}
          />
        </div>
        <div className="text-xs text-gray-600">
          JL Merdeka Timur, Cunda, Kota Lhokseumawe
        </div>
      </div>

      <div className="flex flex-col justify-between text-xs border-t border-b border-dashed border-gray-300 py-2">
        <div>
          Tanggal :{" "}
          {new Intl.DateTimeFormat("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(new Date())}
        </div>
        <div>No. Invoice : N/A</div>
        <div>Pembeli : {data.costumerName}</div>
      </div>

      <div className="py-2">
        <React.Fragment>
          <div className="flex justify-between text-sm mb-1">
            <div className="w-1/2">Item</div>
            <div className="w-1/6 text-center">Qty</div>
            <div className="w-1/2 text-right">Total</div>
          </div>
        </React.Fragment>
        {data.items.map((item, index) => (
          <React.Fragment key={item.id || index}>
            <div className="flex justify-between text-sm mb-1">
              <div className="w-1/2">{item.name}</div>
              <div className="w-1/6 text-center">{item.quantity}</div>
              <div className="w-1/2 text-right">
                {formatCurrency(item.price * item.quantity)}
              </div>
            </div>
          </React.Fragment>
        ))}
      </div>
      <div className="border-t border-dashed border-gray-300 pt-2">
        <div className="flex justify-between text-sm">
          <div className="w-1/2">Total Harga</div>
          <div className="w-1/6 text-center">{data.items.length}</div>
          <div className="w-1/2 text-right">
            {formatCurrency(
              data.items.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              )
            )}
          </div>
        </div>
        <div className="flex justify-between text-sm mt-4">
          <div className="w-1/2">
            Pembayaran {!isDownPaymentEqualPriceAfterDiscount && "Awal"}
          </div>
          <div className="w-1/2 text-right">
            {formatCurrency(data.downPayment)}
          </div>
        </div>
        {!isDownPaymentEqualPriceAfterDiscount && (
          <div className="flex justify-between text-sm">
            <div className="w-1/2">Sisa Pembayaran</div>
            <div className="w-1/2 text-right">
              {formatCurrency(data.priceAfterDiscount - data.downPayment)}
            </div>
          </div>
        )}
      </div>
      <div className="mt-6 text-xs text-center">
        <div>Tel : 08123456789</div>
        <div>WhatsApp: 08123456789</div>
      </div>
      <div className="mt-6 text-xs text-center">
        Thanks for supporting local business!
      </div>
      <div className="mt-2 text-md text-center">THANK YOU</div>
    </div>
  );
}
