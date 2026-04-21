import { api } from "@trm/_lib/api/api-client";
import { User, ApiUser, UserPermissions } from "@trm/_types/user";

export const getAllUsers = async (): Promise<ApiUser[]> => {
  return api.get<ApiUser[]>("/admin/users/all");
};

export const createUser = async (userData: { user: string; password: string }): Promise<any> => {
  const user = {
    username: userData.user,
    password: userData.password,
    role: "USER",
  };

  return api.post("/admin/users", user);
};

export const deleteUser = async (userId: string): Promise<void> => {
  return api.delete(`/admin/users/delete/${userId}`);
};

export const updateUserPermissions = async (userId: string, permissions: UserPermissions): Promise<void> => {
  // Extraer solo las propiedades relevantes de permisos
  const updatedPermissions = {
    sites: permissions.sites || [],
    departments: permissions.departments || [],
    areas: permissions.areas || [],
    modules: permissions.modules || [],
    screens: permissions.screens || [],
  };

  return api.put(`/admin/users/${userId}/permissions`, updatedPermissions);
};

