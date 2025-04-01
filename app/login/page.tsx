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
import Image from "next/image";
import { motion } from "framer-motion";
import TrametLogo from "../../public/tramet.png";

/**
 * Página de login modernizada.
 * Incluye animaciones, mejor diseño visual y redirección programática.
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
      // Determinar la ruta de destino según el rol
      const destination = userData.role === "USER" ? "/dashboard" : "/admin";
      
      // Usar setTimeout para permitir que el estado se actualice completamente
      setTimeout(() => {
        // Forzar una navegación completa con window.location en lugar de router.push
        window.location.href = destination;
      }, 100);
    }
  }, [loginSuccess, isAuthenticated, userData, router]);

  // Efecto para redirigir si el usuario ya está autenticado al cargar la página
  useEffect(() => {
    if (isAuthenticated && userData) {
      // Determinar la ruta de destino según el rol
      const destination = userData.role === "USER" ? "/dashboard" : "/admin";
      
      // Forzar una navegación completa
      window.location.href = destination;
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

      // El efecto se encargará de la redirección, no intentamos navegar aquí
      // para evitar condiciones de carrera
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
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-0 left-0 w-full h-full opacity-10">
        <motion.div
          className="absolute top-10 left-10 w-40 h-40 rounded-full bg-primary opacity-30 blur-xl"
          animate={{
            y: [0, 15, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-blue-400 opacity-20 blur-xl"
          animate={{
            y: [0, -20, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <motion.div
          className="absolute top-1/3 right-1/4 w-20 h-20 rounded-full bg-yellow-300 opacity-20 blur-xl"
          animate={{
            y: [0, 10, 0],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      </div>

      <div className="relative flex flex-col md:flex-row w-full max-w-5xl p-4 gap-8">
        {/* Lado izquierdo - Banner/Imagen */}
        <motion.div
          className="hidden md:flex md:w-1/2 flex-col justify-center items-center rounded-l-2xl bg-gradient-to-br from-primary to-orange-400 text-white p-8 shadow-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}>
          <div className="mb-8">
            <Image src={TrametLogo} alt="Tramet Logo" width={60} height={60} className="object-contain" priority />
          </div>

          <h1 className="text-xl font-bold mb-6 text-center">Panel Administrativo</h1>
          <p className="text-lg mb-8 text-center opacity-90">Sistema de gestión y monitoreo de operaciones</p>

          <div className="bg-white bg-opacity-20 p-5 rounded-xl backdrop-blur-sm">
            <p className="text-sm italic">"Optimizando procesos, maximizando resultados."</p>
          </div>
        </motion.div>

        {/* Lado derecho - Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:w-1/2 w-full max-w-md">
          <Card className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-sm shadow-2xl rounded-2xl border-none">
            <CardHeader className="space-y-2 pb-2">
              <div className="md:hidden flex justify-center mb-6">
                <Image src={TrametLogo} alt="Tramet Logo" width={50} height={50} priority />
              </div>
              <CardTitle className="text-2xl font-bold text-center text-primary">Bienvenido</CardTitle>
              <CardDescription className="text-center">
                Ingrese sus credenciales para acceder al sistema
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4 pt-3">
              {error && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 10,
                  }}>
                  <Alert variant="destructive">
                    <AlertDescription className="flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {error}
                    </AlertDescription>
                  </Alert>
                </motion.div>
              )}

              {debugInfo && process.env.NODE_ENV !== "production" && (
                <Alert variant="default" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                  <details>
                    <summary className="font-semibold cursor-pointer">Información de depuración</summary>
                    <pre className="whitespace-pre-wrap text-xs mt-2 overflow-auto max-h-40">{debugInfo}</pre>
                  </details>
                </Alert>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}>
                  <Label htmlFor="username" className="text-sm font-medium">
                    Usuario
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <Input
                      id="username"
                      className="pl-10 py-6 border-gray-300 focus:ring-primary focus:border-primary transition duration-200"
                      placeholder="Ingrese su usuario"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}>
                  <Label htmlFor="password" className="text-sm font-medium">
                    Contraseña
                  </Label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <Input
                      id="password"
                      type="password"
                      className="pl-10 py-6 border-gray-300 focus:ring-primary focus:border-primary transition duration-200"
                      placeholder="Ingrese su contraseña"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    className="w-full py-6 mt-2 bg-gradient-to-r from-primary to-orange-500 hover:from-orange-500 hover:to-primary transition-all duration-300 font-semibold text-white rounded-lg shadow-md hover:shadow-lg"
                    disabled={isLoading}>
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Iniciando sesión...
                      </div>
                    ) : (
                      "Iniciar Sesión"
                    )}
                  </Button>
                </motion.div>
              </form>
            </CardContent>

            <CardFooter className="flex flex-col items-center justify-center space-y-2 pt-0">
              <div className="w-full border-t border-gray-200 dark:border-gray-700 my-2"></div>
              <p className="text-sm text-muted-foreground">
                Tramet {new Date().getFullYear()} | Todos los derechos reservados
              </p>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
