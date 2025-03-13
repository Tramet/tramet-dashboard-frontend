"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@trm/_components/ui/card";
import { Button } from "@trm/_components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@trm/_components/ui/select";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@trm/_components/ui/breadcrumb";

import useSiteSelection from "@trm/_hooks/use-site-selection";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import useAreaSelection from "@trm/_hooks/use-area-selection";

// Mock data - replace with actual API calls
const MOCK_SITES = [
  { id: "site1", name: "Sitio Principal" },
  { id: "site2", name: "Sucursal Norte" },
  { id: "site3", name: "Sucursal Sur" },
];

const MOCK_DEPARTMENTS = [
  { id: "dept1", name: "Cadena de Suministro" },
  { id: "dept2", name: "Recursos Humanos" },
  { id: "dept3", name: "Finanzas" },
];

const MOCK_AREAS = [
  { id: "area1", name: "Compras" },
  { id: "area2", name: "Almacén" },
  { id: "area3", name: "Logística" },
];

export default function SelectionFlow() {
  const router = useRouter();
  const { selectedSite, setSite } = useSiteSelection();
  const { selectedDepartment, setSelectedDepartment } = useDepartmentSelection();
  const { selectedArea, setSelectedArea } = useAreaSelection();

  const [step, setStep] = useState<"site" | "department" | "area">("site");

  // Reset dependent selections when parent selection changes
  useEffect(() => {
    if (!selectedSite) {
      setSelectedDepartment(null);
      setSelectedArea(null);
      setStep("site");
    } else if (!selectedDepartment) {
      setSelectedArea(null);
      setStep("department");
    } else if (!selectedArea) {
      setStep("area");
    }
  }, [selectedSite, selectedDepartment, selectedArea, setSelectedDepartment, setSelectedArea]);

  const handleSiteSelect = (siteId: string) => {
    setSite(siteId);
    setStep("department");
  };

  const handleDepartmentSelect = (departmentId: string) => {
    setSelectedDepartment(departmentId);
    setStep("area");
  };

  const handleAreaSelect = (areaId: string) => {
    setSelectedArea(areaId);
    // En lugar de navegar a una ruta dinámica compleja, vuelve al dashboard principal
    // con los contextos ya seleccionados
    router.push("/dashboard");
  };

  const resetSelections = () => {
    setSite(null);
    setSelectedDepartment(null);
    setSelectedArea(null);
    setStep("site");
  };

  const getSiteName = (id: string) => MOCK_SITES.find((site) => site.id === id)?.name || id;
  const getDepartmentName = (id: string) => MOCK_DEPARTMENTS.find((dept) => dept.id === id)?.name || id;
  const getAreaName = (id: string) => MOCK_AREAS.find((area) => area.id === id)?.name || id;

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      {/* Selection Breadcrumbs */}
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink onClick={resetSelections} className={selectedSite ? "cursor-pointer" : "font-bold"}>
              Sitio
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              onClick={() => selectedSite && setStep("department")}
              className={!selectedSite ? "text-muted-foreground" : selectedDepartment ? "cursor-pointer" : "font-bold"}>
              Departamento
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              className={
                !selectedDepartment ? "text-muted-foreground" : !selectedArea ? "font-bold" : "cursor-pointer"
              }>
              Área
            </BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-center">
            {step === "site" && "Selecciona un Sitio"}
            {step === "department" && "Selecciona un Departamento"}
            {step === "area" && "Selecciona un Área"}
          </CardTitle>
          <CardDescription className="text-center">
            {step === "site" && "Elige el sitio con el que deseas trabajar"}
            {step === "department" && `Sitio seleccionado: ${selectedSite ? getSiteName(selectedSite) : ""}`}
            {step === "area" &&
              `Departamento seleccionado: ${selectedDepartment ? getDepartmentName(selectedDepartment) : ""}`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === "site" && (
            <div className="grid grid-cols-1 gap-3">
              {MOCK_SITES.map((site) => (
                <Button
                  key={site.id}
                  variant="outline"
                  className="h-12 justify-start text-left"
                  onClick={() => handleSiteSelect(site.id)}>
                  {site.name}
                </Button>
              ))}
            </div>
          )}

          {step === "department" && (
            <div className="grid grid-cols-1 gap-3">
              {MOCK_DEPARTMENTS.map((dept) => (
                <Button
                  key={dept.id}
                  variant="outline"
                  className="h-12 justify-start text-left"
                  onClick={() => handleDepartmentSelect(dept.id)}>
                  {dept.name}
                </Button>
              ))}
            </div>
          )}

          {step === "area" && (
            <div className="grid grid-cols-1 gap-3">
              {MOCK_AREAS.map((area) => (
                <Button
                  key={area.id}
                  variant="outline"
                  className="h-12 justify-start text-left"
                  onClick={() => handleAreaSelect(area.id)}>
                  {area.name}
                </Button>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          {(step === "department" || step === "area") && (
            <Button
              variant="ghost"
              onClick={() => {
                if (step === "department") {
                  setSite(null);
                } else if (step === "area") {
                  setSelectedDepartment(null);
                }
              }}>
              Atrás
            </Button>
          )}
          <div></div>
        </CardFooter>
      </Card>
    </div>
  );
}
