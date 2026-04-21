import { AdminUsersTable } from "@trm/_components/admin-users-table";
import { Button } from "@trm/_components/ui/button";
import React from "react";
import { Toaster } from "react-hot-toast";

const AdminUsers = () => {
  return (
    <div>
      <Toaster position="top-right" toastOptions={{
        style: {
          background: '#fff',
          color: '#333',
          border: '1px solid hsl(23, 95%, 55%)',
        },
        success: {
          style: {
            background: '#f0fff4',
            border: '1px solid #38a169',
          },
          iconTheme: {
            primary: 'hsl(23, 95%, 55%)',
            secondary: 'white',
          },
        },
        error: {
          style: {
            background: '#fff5f5',
            border: '1px solid #e53e3e',
          },
        },
      }} />
      <h2 className="text-3xl font-bold tracking-tight my-4">Usuarios</h2>

      <AdminUsersTable />
    </div>
  );
};

export default AdminUsers;
