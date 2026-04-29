// hook to get customers from the API
import { create } from "zustand";

import { Customer } from "@trm/_types/customer";

interface CustomersState {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
}

export const useGetCustomers = create<CustomersState>((set) => ({
  customers: [],
  setCustomers: (customers) => set({ customers }),
}));
