"use client";

import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@trm/_components/ui/custom/data-table";
import { getSites, Site } from "@trm/_api/sites";
import { RefreshCw } from "lucide-react";
import { Button } from "@trm/_components/ui/button";

export type SiteRow = {
  id: string;
  site: string;
  city: string;
  state: string;
  country: string;
  customer: string;
};

const columnHelper = createColumnHelper<SiteRow>();

export const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("site", {
    header: "Sucursal",
    enableSorting: true,
  }),
  columnHelper.accessor("city", {
    header: "Ciudad",
    enableSorting: true,
  }),
  columnHelper.accessor("state", {
    header: "Estado",
    enableSorting: true,
  }),
  columnHelper.accessor("country", {
    header: "País",
    enableSorting: true,
  }),
  columnHelper.accessor("customer", {
    header: "Cliente",
    enableSorting: true,
  }),
];

export function AdminSitesTable() {
  const [sites, setSites] = useState<SiteRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchSites = async () => {
    setIsLoading(true);
    try {
      const data = await getSites();
      const rows: SiteRow[] = data.map((site: Site) => ({
        id: site.id.toString(),
        site: site.site,
        city: site.city || "",
        state: site.state || "",
        country: site.country || "",
        customer: site.customer?.name || "Sin cliente",
      }));
      setSites(rows);
    } catch (error) {
      console.error("Error al cargar sitios:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSites();
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSites}
          disabled={isLoading}
          className="flex items-center gap-1 text-xs"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-24 text-muted-foreground">
          Cargando sitios...
        </div>
      ) : (
        <DataTable
          data={sites}
          columns={columns}
          filterColumn={{
            key: "site",
            label: "Sucursal",
          }}
          pageSize={10}
        />
      )}
    </div>
  );
}
