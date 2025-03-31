"use client";

import React, { useEffect, useState } from "react";
import useAuthStore from "@trm/_hooks/use-auth";
import Cookies from "js-cookie";

// Re-exportar el hook para mantener compatibilidad
export const useAuth = useAuthStore;

// Componente para depuración de cookies en desarrollo
function DebugAuthStatus() {
  const [cookieStatus, setCookieStatus] = useState<any>(null);
  const { userData, isAuthenticated, isInitialized } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
      try {
        const authCookie = Cookies.get("auth-storage");
        const authData = authCookie ? JSON.parse(decodeURIComponent(authCookie)) : null;

        setCookieStatus({
          cookieExists: !!authCookie,
          tokenExists: !!authData?.state?.token,
          authState: {
            isAuthenticated,
            isInitialized,
            userRole: userData?.role || "no-role",
          },
        });

        console.log("Auth Status:", {
          cookie: !!authCookie,
          token: !!authData?.state?.token,
          userData,
          isAuthenticated,
          isInitialized,
        });
      } catch (e) {
        console.error("Error parsing auth cookie:", e);
        setCookieStatus({ error: "Error parsing cookie" });
      }
    }
  }, [userData, isAuthenticated, isInitialized]);

  // Solo mostrar en desarrollo
  if (process.env.NODE_ENV !== "development" || !cookieStatus) {
    return null;
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        background: "rgba(0,0,0,0.8)",
        color: "white",
        padding: "4px 8px",
        fontSize: "10px",
        fontFamily: "monospace",
        zIndex: 9999,
        maxWidth: "300px",
        overflow: "auto",
      }}>
      <details>
        <summary>Auth Debug</summary>
        <pre>{JSON.stringify(cookieStatus, null, 2)}</pre>
      </details>
    </div>
  );
}

// Componente minimalista para inicializar la autenticación
function AuthInitializer() {
  const { initialize, isInitialized } = useAuth();

  useEffect(() => {
    initialize().then(() => {
    });
  }, [initialize]);

  return null;
}

// Componente proveedor simplificado
export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthInitializer />
      {process.env.NODE_ENV === "development" && <DebugAuthStatus />}
      {children}
    </>
  );
}
