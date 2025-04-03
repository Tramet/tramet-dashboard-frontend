"use client";
import { SideBar } from "@trm/_components/_layout/sidebar/sidebar";
import Header from "@trm/_components/_layout/header/header";
import PageWrapper from "@trm/_components/pagewrapper";
import { RouteGuard } from "@trm/_components/route-guard";

/**
 * Layout para la sección de administración.
 * La protección principal se realiza en el middleware.
 * RouteGuard proporciona una capa adicional de seguridad en el cliente.
 */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard allowedRoles={["TRAMET_ADMIN", "CUSTOMER_ADMIN"]}>
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
