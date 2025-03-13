import { create } from "zustand";
import { jwtDecode } from "jwt-decode";
import { persist } from "zustand/middleware";

// Define the user interface based on JWT token claims
interface User {
  sub: string; // username
  role?: string; // user role if available in token
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  initialize: () => Promise<void>;
  login: (token: string) => void;
  logout: () => void;
}

// Crear el store de autenticación con Zustand, utilizando persist para almacenar en localStorage
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      // Método para inicializar el estado de autenticación
      initialize: async () => {
        set({ isLoading: true });

        try {
          const token = get().token;
          console.log("[Auth] Verificando token almacenado:", token ? "Existe" : "No existe");

          if (token) {
            try {
              const decodedToken = jwtDecode<User>(token);
              // Check if token is expired
              if (decodedToken.exp * 1000 > Date.now()) {
                console.log("[Auth] Token válido para:", decodedToken.sub);
                set({
                  user: decodedToken,
                  isAuthenticated: true,
                });
              } else {
                console.log("[Auth] Token expirado, removiendo");
                set({
                  token: null,
                  user: null,
                  isAuthenticated: false,
                });
              }
            } catch (error) {
              console.log("[Auth] Error decodificando token:", error);
              set({
                token: null,
                user: null,
                isAuthenticated: false,
              });
            }
          }
        } finally {
          // Retrasamos un poco para evitar parpadeos en la UI
          setTimeout(() => {
            console.log("[Auth] Carga completada, autenticado:", get().isAuthenticated);
            set({ isLoading: false });
          }, 500);
        }
      },

      // Método para iniciar sesión
      login: (newToken: string) => {
        try {
          const decodedToken = jwtDecode<User>(newToken);
          set({
            token: newToken,
            user: decodedToken,
            isAuthenticated: true,
          });
        } catch (error) {
          console.error("[Auth] Error al decodificar token:", error);
        }
      },

      // Método para cerrar sesión
      logout: () => {
        set({
          token: null,
          user: null,
          isAuthenticated: false,
        });
      },
    }),
    {
      name: "auth-storage", // nombre único para el storage
      partialize: (state) => ({ token: state.token }), // Solo persistir el token
    }
  )
);

export default useAuthStore;
