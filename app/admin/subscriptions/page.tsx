import { AdminSubscriptionsTable } from "@trm/_components/admin-subscriptions-table";
import React from "react";

const AdminSubscriptionsPage = () => {
  return (
    <div className="p-4">
      <h2 className="text-3xl font-bold tracking-tight my-4">Suscripciones y Contrataciones</h2>
      <p className="text-muted-foreground mb-6">
        Visualiza los departamentos y módulos que han sido contratados por la empresa.
      </p>
      <AdminSubscriptionsTable />
    </div>
  );
};

export default AdminSubscriptionsPage;
