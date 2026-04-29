import { api } from "@trm/_lib/api/api-client";

export interface Subscription {
  id: number;
  department: {
    id: number;
    name: string;
  };
  customer: {
    id: number;
    name: string;
  };
}

/**
 * Obtiene las suscripciones (departamentos contratados) de un cliente.
 * GET /subscriptions/customer/{customerId}
 */
export const getSubscriptionsByCustomer = async (customerId: number): Promise<Subscription[]> => {
  return api.get<Subscription[]>(`/subscriptions/customer/${customerId}`);
};

/**
 * Obtiene los clientes suscritos a un departamento.
 * GET /subscriptions/department/{departmentId}
 */
export const getSubscriptionsByDepartment = async (departmentId: number): Promise<Subscription[]> => {
  return api.get<Subscription[]>(`/subscriptions/department/${departmentId}`);
};

/**
 * Suscribe un cliente a un departamento.
 * POST /subscriptions
 */
export const createSubscription = async (data: {
  customerId: number;
  departmentId: number;
}): Promise<Subscription> => {
  return api.post<Subscription>("/subscriptions", data);
};

/**
 * Elimina una suscripción.
 * DELETE /subscriptions/{id}
 */
export const deleteSubscription = async (id: number): Promise<void> => {
  return api.delete(`/subscriptions/${id}`);
};
