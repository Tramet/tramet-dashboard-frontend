import { api } from "@trm/_lib/api/api-client";

export interface Department {
  id: number;
  name: string;
}

/**
 * Obtiene todos los departamentos disponibles del backend.
 * GET /departments
 */
export const getDepartments = async (): Promise<Department[]> => {
  return api.get<Department[]>("/departments");
};

/**
 * Obtiene un departamento por su ID.
 * GET /departments/{id}
 */
export const getDepartmentById = async (id: number): Promise<Department> => {
  return api.get<Department>(`/departments/${id}`);
};
