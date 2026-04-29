import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";

// Tipos de roles
type Role = "TRAMET_ADMIN" | "CUSTOMER_ADMIN" | "USER";

// Rutas por rol
const ROLE_ROUTES: Record<Role, string> = {
  TRAMET_ADMIN: "/admin",
  CUSTOMER_ADMIN: "/admin",
  USER: "/dashboard",
};

// Ruta por defecto si no se puede determinar el rol
const DEFAULT_ROUTE = "/login";

// Rutas públicas (accesibles sin autenticación)
const PUBLIC_PATHS = ["/login"];

// Función simple para verificar si una ruta es pública
function isPublicPath(path: string): boolean {
  return PUBLIC_PATHS.some((pp) => path.startsWith(pp) || path.endsWith(pp));
}

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Obtener el token de la cookie
  const authCookie = request.cookies.get("auth-storage")?.value;

  // Si no hay cookie de autenticación
  if (!authCookie) {
    // Si intentan acceder a una ruta pública, permitir
    if (isPublicPath(path)) {
      return NextResponse.next();
    }
    // Para cualquier otra ruta, redirigir al login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Extraer el token JWT del estado almacenado (Zustand persist)
    // El formato suele ser: {"state":{"token":"..."},"version":0}
    let token: string | null = null;
    
    try {
      const decodedCookie = decodeURIComponent(authCookie);
      const authData = JSON.parse(decodedCookie);
      token = authData.state?.token || null;
    } catch (e) {
      console.warn("Middleware: Error al parsear cookie auth-storage", e);
    }

    if (!token) {
      if (isPublicPath(path)) return NextResponse.next();
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Decodificar el token y comprobar estructura
    let decoded: any;
    try {
      decoded = jwtDecode<any>(token);
    } catch (e) {
      console.error("Middleware: Token inválido", e);
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-storage");
      return response;
    }

    // Verificar expiración
    if (decoded.exp * 1000 < Date.now()) {
      console.warn("Middleware: Token expirado");
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-storage");
      return response;
    }

    // Extraer el rol - comprobando diferentes posibles campos
    let userRole: Role | undefined;

    // Verificar si el rol está en el campo 'role'
    if (decoded.role && typeof decoded.role === "string") {
      userRole = decoded.role as Role;
    }
    // Verificar si el rol está en el campo 'authorities'
    else if (decoded.authorities) {
      // Si authorities es un array, tomar el primer elemento
      if (Array.isArray(decoded.authorities)) {
        userRole = decoded.authorities[0] as Role;
      }
      // Si authorities es un string
      else if (typeof decoded.authorities === "string") {
        userRole = decoded.authorities as Role;
      }
    }

    // Si aún no tenemos un rol válido, redirigir al login
    if (!userRole || !ROLE_ROUTES[userRole]) {
      console.error("Rol no válido o no encontrado:", userRole);
      return NextResponse.redirect(new URL(DEFAULT_ROUTE, request.url));
    }

    // Si el usuario está autenticado e intenta acceder a /login, redirigirlo según su rol
    if (path === "/login") {
      return NextResponse.redirect(new URL(ROLE_ROUTES[userRole], request.url));
    }

    // Si el usuario está autenticado e intenta acceder a una ruta pública, redirigirlo según su rol
    if (isPublicPath(path)) {
      return NextResponse.redirect(new URL(ROLE_ROUTES[userRole], request.url));
    }

    // Si el usuario está autenticado e intenta acceder a /, redirigirlo según su rol
    if (path === "/") {
      return NextResponse.redirect(new URL(ROLE_ROUTES[userRole], request.url));
    }

    // Verificar acceso a rutas protegidas
    if (path.startsWith("/admin") && userRole === "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Permitir que los admins accedan al dashboard (para ver operaciones)
    // Antes se les redirigía forzosamente a /admin
    if (path.startsWith("/dashboard") && !userRole) {
       return NextResponse.redirect(new URL("/login", request.url));
    }

    // Si todo está correcto, permitir acceso
    return NextResponse.next();
  } catch (error) {
    // En caso de error (token inválido, expirado, etc.), eliminar cookie y redirigir
    console.error("Error de middleware:", error);
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth-storage");
    return response;
  }
}

// Configurar las rutas para el middleware
export const config = {
  matcher: ["/((?!_next/static|_next/image).*)"],
};
