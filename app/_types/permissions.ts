// Tipos de permisos para usuarios

// Módulos disponibles en la aplicación
export type ModuleType = "dashboard" | "operations" | "management" | "autoadmin" | "support";

// Definición de permisos para un usuario
export interface UserPermissions {
  // Módulos a los que el usuario tiene acceso
  modules: ModuleType[];

  // Sitios a los que el usuario tiene acceso
  sites: string[];

  // Departamentos a los que el usuario tiene acceso
  departments: string[];

  // Áreas a las que el usuario tiene acceso
  areas: string[];

  // Pantallas específicas a las que el usuario tiene acceso
  screens: string[];
}

// Permisos para un tipo de usuario específico
export interface UserPermissionsState {
  // Permisos del usuario actual
  permissions: UserPermissions;

  // Flag para indicar si los permisos están cargando
  isLoading: boolean;

  // Método para actualizar los permisos
  setPermissions: (permissions: UserPermissions) => void;

  // Verificar si el usuario tiene acceso a un módulo específico
  hasModuleAccess: (module: ModuleType) => boolean;

  // Verificar si el usuario tiene acceso a un sitio específico
  hasSiteAccess: (siteId: string) => boolean;

  // Verificar si el usuario tiene acceso a un departamento específico
  hasDepartmentAccess: (departmentId: string) => boolean;

  // Verificar si el usuario tiene acceso a un área específica
  hasAreaAccess: (areaId: string) => boolean;

  // Verificar si el usuario tiene acceso a una pantalla específica
  hasScreenAccess: (screenId: string) => boolean;
}
