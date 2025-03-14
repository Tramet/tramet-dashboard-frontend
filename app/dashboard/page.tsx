"use client";

import { useEffect } from "react";
import SelectionFlow from "@trm/_components/selection-flow/selection-flow";
import { useAuth } from "@trm/_lib/auth/auth-context";
import useSiteSelection from "@trm/_hooks/use-site-selection";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import useAreaSelection from "@trm/_hooks/use-area-selection";

export default function DashboardPage() {
  const { userData } = useAuth();
  const { selectedSite } = useSiteSelection();
  const { selectedDepartment } = useDepartmentSelection();
  const { selectedArea } = useAreaSelection();

  // Check if context is complete
  const hasCompleteContext = selectedSite && selectedDepartment && selectedArea;

  return (
    <div className="h-full w-full">
      {/* Welcome message or context selector based on selection state */}
      {!hasCompleteContext ? (
        <SelectionFlow />
      ) : (
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Bienvenido, {userData?.sub || "Usuario"}</h1>
          <p className="text-muted-foreground mb-4">Se ha seleccionado la siguiente configuración:</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Sitio</h3>
              <p>{selectedSite}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Departamento</h3>
              <p>{selectedDepartment}</p>
            </div>
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium">Área</h3>
              <p>{selectedArea}</p>
            </div>
          </div>

          {/* Dashboard content will go here */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Dashboard</h3>
              <p className="text-sm text-muted-foreground">Visualización general del área seleccionada</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Operaciones</h3>
              <p className="text-sm text-muted-foreground">Gestión de operaciones del área</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Gestión</h3>
              <p className="text-sm text-muted-foreground">Administración de recursos</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Auto-admin</h3>
              <p className="text-sm text-muted-foreground">Configuración de tu cuenta y permisos</p>
            </div>
            <div className="p-6 border rounded-lg">
              <h3 className="font-semibold mb-2">Material de apoyo</h3>
              <p className="text-sm text-muted-foreground">Documentación y recursos de ayuda</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
