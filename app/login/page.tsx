"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@trm/_api/auth";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { Button } from "@trm/_components/ui/button";
import { Input } from "@trm/_components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@trm/_components/ui/card";
import { Label } from "@trm/_components/ui/label";
import { Alert, AlertDescription } from "@trm/_components/ui/alert";

/**
 * Página de login simplificada.
 * Ahora incluye redirección programática como respaldo al middleware.
 */
export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  const router = useRouter();
  const { login, isAuthenticated, userData } = useAuth();

  // Efecto para redirigir después de iniciar sesión exitosamente
  useEffect(() => {
    if (loginSuccess && isAuthenticated && userData) {
      console.log("Redirigiendo después de login exitoso:", userData.role);
      // Redirigir según el rol
      if (userData.role === "USER") {
        router.push("/dashboard");
      } else {
        router.push("/admin");
      }
    }
  }, [loginSuccess, isAuthenticated, userData, router]);

  // Efecto para redirigir si el usuario ya está autenticado al cargar la página
  useEffect(() => {
    if (isAuthenticated && userData) {
      console.log("Usuario ya autenticado, redirigiendo:", userData.role);
      // Redirigir según el rol
      if (userData.role === "USER") {
        router.push("/dashboard");
      } else {
        router.push("/admin");
      }
    }
  }, [isAuthenticated, userData, router]);

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setDebugInfo(null);
    setIsLoading(true);
    setLoginSuccess(false);

    try {
      // Obtener token del backend
      const token = await loginUser({ username, password });

      // Procesar login (almacenar token)
      await login(token);

      // Marcar el login como exitoso para activar la redirección
      setLoginSuccess(true);

      // Agregar redirección inmediata
      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const role = decodedToken.role || decodedToken.authorities;

      if (typeof role === "string") {
        if (role === "USER") {
          router.push("/dashboard");
        } else {
          router.push("/admin");
        }
      } else if (Array.isArray(role) && role.length > 0) {
        if (role[0] === "USER") {
          router.push("/dashboard");
        } else {
          router.push("/admin");
        }
      }
    } catch (err: any) {
      // Mostrar mensaje de error al usuario
      const errorMessage = err?.message || "Ocurrió un error al iniciar sesión";
      setError("Credenciales inválidas. Por favor intente de nuevo.");

      // Solo en entorno de desarrollo, mostrar información detallada
      if (process.env.NODE_ENV !== "production") {
        setDebugInfo(
          JSON.stringify(
            {
              message: err?.message,
              stack: err?.stack,
            },
            null,
            2
          )
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <div className="mb-4 flex justify-center">
            <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-foreground">T</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Iniciar Sesión</CardTitle>
          <CardDescription className="text-center">Ingrese sus credenciales para acceder a su cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {debugInfo && process.env.NODE_ENV !== "production" && (
            <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800">
              <details>
                <summary className="font-semibold cursor-pointer">Información de depuración</summary>
                <pre className="whitespace-pre-wrap text-xs mt-2 overflow-auto max-h-40">{debugInfo}</pre>
              </details>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                placeholder="Ingrese su usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="Ingrese su contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">Tramet © 2025 | Todos los derechos reservados</p>
        </CardFooter>
      </Card>
    </div>
  );
}
