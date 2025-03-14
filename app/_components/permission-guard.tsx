"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@trm/_lib/auth/auth-context";
import usePermissionsStore from "@trm/_hooks/use-permissions";
import { ModuleType } from "@trm/_types/permissions";

interface PermissionGuardProps {
  children: React.ReactNode;
  module?: ModuleType;
  siteId?: string;
  departmentId?: string;
  areaId?: string;
  screenId?: string;
  fallback?: React.ReactNode;
}

export const PermissionGuard = ({
  children,
  module,
  siteId,
  departmentId,
  areaId,
  screenId,
  fallback,
}: PermissionGuardProps) => {
  const { isAuthenticated, isInitialized, userData } = useAuth();
  const { hasModuleAccess, hasSiteAccess, hasDepartmentAccess, hasAreaAccess, hasScreenAccess } = usePermissionsStore();
  const router = useRouter();
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    // Si no está inicializado, esperar
    if (!isInitialized) {
      return;
    }

    // Si no está autenticado, no tiene permiso
    if (!isAuthenticated) {
      setHasPermission(false);
      return;
    }

    // Si está autenticado, verificar si tiene los permisos necesarios
    if (isAuthenticated) {
      // Si el usuario tiene un rol de TRAMET_ADMIN o CUSTOMER_ADMIN, siempre tiene permiso
      if (userData?.role === "TRAMET_ADMIN" || userData?.role === "CUSTOMER_ADMIN") {
        setHasPermission(true);
        return;
      }

      // Para usuarios normales, verificar permisos específicos
      let hasAccess = true;

      // Verificar acceso a módulo si se especificó
      if (module && !hasModuleAccess(module)) {
        hasAccess = false;
      }

      // Verificar acceso a sitio si se especificó
      if (siteId && !hasSiteAccess(siteId)) {
        hasAccess = false;
      }

      // Verificar acceso a departamento si se especificó
      if (departmentId && !hasDepartmentAccess(departmentId)) {
        hasAccess = false;
      }

      // Verificar acceso a área si se especificó
      if (areaId && !hasAreaAccess(areaId)) {
        hasAccess = false;
      }

      // Verificar acceso a pantalla si se especificó
      if (screenId && !hasScreenAccess(screenId)) {
        hasAccess = false;
      }

      setHasPermission(hasAccess);
    }
  }, [
    isAuthenticated,
    isInitialized,
    userData,
    module,
    siteId,
    departmentId,
    areaId,
    screenId,
    hasModuleAccess,
    hasSiteAccess,
    hasDepartmentAccess,
    hasAreaAccess,
    hasScreenAccess,
  ]);

  // Si no tiene permiso y se proporciona un fallback, mostrar el fallback
  if (!hasPermission && fallback) {
    return <>{fallback}</>;
  }

  // Si no tiene permiso y no hay fallback, no mostrar nada
  if (!hasPermission) {
    return null;
  }

  // Si tiene permiso, mostrar los hijos
  return <>{children}</>;
};
