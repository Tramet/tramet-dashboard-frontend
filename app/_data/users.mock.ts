import { User } from "@trm/_types/user";

/**
 * Datos falsos para desarrollo
 */
export const mockUsers: User[] = [
  {
    id: "1",
    user: "admin",
    position: "Gerente de Sistemas",
    permissions: {
      sites: ["site1", "site2"],
      departments: ["site1_dept1", "site2_dept1"],
      areas: ["site1_dept1_area1", "site2_dept1_area1"],
      modules: ["dashboard", "operations", "management", "reports", "configuration"],
      screens: ["dashboard_main", "operations_list", "management_users", "reports_daily", "configuration_system"]
    }
  },
  {
    id: "2",
    user: "supervisor",
    position: "Supervisor",
    permissions: {
      sites: ["site1"],
      departments: ["site1_dept2"],
      areas: ["site1_dept2_area1"],
      modules: ["dashboard", "operations"],
      screens: ["dashboard_main", "operations_list"]
    }
  },
  {
    id: "3",
    user: "operador",
    position: "Operador",
    permissions: {
      sites: ["site1"],
      departments: ["site1_dept3"],
      areas: ["site1_dept3_area1"],
      modules: ["dashboard"],
      screens: ["dashboard_main"]
    }
  },
  {
    id: "4",
    user: "analista",
    position: "Analista",
    permissions: {
      sites: ["site2"],
      departments: ["site2_dept2"],
      areas: ["site2_dept2_area1"],
      modules: ["reports", "dashboard"],
      screens: ["dashboard_analytics", "reports_daily", "reports_weekly"]
    }
  },
  {
    id: "5",
    user: "tecnico",
    position: "Técnico",
    permissions: {
      sites: ["site1", "site2"],
      departments: ["site1_dept1", "site2_dept1"],
      areas: ["site1_dept1_area2", "site2_dept1_area2"],
      modules: ["operations"],
      screens: ["operations_details"]
    }
  }
];
