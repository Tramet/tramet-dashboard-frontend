"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@trm/_lib/auth/auth-context";
import useSiteSelection from "@trm/_hooks/use-site-selection";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import useAreaSelection from "@trm/_hooks/use-area-selection";

export default function ManagementPage() {
  const { isAuthenticated, userData } = useAuth();
  const router = useRouter();
  const { selectedSite } = useSiteSelection();
  const { selectedDepartment } = useDepartmentSelection();
  const { selectedArea } = useAreaSelection();

  // Verificar que hay un contexto completo seleccionado
  useEffect(() => {
    if (!selectedSite || !selectedDepartment || !selectedArea) {
      router.push("/dashboard");
    }
  }, [selectedSite, selectedDepartment, selectedArea, router]);

  // Si no hay contexto completo, no renderizar nada
  if (!selectedSite || !selectedDepartment || !selectedArea) {
    return null;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Gestión</h1>
      <div className="bg-muted p-4 rounded-lg mb-6">
        <h2 className="font-medium mb-2">Contexto actual:</h2>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <span className="text-sm text-muted-foreground">Sitio:</span>
            <p>{selectedSite}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Departamento:</span>
            <p>{selectedDepartment}</p>
          </div>
          <div>
            <span className="text-sm text-muted-foreground">Área:</span>
            <p>{selectedArea}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Gestión de recursos</h3>
          <p className="text-sm text-muted-foreground">Administración de recursos para el área seleccionada.</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Configuración</h3>
          <p className="text-sm text-muted-foreground">Ajustes y configuraciones específicas para el área.</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Reportes</h3>
          <p className="text-sm text-muted-foreground">Generación de reportes y análisis de datos.</p>
        </div>
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Planificación</h3>
          <p className="text-sm text-muted-foreground">Herramientas de planificación y seguimiento.</p>
        </div>
      </div>
    </div>
  );
}
