"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@trm/_lib/auth/auth-context";

export default function HomePage() {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      console.log("[Home] Estado de autenticación:", isAuthenticated ? "Autenticado" : "No autenticado");
      console.log("[Home] Usuario:", user);

      if (isAuthenticated) {
        // Redirigir según el rol del usuario (implementación básica)
        const role = user?.role || "user";

        console.log("[Home] Rol del usuario:", role);

        // Ejemplo de redirección basada en roles
        if (role === "admin") {
          console.log("[Home] Redirigiendo a admin");
          router.push("/admin");
        } else {
          console.log("[Home] Redirigiendo a dashboard");
          router.push("/dashboard");
        }
      } else {
        console.log("[Home] Redirigiendo a login");
        router.push("/login");
      }
    }
  }, [isAuthenticated, isLoading, router, user]);

  // Mostrar un estado de carga mientras se verifica la autenticación
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        <div className="text-2xl font-semibold">Verificando sesión...</div>
      </div>
    </div>
  );
}
