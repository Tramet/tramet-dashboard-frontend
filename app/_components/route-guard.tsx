"use client";

import { ReactNode, useEffect, useState } from "react";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { UserRole } from "@trm/_hooks/use-auth";

interface RouteGuardProps {
  children: ReactNode;
  allowedRoles: UserRole[];
}

/**
 * Componente de protección de rutas minimalista.
 * La mayoría de la lógica ahora está en el middleware.
 * Esta es solo una última capa de verificación en el cliente.
 */
export const RouteGuard = ({ children, allowedRoles }: RouteGuardProps) => {
  const { isAuthenticated, userData, isInitialized } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Una vez inicializada la autenticación, dejar de mostrar carga
    if (isInitialized) {
      setIsLoading(false);
    }
  }, [isInitialized]);

  // Mientras se inicializa, mostrar indicador de carga
  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
          <div className="text-xl font-medium">Cargando...</div>
        </div>
      </div>
    );
  }

  // Verificación simple de acceso (la principal ocurre en el middleware)
  const hasAccess = isAuthenticated && userData && allowedRoles.includes(userData.role);

  // Si no tiene acceso, no mostrar nada (el middleware debería haber redirigido ya)
  if (!hasAccess) {
    return null;
  }

  // Si tiene acceso, mostrar el contenido
  return <>{children}</>;
};
