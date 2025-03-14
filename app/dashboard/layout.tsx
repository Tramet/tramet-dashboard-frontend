"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SideBar } from "@trm/_layout/sidebar/sidebar";
import Header from "@trm/_layout/header/header";
import PageWrapper from "@trm/_components/pagewrapper";
import { useAuth } from "@trm/_lib/auth/auth-context";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Solo redirigimos cuando la carga ha finalizado y no estamos autenticados
    if (!isLoading && !isAuthenticated) {
      console.log("Redirigiendo desde dashboard a login, no autenticado");
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Si está cargando, mostrar un indicador
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          <div className="text-xl font-medium">Cargando dashboard...</div>
        </div>
      </div>
    );
  }

  // Si no está autenticado y no está cargando, no renderizar nada
  // esto evita que se vea el contenido brevemente antes de la redirección
  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="flex h-full w-full justify-center">
        <SideBar />
        <PageWrapper>{children}</PageWrapper>
      </div>
    </>
  );
}
