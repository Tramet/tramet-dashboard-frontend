// hook to get customers from the API
import { create } from "zustand";

type Customer = {
  name: string;
  details: {
    mission: string;
    vision: string;
    companyValues: string;
    history: string;
    goals: string;
    fiscalData: string;
    digitalContract: string;
  };
  info: {
    logo: string;
    direction: string;
    coordinates: string;
    finalCost: number;
    paymentPeriod: string;
    contractPlan: string;
    status: boolean;
  };
};

interface CustomersState {
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
}

export const useGetCustomers = create<CustomersState>((set) => ({
  customers: [],
  setCustomers: (customers) => set({ customers }),
}));
