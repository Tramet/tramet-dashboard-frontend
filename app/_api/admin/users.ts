import { User, ApiUser, UserPermissions } from "@trm/_types/user";

// URL base para todas las operaciones de usuarios
const BASE_URL = "http://localhost:8080/admin/users";


const handleApiError = async (response: Response) => {
  if (!response.ok) {
    let errorMessage = `Error ${response.status}: ${response.statusText}`;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch (e) {
      // Error no es un JSON válido, usar el mensaje por defecto
    }
    throw new Error(errorMessage);
  }
  return response;
};

export const getAllUsers = async (token: string): Promise<ApiUser[]> => {
  const response = await fetch(`${BASE_URL}/all`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
  
  await handleApiError(response);
  return response.json();
};

export const createUser = async (token: string, userData: { user: string, password: string }): Promise<any> => {
  const user = {
    username: userData.user,
    password: userData.password,
    role: "USER"
  };

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

export const deleteUser = async (token: string, userId: string): Promise<void> => {
  try {
    // Convertir explícitamente el ID a entero como espera la API
    const numericId = parseInt(userId, 10);
    
    const response = await fetch(`${BASE_URL}/delete/${numericId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });
    
    if (!response.ok) {
      const responseText = await response.text();
      let errorMessage = `Error ${response.status}: ${response.statusText}`;
      
      try {
        if (responseText && responseText.trim()) {
          const errorData = JSON.parse(responseText);
          errorMessage = errorData.message || errorMessage;
        }
      } catch (e) {
        if (responseText && responseText.trim()) {
          errorMessage = `${errorMessage}. Detalles: ${responseText}`;
        }
      }
      
      throw new Error(errorMessage);
    }
  } catch (error) {
    throw error;
  }
};


export const updateUserPermissions = async (token: string, userId: string, permissions: UserPermissions): Promise<void> => {
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
