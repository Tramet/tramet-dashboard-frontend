import { PermissionNode, SiteMetadata, UserPermissions } from "./types";

/**
 * Construye un árbol de nodos de permisos a partir de los metadatos y permisos disponibles
 *
 * @param siteMetadata Metadatos que describen las relaciones entre sitios, departamentos y áreas
 * @param safePermissions Lista plana de todos los permisos disponibles
 * @returns Array de nodos raíz del árbol de permisos
 */
export const buildPermissionTree = (
  siteMetadata: SiteMetadata,
  safePermissions: {
    [key: string]: string[];
  }
): PermissionNode[] => {
  const tree: PermissionNode[] = [];

  // Agregar todos los sitios
  Object.keys(siteMetadata).forEach((siteId) => {
    const siteInfo = siteMetadata[siteId];

    // Crear nodo de sitio
    const siteNode: PermissionNode = {
      id: siteId,
      name: siteInfo.name,
      type: "site",
      selectable: true,
      children: [],
    };

    // Agregar departamentos a este sitio
    Object.keys(siteInfo.departments || {}).forEach((deptId) => {
      const deptInfo = siteInfo.departments[deptId];

      // Crear nodo de departamento
      const deptNode: PermissionNode = {
        id: deptId,
        name: deptInfo.name,
        type: "department",
        selectable: true,
        children: [],
      };

      // Agregar áreas a este departamento
      Object.keys(deptInfo.areas || {}).forEach((areaId) => {
        const areaInfo = deptInfo.areas[areaId];

        // Crear nodo de área
        const areaNode: PermissionNode = {
          id: areaId,
          name: areaInfo.name,
          type: "area",
          selectable: true,
          children: [],
        };

        // Crear nodo para módulos disponibles
        const modulesNode: PermissionNode = {
          id: `${areaId}_modules`,
          name: "Módulos disponibles",
          type: "module",
          selectable: false,
          children: safePermissions.modules.map((moduleId) => {
            // Crear nodo de módulo
            const moduleNode: PermissionNode = {
              id: moduleId,
              name: moduleId,
              type: "module",
              selectable: true,
              children: [],
            };

            // Filtrar pantallas relacionadas con este módulo
            const relatedScreens = safePermissions.screens.filter((screenId) => screenId.includes(moduleId));

            // Agregar pantallas al módulo
            moduleNode.children = relatedScreens.map((screenId) => ({
              id: screenId,
              name: screenId,
              type: "screen",
              selectable: true,
              children: [],
            }));

            return moduleNode;
          }),
        };

        // Agregar módulos al área
        areaNode.children.push(modulesNode);

        // Agregar área al departamento
        deptNode.children.push(areaNode);
      });

      // Agregar departamento al sitio
      siteNode.children.push(deptNode);
    });

    // Agregar sitio al árbol
    tree.push(siteNode);
  });

  return tree;
};

/**
 * Asegura que el objeto de permisos tenga una estructura válida
 *
 * @param totalPermissions Objeto con los permisos disponibles
 * @returns Objeto con estructura de permisos segura
 */
export const getSafePermissions = (totalPermissions?: { [key: string]: string[] }) => {
  return {
    sites: Array.isArray(totalPermissions?.sites) ? totalPermissions.sites : [],
    departments: Array.isArray(totalPermissions?.departments) ? totalPermissions.departments : [],
    areas: Array.isArray(totalPermissions?.areas) ? totalPermissions.areas : [],
    modules: Array.isArray(totalPermissions?.modules) ? totalPermissions.modules : [],
    screens: Array.isArray(totalPermissions?.screens) ? totalPermissions.screens : [],
  };
};

/**
 * Asegura que el objeto de permisos del usuario tenga una estructura válida
 *
 * @param permissions Permisos actuales del usuario
 * @returns Objeto de permisos con estructura segura
 */
export const getSafeUserPermissions = (permissions?: UserPermissions): UserPermissions => {
  return {
    sites: Array.isArray(permissions?.sites) ? permissions.sites : [],
    departments: Array.isArray(permissions?.departments) ? permissions.departments : [],
    areas: Array.isArray(permissions?.areas) ? permissions.areas : [],
    modules: Array.isArray(permissions?.modules) ? permissions.modules : [],
    screens: Array.isArray(permissions?.screens) ? permissions.screens : [],
  };
};
