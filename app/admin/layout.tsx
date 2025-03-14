"use client";

import { RouteGuard } from "@trm/_components/route-guard";

/**
 * Layout para la sección de administración.
 * La protección principal se realiza en el middleware.
 * RouteGuard proporciona una capa adicional de seguridad en el cliente.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <RouteGuard allowedRoles={["TRAMET_ADMIN", "CUSTOMER_ADMIN"]}>{children}</RouteGuard>;
}
