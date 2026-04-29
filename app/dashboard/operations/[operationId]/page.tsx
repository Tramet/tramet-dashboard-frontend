"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@trm/_lib/auth/auth-context";
import useContextStore from "@trm/_hooks/use-context-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@trm/_components/ui/card";
import { Badge } from "@trm/_components/ui/badge";
import { Activity, Building2, Briefcase, LayoutGrid, Zap } from "lucide-react";

export default function OperationPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { 
    selectedSite, siteName, 
    selectedDepartment, departmentName, 
    selectedArea, areaName 
  } = useContextStore();

  const operationId = params.operationId as string;
  const operationName = operationId 
    ? operationId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : "Operación";

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

  // Fallbacks visuales por si acaso no se guardaron los nombres
  const displaySite = siteName || `Sitio ${selectedSite}`;
  const displayDept = departmentName || `Departamento ${selectedDepartment}`;
  const displayArea = areaName || selectedArea;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span className="flex items-center gap-1 hover:text-foreground transition-colors"><Building2 className="w-4 h-4" /> {displaySite}</span>
            <span className="text-border">/</span>
            <span className="flex items-center gap-1 hover:text-foreground transition-colors"><Briefcase className="w-4 h-4" /> {displayDept}</span>
            <span className="text-border">/</span>
            <span className="flex items-center gap-1 text-primary font-medium"><LayoutGrid className="w-4 h-4" /> {displayArea}</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/50 bg-clip-text text-transparent">
            {operationName}
          </h1>
          <p className="text-lg text-muted-foreground font-medium">Panel de Gestión Operativo</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1 shadow-sm font-medium">
            <Activity className="w-3 h-3 mr-2 text-green-500 animate-pulse" />
            Sistema Activo
          </Badge>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2 border-none shadow-md bg-gradient-to-br from-card to-card/50 backdrop-blur-sm overflow-hidden relative group">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary" />
              Panel de Control
            </CardTitle>
            <CardDescription>
              Interfaz principal para gestionar los flujos de {operationName.toLowerCase()}.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-48 rounded-lg border-2 border-dashed border-border/60 flex flex-col items-center justify-center bg-muted/10 text-muted-foreground space-y-3 hover:bg-muted/30 transition-colors duration-300">
              <LayoutGrid className="w-8 h-8 opacity-50" />
              <p className="text-sm font-medium text-center px-4">
                El módulo interactivo para <span className="text-foreground font-semibold">{operationName}</span> está actualmente en fase de integración.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-md bg-card">
          <CardHeader>
            <CardTitle className="text-lg">Resumen de Contexto</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground font-bold tracking-wider">
                <Building2 className="w-3.5 h-3.5" /> Sitio
              </div>
              <p className="font-semibold text-foreground">{displaySite}</p>
            </div>
            
            <div className="space-y-2 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-2 text-xs uppercase text-muted-foreground font-bold tracking-wider">
                <Briefcase className="w-3.5 h-3.5" /> Departamento
              </div>
              <p className="font-semibold text-foreground">{displayDept}</p>
            </div>
            
            <div className="space-y-2 p-3 rounded-lg bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors">
              <div className="flex items-center gap-2 text-xs uppercase text-primary font-bold tracking-wider">
                <LayoutGrid className="w-3.5 h-3.5" /> Área Activa
              </div>
              <p className="font-semibold text-primary">{displayArea}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
