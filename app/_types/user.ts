/**
 * Modelo de usuario que incluye permisos para la interfaz de usuario
 */
export type User = {
  id: string;
  user: string;
  position?: string;
  permissions?: UserPermissions;
};

/**
 * Estructura de permisos de usuario
 */
export type UserPermissions = {
  sites: string[];
  departments: string[];
  areas: string[];
  modules: string[];
  screens: string[];
};

/**
 * Interfaz para la estructura de usuario que viene de la API
 */
export interface ApiUser {
  id: number;
  username: string;
  settings: {
    id: number;
    language: string;
    theme: string;
    notifications: boolean;
  };
  role: {
    id: number;
    name: string;
  };
  userauthorities: Array<{
    id: number;
    authority: {
      id: number;
      name: string;
    }
  }>;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  authorities: Array<{
    authority: string;
  }>;
  enabled: boolean;
}

/**
 * Datos predeterminados para los permisos cuando no están en la API
 */
export const defaultPermissions: UserPermissions = {
  sites: [],
  departments: [],
  areas: [],
  modules: [],
  screens: [],
};
