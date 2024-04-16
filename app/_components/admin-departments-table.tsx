import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { DataTable } from "@trm/_components/ui/custom/data-table";

export type Departments = {
  id: string;
  department: string;
  status: "contratado" | "no contratado";
};

export const departments: Departments[] = [
  {
    id: "1",
    department: "Financiero",
    status: "contratado",
  },
  {
    id: "2",
    department: "Contable",
    status: "contratado",
  },
  {
    id: "3",
    department: "Recursos Humanos",
    status: "no contratado",
  },
  {
    id: "4",
    department: "Marketing",
    status: "no contratado",
  },
  {
    id: "5",
    department: "Comercial",
    status: "no contratado",
  },
  {
    id: "6",
    department: "Compras",
    status: "no contratado",
  },
  {
    id: "7",
    department: "Cadena de suministro",
    status: "contratado",
  },
  {
    id: "8",
    department: "Control Gestión",
    status: "no contratado",
  },
  {
    id: "9",
    department: "Dirección General",
    status: "contratado",
  },
  {
    id: "10",
    department: "Comité directivo",
    status: "contratado",
  },
];

const columnHelper = createColumnHelper<Departments>();

export const columns = [
  columnHelper.accessor("department", {
    header: "Departamento",
  }),
  columnHelper.accessor("status", {
    header: "Estado",
    enableSorting: true,
  }),
];

export function AdminDepartmentsTable() {
  return (
    <div className="w-full max-w-2xl">
      <DataTable
        data={departments}
        columns={columns}
        filterColumn={`department`}
        pageSize={10}></DataTable>
    </div>
  );
}
