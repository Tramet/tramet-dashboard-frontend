/**
 * Lista plana de todos los permisos posibles siguiendo la estructura jerárquica
 */
export const totalPermissions = {
  // Sitios
  sites: ["site1", "site2"],
  
  // Departamentos (con prefijo que indica a qué sitio pertenecen)
  departments: [
    "site1_dept1", "site1_dept2", "site1_dept3", 
    "site2_dept1", "site2_dept2"
  ],
  
  // Áreas (con prefijo que indica a qué departamento pertenecen)
  areas: [
    "site1_dept1_area1", "site1_dept1_area2", "site1_dept1_area3",
    "site1_dept2_area1", "site1_dept2_area2",
    "site1_dept3_area1",
    "site2_dept1_area1", "site2_dept1_area2",
    "site2_dept2_area1"
  ],
  
  // Módulos funcionales
  modules: ["dashboard", "operations", "management", "reports", "configuration"],
  
  // Pantallas (con prefijo que indica a qué módulo pertenecen)
  screens: [
    "dashboard_main", "dashboard_analytics",
    "operations_list", "operations_details",
    "management_users", "management_roles",
    "reports_daily", "reports_weekly", "reports_monthly",
    "configuration_system", "configuration_preferences"
  ],
};

/**
 * Metadatos de sitios, departamentos y áreas para mejor presentación en la UI
 */
export const siteMetadata = {
  site1: {
    name: "Sitio Principal",
    departments: {
      site1_dept1: {
        name: "Departamento 1",
        areas: {
          site1_dept1_area1: { name: "Área 1" },
          site1_dept1_area2: { name: "Área 2" },
          site1_dept1_area3: { name: "Área 3" },
        },
      },
      site1_dept2: {
        name: "Departamento 2",
        areas: {
          site1_dept2_area1: { name: "Área 1" },
          site1_dept2_area2: { name: "Área 2" },
        },
      },
      site1_dept3: {
        name: "Departamento 3",
        areas: {
          site1_dept3_area1: { name: "Área 1" },
        },
      },
    },
  },
  site2: {
    name: "Sitio Secundario",
    departments: {
      site2_dept1: {
        name: "Departamento 1",
        areas: {
          site2_dept1_area1: { name: "Área 1" },
          site2_dept1_area2: { name: "Área 2" },
        },
      },
      site2_dept2: {
        name: "Departamento 2",
        areas: {
          site2_dept2_area1: { name: "Área 1" },
        },
      },
    },
  },
};
