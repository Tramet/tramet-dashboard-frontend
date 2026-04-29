"use client";

import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@trm/_components/ui/custom/data-table";
import { getSubscriptionsByCustomer, Subscription } from "@trm/_api/subscriptions";
import { RefreshCw } from "lucide-react";
import { Button } from "@trm/_components/ui/button";
import { useAuth } from "@trm/_lib/auth/auth-context";

export type SubscriptionRow = {
  id: string;
  department: string;
  customer: string;
};

const columnHelper = createColumnHelper<SubscriptionRow>();

export const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("customer", {
    header: "Cliente",
    enableSorting: true,
  }),
  columnHelper.accessor("department", {
    header: "Departamento Contratado",
    enableSorting: true,
  }),
];

export function AdminSubscriptionsTable() {
  const [subscriptions, setSubscriptions] = useState<SubscriptionRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useAuth();

  const fetchSubscriptions = async () => {
    setIsLoading(true);
    try {
      // En un entorno SaaS real, si es CUSTOMER_ADMIN solo vería lo suyo.
      // Si es TRAMET_ADMIN vería todo. Por ahora, si tenemos el ID del cliente lo usamos.
      // Para efectos de la demo, si no hay ID específico, podríamos necesitar un getAllSubscriptions (que no definí)
      // Pero usualmente se consulta por cliente.
      
      const customerId = (userData as any)?.customerId || 1; // Fallback para demo
      const data = await getSubscriptionsByCustomer(customerId);
      
      const rows: SubscriptionRow[] = data.map((sub: Subscription) => ({
        id: sub.id.toString(),
        department: sub.department?.name || "N/A",
        customer: sub.customer?.name || "N/A",
      }));
      setSubscriptions(rows);
    } catch (error) {
      console.error("Error al cargar suscripciones:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  return (
    <div className="w-full">
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchSubscriptions}
          disabled={isLoading}
          className="flex items-center gap-1 text-xs"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-24 text-muted-foreground">
          Cargando información de contratación...
        </div>
      ) : (
        <DataTable
          data={subscriptions}
          columns={columns}
          filterColumn={{
            key: "department",
            label: "Departamento",
          }}
          pageSize={10}
        />
      )}
    </div>
  );
}
