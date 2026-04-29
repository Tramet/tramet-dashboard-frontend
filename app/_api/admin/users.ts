import { api } from "@trm/_lib/api/api-client";
import { ApiUser } from "@trm/_types/user";

/**
 * Obtiene todos los usuarios del sistema.
 * GET /admin/users/all
 * El token se maneja automáticamente en el api-client via cookies.
 */
export const getAllUsers = async (): Promise<ApiUser[]> => {
  return api.get<ApiUser[]>("/admin/users/all");
};

/**
 * Crea un nuevo usuario mediante el endpoint de registro.
 * POST /auth/register
 * El token se maneja automáticamente en el api-client.
 */
export const createUser = async (userData: { user: string; password: string; role?: string; customerId?: string }): Promise<any> => {
  const payload = {
    username: userData.user,
    password: userData.password,
    role: userData.role || "USER",
    customerId: userData.customerId ? Number(userData.customerId) : null,
  };

  return api.post("/auth/register", payload);
};

/**
 * Vincula un usuario existente a una empresa (Customer).
 * Requerido porque el endpoint de registro no procesa el customerId.
 * POST /customerUser/UserToCustomer
 */
export const linkUserToCustomer = async (userId: number, customerId: number): Promise<any> => {
  const payload = {
    userId,
    customerId
  };
  return api.post("/customerUser/UserToCustomer", payload);
};

/**
 * Elimina un usuario por su ID.
 * DELETE /admin/users/delete/{id}
 */
export const deleteUser = async (userId: string): Promise<void> => {
  return api.delete(`/admin/users/delete/${userId}`);
};

/**
 * Actualiza los permisos de un usuario.
 * PUT /admin/users/{id}
 */
export const updateUserPermissions = async (userId: string, permissions: any): Promise<void> => {
  const updatedPermissions = {
    sites: permissions.sites || [],
    departments: permissions.departments || [],
    areas: permissions.areas || [],
    modules: permissions.modules || [],
    screens: permissions.screens || [],
  };

  return api.put(`/admin/users/update/${userId}`, updatedPermissions);
};
