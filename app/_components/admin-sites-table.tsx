import React from "react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";

import { DataTable } from "@trm/_components/ui/custom/data-table";

export type Sites = {
  id: string;
  site: string;
  status: "operativo" | "inoperativo";
};

export const sites: Sites[] = [
  {
    id: "1",
    site: "Sitio 1",
    status: "operativo",
  },
  {
    id: "2",
    site: "Sitio 2",
    status: "inoperativo",
  },
  {
    id: "3",
    site: "Sitio 3",
    status: "operativo",
  },
  {
    id: "4",
    site: "Sitio 4",
    status: "inoperativo",
  },
  {
    id: "5",
    site: "Sitio 5",
    status: "operativo",
  },
  {
    id: "6",
    site: "Sitio 6",
    status: "inoperativo",
  },
  {
    id: "7",
    site: "Sitio 7",
    status: "operativo",
  },
  {
    id: "8",
    site: "Sitio 8",
    status: "inoperativo",
  },
  {
    id: "9",
    site: "Sitio 9",
    status: "operativo",
  },
  {
    id: "10",
    site: "Sitio 10",
    status: "inoperativo",
  },
  {
    id: "11",
    site: "Sitio 11",
    status: "operativo",
  },
  {
    id: "12",
    site: "Sitio 12",
    status: "inoperativo",
  },
  {
    id: "13",
    site: "Sitio 13",
    status: "operativo",
  },
  {
    id: "14",
    site: "Sitio 14",
    status: "inoperativo",
  },
  {
    id: "15",
    site: "Sitio 15",
    status: "operativo",
  },
  {
    id: "16",
    site: "Sitio 16",
    status: "inoperativo",
  },
  {
    id: "17",
    site: "Sitio 17",
    status: "operativo",
  },
  {
    id: "18",
    site: "Sitio 18",
    status: "inoperativo",
  },
  {
    id: "19",
    site: "Sitio 19",
    status: "operativo",
  },
];

const columnHelper = createColumnHelper<Sites>();

export const columns = [
  columnHelper.accessor("site", {
    header: "Sitios",
  }),
  columnHelper.accessor("status", {
    header: "Estado",
    enableSorting: true,
  }),
];

export function AdminSitesTable() {
  return (
    <div className="w-full max-w-2xl">
      <DataTable
        data={sites}
        columns={columns}
        filterColumn={{
          key: "site",
          label: "Sitio",
        }}
        pageSize={10}></DataTable>
    </div>
  );
}
