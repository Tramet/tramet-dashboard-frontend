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

  // Si es una ruta pública que no es /login, permitir acceso inmediato
  if (isPublicPath(path)) {
    return NextResponse.next();
  }

  // Si no hay cookie de autenticación
  if (!authCookie) {
    // Si intentan acceder a login sin cookie, permitir
    if (path === "/login") {
      return NextResponse.next();
    }
    // Para cualquier otra ruta, redirigir al login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    // Extraer el token JWT del estado almacenado
    const authData = JSON.parse(decodeURIComponent(authCookie));
    const token = authData.state?.token;

    if (!token) {
      throw new Error("Token no encontrado");
    }

    // Decodificar el token y comprobar estructura
    const decoded = jwtDecode<any>(token);

    // Verificar expiración
    if (decoded.exp * 1000 < Date.now()) {
      throw new Error("Token expirado");
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
      console.log("Usuario autenticado intentando acceder a /login, redirigiendo a:", ROLE_ROUTES[userRole]);
      return NextResponse.redirect(new URL(ROLE_ROUTES[userRole], request.url));
    }

    // Redireccionar a la página principal según rol
    if (path === "/") {
      return NextResponse.redirect(new URL(ROLE_ROUTES[userRole], request.url));
    }

    // Verificar acceso a rutas protegidas
    if (path.startsWith("/admin") && userRole === "USER") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (path.startsWith("/dashboard") && userRole !== "USER") {
      return NextResponse.redirect(new URL("/admin", request.url));
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
