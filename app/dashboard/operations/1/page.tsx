"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@trm/_lib/auth/auth-context";
import useContextStore from "@trm/_hooks/use-context-store";
import { Card, CardContent, CardHeader, CardTitle } from "@trm/_components/ui/card";
import { Badge } from "@trm/_components/ui/badge";

export default function Operation1Page() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { selectedSite, selectedDepartment, selectedArea } = useContextStore();

  // Verificar que hay un contexto completo seleccionado
  useEffect(() => {
    if (!selectedSite || !selectedDepartment || !selectedArea) {
      router.push("/dashboard");
    }
  }, [selectedSite, selectedDepartment, selectedArea, router]);

  // Si no hay contexto completo, no renderizar nada mientras redirige
  if (!selectedSite || !selectedDepartment || !selectedArea) {
    return null;
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operación 1</h1>
          <p className="text-muted-foreground">Panel de gestión operativo</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="bg-primary/5">{selectedSite}</Badge>
          <Badge variant="outline" className="bg-primary/5">{selectedDepartment}</Badge>
          <Badge variant="outline" className="bg-primary/5">{selectedArea}</Badge>
        </div>
      </header>

      <Card className="bg-muted/30">
        <CardHeader>
          <CardTitle className="text-lg">Información de Contexto</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-1">
              <span className="text-xs uppercase text-muted-foreground font-semibold">Sitio</span>
              <p className="font-medium">{selectedSite}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase text-muted-foreground font-semibold">Departamento</span>
              <p className="font-medium">{selectedDepartment}</p>
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase text-muted-foreground font-semibold">Área</span>
              <p className="font-medium">{selectedArea}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Panel de Control</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Esta es la interfaz principal para gestionar los flujos de la **Operación 1**. 
              Aquí se visualizarán las acciones específicas permitidas para el área de {selectedArea}.
            </p>
          </CardContent>
        </Card>

        <Card className="border shadow-none">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Métricas de Operación</CardTitle>
          </CardHeader>
          <CardContent className="h-32 flex items-center justify-center border-2 border-dashed rounded-md bg-muted/20">
            <p className="text-xs text-muted-foreground">
              [Gráficos y KPIs de {selectedArea} se cargarán aquí]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

