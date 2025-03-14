// Authentication API service
import { UserPermissions } from "@trm/_types/permissions";

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

// Flag para habilitar/deshabilitar la obtención de permisos
// CAMBIAR A TRUE CUANDO LA API DE PERMISOS ESTÉ IMPLEMENTADA
// (debe coincidir con el valor en use-auth.ts)
export const PERMISSIONS_API_ENABLED = false;

export async function loginUser(credentials: LoginCredentials): Promise<string> {
  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to login");
    }

    const data: LoginResponse = await response.json();
    return data.token;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Cierra la sesión de un usuario invalidando su token
 * @param token Token JWT del usuario a invalidar
 * @returns Verdadero si el logout fue exitoso
 */
export async function logoutUser(token: string): Promise<boolean> {
  try {
    const response = await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });

    if (!response.ok) {
      console.warn("Error al hacer logout en el servidor:", response.status, response.statusText);
      // Incluso si falla, consideramos el logout como exitoso localmente
      return true;
    }

    return true;
  } catch (error) {
    console.error("Error en logout:", error);
    // Incluso si hay una excepción, consideramos el logout como exitoso localmente
    return true;
  }
}

/**
 * Obtiene los permisos del usuario actual
 * @param token Token JWT del usuario
 * @returns Permisos del usuario
 */
export async function getUserPermissions(token: string): Promise<UserPermissions> {
  // Si la API está deshabilitada, devolver permisos por defecto sin hacer la llamada
  if (!PERMISSIONS_API_ENABLED) {
    return {
      modules: ["dashboard", "operations", "management", "autoadmin", "support"],
      sites: ["site1", "site2"],
      departments: ["dep1", "dep2"],
      areas: ["area1", "area2"],
      screens: [],
    };
  }

  try {
    const response = await fetch("http://localhost:8080/user/permissions", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Si el servidor responde con 403 Forbidden, es posible que los permisos aún no estén configurados
    if (response.status === 403) {
      console.warn("El usuario no tiene permisos configurados (403 Forbidden)");
      return {
        modules: [],
        sites: [],
        departments: [],
        areas: [],
        screens: [],
      };
    }

    if (!response.ok) {
      console.error("Error al obtener permisos:", response.status, response.statusText);
      // Si hay cualquier otro error, devolvemos permisos vacíos
      return {
        modules: [],
        sites: [],
        departments: [],
        areas: [],
        screens: [],
      };
    }

    return await response.json();
  } catch (error) {
    console.error("Error obteniendo permisos:", error);
    // En caso de error, devolvemos permisos vacíos
    return {
      modules: [],
      sites: [],
      departments: [],
      areas: [],
      screens: [],
    };
  }
}
