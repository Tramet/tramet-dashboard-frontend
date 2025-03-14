import { create } from "zustand";
import { ModuleType, UserPermissions, UserPermissionsState } from "@trm/_types/permissions";

// Estado inicial de permisos (ningún acceso)
const initialPermissions: UserPermissions = {
  modules: [],
  sites: [],
  departments: [],
  areas: [],
  screens: [],
};

// Crear el store de permisos con Zustand
const usePermissionsStore = create<UserPermissionsState>((set, get) => ({
  permissions: initialPermissions,
  isLoading: false,

  setPermissions: (newPermissions: UserPermissions) => {
    set({ permissions: newPermissions });
  },

  hasModuleAccess: (module: ModuleType) => {
    return get().permissions.modules.includes(module);
  },

  hasSiteAccess: (siteId: string) => {
    return get().permissions.sites.includes(siteId);
  },

  hasDepartmentAccess: (departmentId: string) => {
    return get().permissions.departments.includes(departmentId);
  },

  hasAreaAccess: (areaId: string) => {
    return get().permissions.areas.includes(areaId);
  },

  hasScreenAccess: (screenId: string) => {
    return get().permissions.screens.includes(screenId);
  },
}));

export default usePermissionsStore;
