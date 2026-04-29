import { api } from "@trm/_lib/api/api-client";

export interface Site {
  id: number;
  site: string;
  city: string;
  state: string;
  country: string;
  customer: {
    id: number;
    name: string;
  };
}

/**
 * Obtiene todas las sucursales del sistema.
 * GET /sites
 */
export const getSites = async (): Promise<Site[]> => {
  return api.get<Site[]>("/sites");
};

/**
 * Obtiene las sucursales de un cliente específico.
 * GET /sites/customer/{customerId}
 */
export const getSitesByCustomer = async (customerId: number): Promise<Site[]> => {
  return api.get<Site[]>(`/sites/customer/${customerId}`);
};

/**
 * Crea una nueva sucursal.
 * POST /sites
 */
export const createSite = async (data: {
  site: string;
  city: string;
  address?: string;
  state: string;
  country: string;
  customer: { id: number };
}): Promise<Site> => {
  return api.post<Site>("/sites", data);
};

/**
 * Actualiza una sucursal existente.
 * PUT /sites/{id}
 */
export const updateSite = async (id: number, data: Partial<Site>): Promise<Site> => {
  return api.put<Site>(`/sites/${id}`, data);
};

/**
 * Elimina una sucursal.
 * DELETE /sites/{id}
 */
export const deleteSite = async (id: number): Promise<void> => {
  return api.delete(`/sites/${id}`);
};
