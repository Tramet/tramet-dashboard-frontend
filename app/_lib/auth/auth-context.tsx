"use client";

import React from "react";
import useAuthStore from "@trm/_hooks/use-auth";
import { AuthInitializer } from "@trm/_components/auth-initializer";

// Re-exportar el hook con el nombre original para mantener compatibilidad
export const useAuth = useAuthStore;

// Componente de compatibilidad para envolver la aplicación
// Ahora incluye el inicializador para asegurar que la autenticación se inicialice
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthInitializer />
      {children}
    </>
  );
}
