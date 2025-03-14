import { MockData } from "./types";

// Datos mock para el sistema de permisos
export const mockData: MockData = {
  // Estructura de metadatos para relaciones entre elementos
  siteMetadata: {
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
  },
  // Lista plana de todos los permisos disponibles
  totalPermissions: {
    sites: ["site1", "site2"],
    departments: ["site1_dept1", "site1_dept2", "site1_dept3", "site2_dept1", "site2_dept2"],
    areas: [
      "site1_dept1_area1",
      "site1_dept1_area2",
      "site1_dept1_area3",
      "site1_dept2_area1",
      "site1_dept2_area2",
      "site1_dept3_area1",
      "site2_dept1_area1",
      "site2_dept1_area2",
      "site2_dept2_area1",
    ],
    modules: ["dashboard", "operations", "management", "reports", "configuration"],
    screens: [
      "dashboard_main",
      "dashboard_analytics",
      "operations_list",
      "operations_details",
      "management_users",
      "management_roles",
      "reports_daily",
      "reports_weekly",
      "reports_monthly",
      "configuration_system",
      "configuration_preferences",
    ],
  },
  // Permisos del usuario actual (todos desmarcados inicialmente)
  permissions: {
    sites: [],
    departments: [],
    areas: [],
    modules: [],
    screens: [],
  },
};
