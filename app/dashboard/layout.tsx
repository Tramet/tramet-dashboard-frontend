"use client";

import { SideBar } from "@trm/_layout/sidebar/sidebar";
import Header from "@trm/_layout/header/header";
import PageWrapper from "@trm/_components/pagewrapper";
import { RouteGuard } from "@trm/_components/route-guard";

/**
 * Layout para la sección de dashboard.
 * La protección principal se realiza en el middleware.
 * RouteGuard proporciona una capa adicional de seguridad en el cliente.
 */
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["USER"]}>
      <>
        <Header />
        <div className="flex h-full w-full justify-center">
          <SideBar />
          <PageWrapper>{children}</PageWrapper>
        </div>
      </>
    </RouteGuard>
  );
}
