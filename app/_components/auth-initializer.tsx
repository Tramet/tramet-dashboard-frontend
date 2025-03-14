"use client";

import { useEffect } from "react";
import { useAuth } from "@trm/_lib/auth/auth-context";

// Componente para inicializar el estado de autenticación
export function AuthInitializer() {
  const { initialize, isLoading } = useAuth();

  useEffect(() => {
    // Solo inicializar en el cliente
    if (typeof window !== "undefined") {
      console.log("[AuthInitializer] Inicializando estado de autenticación");
      initialize();
    }
  }, [initialize]);

  return null; // Este componente no renderiza nada
}
