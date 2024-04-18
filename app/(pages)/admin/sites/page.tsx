import { AdminDepartmentsTable } from "@trm/_components/admin-departments-table";
import { AdminSitesTable } from "@trm/_components/admin-sites-table";
import React from "react";

const AdminDepartments = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight my-4">Sitios</h2>
      <AdminSitesTable />
    </div>
  );
};

export default AdminDepartments;
