import { User } from "@trm/_components/admin-users-table";

// URL base para todas las operaciones de usuarios
const BASE_URL = "http://localhost:8080/admin/users";

// Utilidad para manejar errores de API
const handleApiError = async (response: Response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
  }
  return response;
};

// Obtener todos los usuarios
export const getAllUsers = async (token: string): Promise<User[]> => {
  const response = await fetch(`${BASE_URL}/all`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  await handleApiError(response);
  return response.json();
};

// Crear un nuevo usuario
export const createUser = async (token: string, userData: { user: string, password: string }): Promise<any> => {

  const user = {
    ...userData,
    role: "USER"
  }

  const response = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });
  
  await handleApiError(response);
  return response.json();
};

// Eliminar un usuario
export const deleteUser = async (token: string, userId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/delete/${userId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  await handleApiError(response);
};

// Actualizar permisos de usuario
export const updateUserPermissions = async (token: string, userId: string, permissions: any): Promise<void> => {
  // Extraer solo las propiedades relevantes de permisos
  const updatedPermissions = {
    sites: permissions.sites || [],
    departments: permissions.departments || [],
    areas: permissions.areas || [],
    modules: permissions.modules || [],
    screens: permissions.screens || []
  };
  
  const response = await fetch(`${BASE_URL}/${userId}/permissions`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updatedPermissions)
  });
  
  await handleApiError(response);
};
