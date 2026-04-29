import Cookies from "js-cookie";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

interface RequestOptions extends RequestInit {
  params?: Record<string, string>;
}

/**
 * Cliente de API centralizado para manejar peticiones fetch de forma estandarizada.
 * Maneja automáticamente los headers de autenticación y errores comunes.
 */
export async function apiRequest<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, headers, ...rest } = options;
  
  // Construir URL con parámetros de búsqueda si existen
  let url = `${BASE_URL}${endpoint}`;
  if (params) {
    const searchParams = new URLSearchParams(params);
    url += `?${searchParams.toString()}`;
  }

  // Obtener el token de la cookie 'auth-storage' (formato de Zustand persist)
  let token = "";
  try {
    const authCookie = Cookies.get("auth-storage");
    if (authCookie) {
      const authData = JSON.parse(decodeURIComponent(authCookie));
      token = authData.state?.token || "";
    }
  } catch (e) {
    console.error("Error al obtener token para la petición:", e);
  }

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  try {
    const response = await fetch(url, {
      ...rest,
      headers: {
        ...defaultHeaders,
        ...headers,
      },
    });

    if (!response.ok) {
      // Si es un 403 (Forbidden), lo manejamos de forma especial
      if (response.status === 403) {
        console.warn(`Acceso denegado (403) a: ${url}. Es posible que el usuario no tenga permisos para este recurso específico.`);
        // No lanzamos error ni mostramos toast para evitar spam en la UI, 
        // simplemente devolvemos un valor que indique fallo de permisos si es necesario
        // o dejamos que el llamador lo maneje.
        throw new Error("FORBIDDEN");
      }

      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        const errorText = await response.text();
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorText || errorMessage;
        } catch (e) {
          // No es JSON, usar el texto plano si existe
          if (errorText) errorMessage = errorText;
        }
      } catch (e) {
        // Error al leer el texto
      }
      
      // Notificar error al usuario
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }

    // Si la respuesta no tiene contenido (204 No Content), devolver null o {}
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`API Error [${url}]:`, error.message);
    }
    throw error;
  }
}

// Helpers para verbos HTTP comunes
export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => 
    apiRequest<T>(endpoint, { ...options, method: "GET" }),
  
  post: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    apiRequest<T>(endpoint, { ...options, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  
  put: <T>(endpoint: string, body?: any, options?: RequestOptions) => 
    apiRequest<T>(endpoint, { ...options, method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  
  delete: <T>(endpoint: string, options?: RequestOptions) => 
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
