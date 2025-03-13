import { CreateCustomerDialog } from "@trm/_components/create-customer-dialog";
import { TrametCustomersTable } from "@trm/_components/tramet-customers-table";
import React from "react";

const TrametCustomers = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight my-4">Clientes</h2>
      <CreateCustomerDialog />
      <TrametCustomersTable />
    </div>
  );
};

export default TrametCustomers;
