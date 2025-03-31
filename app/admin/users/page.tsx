import { AdminUsersTable } from "@trm/_components/admin-users-table";
import { Button } from "@trm/_components/ui/button";
import React from "react";

const AdminUsers = () => {
  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight my-4">Usuarios</h2>

      <AdminUsersTable />
    </div>
  );
};

export default AdminUsers;
