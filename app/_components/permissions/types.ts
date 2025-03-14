// Tipos para los permisos existentes
export type UserPermissions = {
  sites: string[];
  departments: string[];
  areas: string[];
  modules: string[];
  screens: string[];
};

// Tipo para un nodo en la jerarquía de permisos
export type PermissionNode = {
  id: string;
  name: string;
  type: "site" | "department" | "area" | "module" | "screen";
  // Si es false, no se muestra el checkbox (por ejemplo, para categorías que solo son organizativas)
  selectable?: boolean;
  // Nodos hijos
  children: PermissionNode[];
};

// Metadatos que describen relaciones entre elementos
export type SiteMetadata = {
  [siteId: string]: {
    name: string;
    departments: {
      [departmentId: string]: {
        name: string;
        areas: { [areaId: string]: { name: string } };
      };
    };
  };
};

// Props para el componente de árbol de permisos
export type PermissionTreeProps = {
  permissionTree: PermissionNode[];
  tempPermissions: UserPermissions;
  onPermissionsChange: (newPermissions: UserPermissions) => void;
};

// Props para el componente de nodo de permisos
export type PermissionNodeComponentProps = {
  node: PermissionNode;
  level: number;
  expandedNodes: string[];
  tempPermissions: UserPermissions;
  toggleNodeExpansion: (
    nodeId: string,
    forceExpand?: boolean,
    forceCollapse?: boolean,
    nodesToCollapse?: string[]
  ) => void;
  handleCheckboxChange: (node: PermissionNode, checked: boolean) => void;
  // Indica si el nodo padre está seleccionado, lo que determina si este nodo puede ser seleccionado
  parentIsChecked?: boolean;
};

// Utility type para los datos de ejemplo
export type MockData = {
  siteMetadata: SiteMetadata;
  totalPermissions: {
    [key: string]: string[];
  };
  permissions: UserPermissions;
};

// Props para el componente principal de permisos
export type UserPermissionsDialogProps = {
  id: string;
  name: string;
  permissions: UserPermissions;
  totalPermissions: {
    [key: string]: string[];
  };
  siteMetadata?: SiteMetadata;
  onPermissionsChange?: (newPermissions: any) => void;
  onClose?: () => void;
};
