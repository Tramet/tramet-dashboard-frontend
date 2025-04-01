import { User, ApiUser, defaultPermissions } from "@trm/_types/user";
import { getAllUsers, deleteUser } from "@trm/_api/admin/users";
import { mockUsers } from "@trm/_data/users.mock";
import { toast } from "sonner";

/**
 * Servicio para gestionar operaciones relacionadas con usuarios
 * Siguiendo el principio de responsabilidad única
 */
export class UserService {
  /**
   * Obtiene todos los usuarios desde la API
   * @param token Token de autenticación
   * @returns Lista de usuarios procesados
   */
  static async fetchUsers(token: string): Promise<User[]> {
    try {
      // Obtener usuarios reales mediante la API
      const apiUsers = await getAllUsers(token);
      
      // Mapear la estructura de la API a la estructura esperada por el frontend
      const processedUsers: User[] = apiUsers.map(apiUser => {
        // Buscar si existe un usuario mockeado con el mismo nombre de usuario
        const mockedUser = mockUsers.find(mock => mock.user === apiUser.username);
        
        return {
          id: apiUser.id.toString(),
          user: apiUser.username,
          position: apiUser.role.name,
          permissions: mockedUser?.permissions || defaultPermissions
        };
      });
      
      return processedUsers;
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      throw error;
    }
  }

  /**
   * Elimina un usuario
   * @param token Token de autenticación
   * @param userId ID del usuario a eliminar
   */
  static async deleteUser(token: string, userId: string): Promise<void> {
    try {
      // Verificar que userId sea válido
      if (!userId) {
        throw new Error("ID de usuario no válido");
      }
      
      // Eliminar usuario mediante la API
      await deleteUser(token, userId);
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      throw error;
    }
  }

  /**
   * Obtiene las posiciones únicas de los usuarios
   * @param users Lista de usuarios
   * @returns Array de posiciones únicas
   */
  static getUniquePositions(users: User[]): string[] {
    const positions = users.map(user => user.position || "No asignado");
    return Array.from(new Set(positions)).sort();
  }

  /**
   * Filtra usuarios por posición
   * @param users Lista de usuarios
   * @param positionFilter Filtro de posición
   * @returns Lista de usuarios filtrada
   */
  static filterUsersByPosition(users: User[], positionFilter: string): User[] {
    if (!positionFilter) return users;
    return users.filter(user => (user.position || "No asignado") === positionFilter);
  }
}
