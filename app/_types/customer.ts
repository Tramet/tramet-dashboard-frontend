export type Customer = {
  id?: string | number;
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
    address: string;
    coordinates: string;
    finalCost: number;
    paymentPeriod: string;
    contractPlan: string;
    status: boolean | number;
  };
};
