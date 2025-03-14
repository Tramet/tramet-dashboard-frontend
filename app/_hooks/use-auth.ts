import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { persist, createJSONStorage } from "zustand/middleware";
import { getUserPermissions, PERMISSIONS_API_ENABLED, logoutUser } from "@trm/_api/auth";
import usePermissionsStore from "./use-permissions";
import Cookies from "js-cookie";

// Tipos de roles disponibles
export type UserRole = "TRAMET_ADMIN" | "CUSTOMER_ADMIN" | "USER";

// Interfaz para los datos del usuario extraídos del token
export interface UserData {
  sub: string;
  role: UserRole;
  exp: number;
}

// Función para extraer el rol del token JWT
function extractRoleFromToken(tokenData: any): UserRole | null {
  // Verificar si el rol está en el campo 'role'
  if (tokenData.role && typeof tokenData.role === "string") {
    return tokenData.role as UserRole;
  }
  // Verificar si el rol está en el campo 'authorities'
  else if (tokenData.authorities) {
    // Si authorities es un array, tomar el primer elemento
    if (Array.isArray(tokenData.authorities)) {
      return tokenData.authorities[0] as UserRole;
    }
    // Si authorities es un string
    else if (typeof tokenData.authorities === "string") {
      return tokenData.authorities as UserRole;
    }
  }
  return null;
}

// Función segura para obtener permisos (no falla si el endpoint responde con error)
async function safeGetUserPermissions(token: string) {
  // Si la API de permisos está deshabilitada, establecer permisos vacíos y salir
  if (!PERMISSIONS_API_ENABLED) {
    console.log("API de permisos deshabilitada. Se usarán permisos por defecto.");
    usePermissionsStore.getState().setPermissions({
      // Para desarrollo, podemos incluir algunos permisos por defecto
      modules: ["dashboard", "operations", "management", "autoadmin", "support"],
      sites: ["site1", "site2"],
      departments: ["dep1", "dep2"],
      areas: ["area1", "area2"],
      screens: [],
    });
    return;
  }

  try {
    const permissions = await getUserPermissions(token);
    usePermissionsStore.getState().setPermissions(permissions);
  } catch (error) {
    console.warn("No se pudieron cargar los permisos del usuario, pero se continuará con la sesión:", error);
    // Establecer permisos vacíos cuando fallan
    usePermissionsStore.getState().setPermissions({
      modules: [],
      sites: [],
      departments: [],
      areas: [],
      screens: [],
    });
  }
}

// Estado de autenticación
interface AuthState {
  // Datos del usuario actual
  userData: UserData | null;

  // Token JWT
  token: string | null;

  // Estado de autenticación
  isAuthenticated: boolean;

  // Estado de carga inicial
  isInitialized: boolean;

  // Inicializar estado (verificar token guardado)
  initialize: () => Promise<void>;

  // Método para iniciar sesión
  login: (token: string) => Promise<void>;

  // Método para cerrar sesión
  logout: () => void;
}

// Crear un almacenamiento personalizado que use cookies para ser accesible desde el middleware
const cookieStorage = {
  getItem: (name: string) => {
    if (typeof window === "undefined") return null;
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string) => {
    if (typeof window !== "undefined") {
      Cookies.set(name, value, {
        expires: 7,
        path: "/",
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    }
  },
  removeItem: (name: string) => {
    if (typeof window !== "undefined") {
      Cookies.remove(name, { path: "/" });
    }
  },
};

// Crear store de autenticación
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      userData: null,
      token: null,
      isAuthenticated: false,
      isInitialized: false,

      // Método para inicializar y verificar el token guardado
      initialize: async () => {
        if (get().isInitialized) return;

        const token = get().token;
        if (!token) {
          set({ isInitialized: true });
          return;
        }

        try {
          // Decodificar token JWT
          const decodedData = jwtDecode<any>(token);

          // Verificar si ha expirado
          if (decodedData.exp * 1000 < Date.now()) {
            throw new Error("Token expirado");
          }

          // Extraer rol del token
          const role = extractRoleFromToken(decodedData);
          if (!role) {
            throw new Error("Rol no encontrado en el token");
          }

          // Crear objeto UserData
          const userData: UserData = {
            sub: decodedData.sub || "",
            role: role,
            exp: decodedData.exp,
          };

          // Establecer datos y cargar permisos si es necesario
          set({
            userData,
            isAuthenticated: true,
            isInitialized: true,
          });

          // Cargar permisos para usuarios (sin bloquear si falla)
          if (role === "USER") {
            // No esperamos a que termine para evitar bloquear la inicialización
            safeGetUserPermissions(token);
          }
        } catch (error) {
          console.error("Error al inicializar auth:", error);
          // Limpiar datos en caso de error
          set({
            token: null,
            userData: null,
            isAuthenticated: false,
            isInitialized: true,
          });
        }
      },

      // Método para iniciar sesión
      login: async (token: string) => {
        try {
          // Decodificar token JWT
          const decodedData = jwtDecode<any>(token);

          // Verificar si ha expirado
          if (decodedData.exp * 1000 < Date.now()) {
            throw new Error("Token expirado");
          }

          // Extraer rol del token
          const role = extractRoleFromToken(decodedData);
          if (!role) {
            throw new Error("Rol no encontrado en el token");
          }

          // Crear objeto UserData
          const userData: UserData = {
            sub: decodedData.sub || "",
            role: role,
            exp: decodedData.exp,
          };

          // Establecer datos de autenticación
          set({
            userData,
            token,
            isAuthenticated: true,
            isInitialized: true,
          });

          // Cargar permisos para usuarios (sin bloquear si falla)
          if (role === "USER") {
            // No esperamos a que termine para evitar bloquear el login
            safeGetUserPermissions(token);
          }
        } catch (error) {
          console.error("Error en login:", error);
          // Error al procesar el token
          set({
            isInitialized: true,
            isAuthenticated: false,
            userData: null,
            token: null,
          });
          throw error; // Re-lanzar error para manejo en la UI
        }
      },

      // Método para cerrar sesión
      logout: () => {
        const token = get().token;

        // Si hay un token, intentar invalidarlo en el servidor
        if (token) {
          // No esperamos a que termine para no bloquear el logout
          logoutUser(token).catch((error) => {
            console.warn("Error al realizar logout en el servidor:", error);
          });
        }

        // Limpiar datos localmente independientemente del resultado del servidor
        set({
          userData: null,
          token: null,
          isAuthenticated: false,
        });

        // Reiniciar los permisos
        usePermissionsStore.getState().setPermissions({
          modules: [],
          sites: [],
          departments: [],
          areas: [],
          screens: [],
        });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ token: state.token }),
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);

export default useAuthStore;
