import { AdminSitesTable } from "@trm/_components/admin-sites-table";
import React from "react";

const AdminSites = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight my-4">Sitios</h2>
      <AdminSitesTable />
    </div>
  );
};

export default AdminSites;
