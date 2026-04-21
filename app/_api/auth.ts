import { api } from "@trm/_lib/api/api-client";
import { UserPermissions } from "@trm/_types/permissions";

// Flag para habilitar/deshabilitar la API de permisos (útil para desarrollo si el endpoint no está listo)
export const PERMISSIONS_API_ENABLED = true;

interface LoginCredentials {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
}

export async function loginUser(credentials: LoginCredentials): Promise<string> {
  const data = await api.post<LoginResponse>("/auth/login", credentials);
  return data.token;
}

/**
 * Cierra la sesión de un usuario invalidando su token
 * @param token Token JWT del usuario a invalidar (opcional ya que el api-client lo maneja)
 */
export async function logoutUser(token: string): Promise<boolean> {
  try {
    await api.post("/auth/logout", { token });
    return true;
  } catch (error) {
    // Incluso si hay una excepción, consideramos el logout como exitoso localmente
    return true;
  }
}

/**
 * Obtiene los permisos del usuario actual
 */
export async function getUserPermissions(token?: string): Promise<UserPermissions> {
  try {
    return await api.get<UserPermissions>("/user/permissions");
  } catch (error) {
    console.error("Error obteniendo permisos:", error);
    // En caso de error, devolvemos permisos vacíos para no bloquear la app
    return {
      modules: [],
      sites: [],
      departments: [],
      areas: [],
      screens: [],
    };
  }
}
