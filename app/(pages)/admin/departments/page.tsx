import { AdminDepartmentsTable } from "@trm/_components/admin-departments-table";
import React from "react";

const AdminDepartments = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight my-4">Departamentos</h2>
      <AdminDepartmentsTable />
    </div>
  );
};

export default AdminDepartments;
