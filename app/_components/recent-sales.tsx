"use client";

import * as React from "react";
import { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@trm/_components/ui/custom/data-table";

export const data: Sales[] = [
  {
    id: "1",
    product: "Laptop Dell",
    quantity: 2,
    amount: 55000,
    status: "éxito",
  },
  {
    id: "2",
    product: "PlayStation",
    quantity: 5,
    amount: 35000,
    status: "procesando",
  },
  {
    id: "3",
    product: "Móvil Samsung Galaxy S23",
    quantity: 2,
    amount: 75000,
    status: "éxito",
  },
  {
    id: "4",
    product: "PC Gaming",
    quantity: 2,
    amount: 155000,
    status: "éxito",
  },
  {
    id: "5",
    product: "Mac",
    quantity: 2,
    amount: 55000,
    status: "fallido",
  },
  {
    id: "6",
    product: "Smart Watch",
    quantity: 4,
    amount: 55000,
    status: "éxito",
  },
  {
    id: "7",
    product: "XBox",
    quantity: 5,
    amount: 45000,
    status: "procesando",
  },
  {
    id: "8",
    product: "iPad",
    quantity: 2,
    amount: 55000,
    status: "éxito",
  },
  {
    id: "9",
    product: "Ear Buds",
    quantity: 2,
    amount: 10000,
    status: "éxito",
  },
  {
    id: "10",
    product: "SSD",
    quantity: 2,
    amount: 15000,
    status: "fallido",
  },
];

export type Sales = {
  id: string;
  product: string;
  amount: number;
  quantity: number;
  status: "pendiente" | "procesando" | "éxito" | "fallido";
};

export const columns: ColumnDef<Sales>[] = [
  {
    accessorKey: "product",
    header: "Producto",
  },
  {
    accessorKey: "amount",
    header: "Monto",
  },
  {
    accessorKey: "quantity",
    header: "Cantidad",
  },
  {
    accessorKey: "status",
    header: "Estado",
  },
];

export function RecentSales() {
  return (
    <div className="w-full">
      <DataTable data={data} columns={columns}></DataTable>
    </div>
  );
}
