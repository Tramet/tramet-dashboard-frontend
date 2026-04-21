import { api } from "@trm/_lib/api/api-client";

export const getCustomers = async () => {
  return api.get("/customers");
};

