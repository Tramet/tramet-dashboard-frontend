"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { jwtDecode } from "jwt-decode";

// Componente de depuración que solo aparece en desarrollo
function DebugToken() {
  const { token } = useAuth();
  const [tokenData, setTokenData] = useState<any>(null);

  useEffect(() => {
    if (token && process.env.NODE_ENV !== "production") {
      try {
        const decoded = jwtDecode(token);
        setTokenData(decoded);
      } catch (e) {
        setTokenData({ error: "Error decodificando token" });
      }
    }
  }, [token]);

  if (process.env.NODE_ENV === "production" || !tokenData) {
    return null;
  }

  return (
    <div
      className="fixed bottom-0 right-0 m-4 p-4 bg-black/80 text-white rounded max-w-md text-xs overflow-auto"
      style={{ maxHeight: "300px", zIndex: 9999 }}>
      <h3 className="font-bold mb-2">Debug Token</h3>
      <pre>{JSON.stringify(tokenData, null, 2)}</pre>
    </div>
  );
}

/**
 * Página principal.
 * Las redirecciones basadas en roles se manejan en el middleware.
 * Esta página solo muestra un mensaje de carga mientras el middleware realiza la redirección.
 */
export default function HomePage() {
  return (
    <div className="h-screen w-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin h-8 w-8 border-4 border-primary rounded-full border-t-transparent"></div>
        <div className="text-2xl font-semibold">Redirigiendo...</div>
      </div>
      {process.env.NODE_ENV !== "production" && <DebugToken />}
    </div>
  );
}
