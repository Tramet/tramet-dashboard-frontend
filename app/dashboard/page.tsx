"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@trm/_lib/auth/auth-context";
import useContextStore from "@trm/_hooks/use-context-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@trm/_components/ui/card";
import { useRouter } from "next/navigation";
import { BsKanban, BsGear, BsListUl, BsEnvelope, BsHouseDoor } from "react-icons/bs";
import { getSites, Site } from "@trm/_api/sites";
import { getDepartments, Department } from "@trm/_api/departments";
import { AREAS_LIST } from "@trm/_components/_layout/carousel-areas/areas-list";

export default function DashboardPage() {
  const { userData } = useAuth();
  const { selectedSite, selectedDepartment, selectedArea } = useContextStore();
  const router = useRouter();

  const [siteName, setSiteName] = useState<string>("");
  const [deptName, setDeptName] = useState<string>("");
  const [areaName, setAreaName] = useState<string>("");

  useEffect(() => {
    const resolveNames = async () => {
      if (selectedSite) {
        try {
          const sites = await getSites();
          const site = sites.find(s => s.id.toString() === selectedSite);
          setSiteName(site?.site || selectedSite);
        } catch (e) {
          setSiteName(selectedSite);
        }
      }

      if (selectedDepartment) {
        try {
          const depts = await getDepartments();
          const dept = depts.find(d => d.id.toString() === selectedDepartment);
          setDeptName(dept?.name || selectedDepartment);
        } catch (e) {
          setDeptName(selectedDepartment);
        }
      }

      if (selectedArea) {
        const area = AREAS_LIST.find(a => a.path === selectedArea);
        setAreaName(area?.name || selectedArea);
      }
    };

    resolveNames();
  }, [selectedSite, selectedDepartment, selectedArea]);

  const isContextComplete = !!(selectedSite && selectedDepartment && selectedArea);

  return (
    <div className="p-6 h-full w-full overflow-auto">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Bienvenido, {userData?.sub || "Usuario"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isContextComplete 
              ? (
                <span>
                  Gestionando <span className="text-primary font-semibold">{areaName}</span> en <span className="text-primary font-semibold">{deptName}</span> ({siteName})
                </span>
              )
              : "Selecciona un sitio, departamento y área en la barra superior para comenzar."}
          </p>
        </header>

        {isContextComplete ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard")}>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BsHouseDoor className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Vista General</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Resumen de indicadores y métricas principales del área.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/operations/almacenaje")}>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BsKanban className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Operaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Gestión activa y monitoreo de las operaciones diarias.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/management")}>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BsGear className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Gestión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Administración de recursos, equipos y configuraciones.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/autoadmin")}>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BsListUl className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Auto-administración</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Configuración de cuenta, permisos y preferencias personales.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => router.push("/dashboard/support")}>
              <CardHeader className="flex flex-row items-center space-x-4 pb-2">
                <div className="p-2 bg-primary/10 rounded-full">
                  <BsEnvelope className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Soporte y Ayuda</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Manuales, guías y contacto con el equipo de asistencia.
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-muted/50 border-dashed">
            <CardHeader>
              <CardTitle>Configuración Requerida</CardTitle>
              <CardDescription>
                Para mostrarte información relevante, necesitamos saber en qué contexto laboral te encuentras.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-10">
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                  Utiliza el selector en la esquina superior para elegir tu Sitio, Departamento y Área.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
