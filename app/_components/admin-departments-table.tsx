"use client";

import React, { useEffect, useState } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import { DataTable } from "@trm/_components/ui/custom/data-table";
import { getDepartments, Department } from "@trm/_api/departments";
import { RefreshCw } from "lucide-react";
import { Button } from "@trm/_components/ui/button";

export type DepartmentRow = {
  id: string;
  department: string;
};

const columnHelper = createColumnHelper<DepartmentRow>();

export const columns = [
  columnHelper.accessor("id", {
    header: "ID",
  }),
  columnHelper.accessor("department", {
    header: "Departamento",
    enableSorting: true,
  }),
];

export function AdminDepartmentsTable() {
  const [departments, setDepartments] = useState<DepartmentRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDepartments = async () => {
    setIsLoading(true);
    try {
      const data = await getDepartments();
      const rows: DepartmentRow[] = data.map((dept: Department) => ({
        id: dept.id.toString(),
        department: dept.name,
      }));
      setDepartments(rows);
    } catch (error) {
      console.error("Error al cargar departamentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-end mb-2">
        <Button
          variant="outline"
          size="sm"
          onClick={fetchDepartments}
          disabled={isLoading}
          className="flex items-center gap-1 text-xs"
        >
          <RefreshCw className={`h-3 w-3 ${isLoading ? "animate-spin" : ""}`} />
          Actualizar
        </Button>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center h-24 text-muted-foreground">
          Cargando departamentos...
        </div>
      ) : (
        <DataTable
          data={departments}
          columns={columns}
          filterColumn={{
            key: "department",
            label: "Departamento",
          }}
          pageSize={10}
        />
      )}
    </div>
  );
}
