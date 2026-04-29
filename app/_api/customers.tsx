import { api } from "@trm/_lib/api/api-client";

export const getCustomers = async () => {
  return api.get("/customers");
};

export const createCustomer = async (data: any) => {
  return api.post("/customers", data);
};

