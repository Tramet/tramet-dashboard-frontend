"use client";

import * as React from "react";
import { ChevronRight, Building2, LayoutGrid, Check, ChevronsUpDown, Briefcase } from "lucide-react";
import { cn } from "@trm/_lib/utils";
import { Button } from "@trm/_components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@trm/_components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@trm/_components/ui/command";
import useContextStore from "@trm/_hooks/use-context-store";
import { getSites, getSitesByCustomer, Site } from "@trm/_api/sites";
import { getDepartments, Department } from "@trm/_api/departments";
import { getSubscriptionsByCustomer } from "@trm/_api/subscriptions";
import { AREAS_LIST } from "../carousel-areas/areas-list";
import { useRouter } from "next/navigation";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { toast } from "sonner";

export function ContextSelector() {
  const router = useRouter();
  const { userData } = useAuth();
  const { 
    selectedSite, siteName, setSite, 
    selectedDepartment, departmentName, setDepartment, 
    selectedArea, areaName, setArea,
    updateNames
  } = useContextStore();

  const [openSite, setOpenSite] = React.useState(false);
  const [openDept, setOpenDept] = React.useState(false);
  const [openArea, setOpenArea] = React.useState(false);

  // Datos cargados de la API
  const [sites, setSites] = React.useState<Site[]>([]);
  const [departments, setDepartments] = React.useState<Department[]>([]);
  const [isLoadingSites, setIsLoadingSites] = React.useState(false);
  const [isLoadingDepts, setIsLoadingDepts] = React.useState(false);

  // Cargar sitios y departamentos basados en el contexto del cliente
  React.useEffect(() => {
    const fetchContextData = async () => {
      setIsLoadingSites(true);
      setIsLoadingDepts(true);
      
      try {
        const customerId = userData?.customerId;
        const isTrametAdmin = userData?.role === "TRAMET_ADMIN";

        // 1. Cargar Sitios (Sucursales)
        let sitesData: Site[] = [];
        if (isTrametAdmin && !customerId) {
          sitesData = await getSites();
        } else if (customerId) {
          sitesData = await getSitesByCustomer(customerId);
        }
        setSites(sitesData);

        // 2. Cargar Departamentos contratados (Suscripciones)
        if (isTrametAdmin && !customerId) {
          const allDepts = await getDepartments();
          setDepartments(allDepts);
        } else if (customerId) {
          const subscriptions = await getSubscriptionsByCustomer(customerId);
          // Mapeamos las suscripciones a formato de Departamento
          const hiredDepts = subscriptions.map(sub => ({
            id: sub.department.id,
            name: sub.department.name
          }));
          setDepartments(hiredDepts);
        }
      } catch (error: any) {
        if (error.message === "FORBIDDEN") {
          console.warn("Acceso restringido. Cargando datos de respaldo para desarrollo.");
          // Datos de respaldo para que la UI no se vea vacía en desarrollo
          const MOCK_SITES: Site[] = [
            { id: 1, site: "Oficina Central (Dev)", city: "CDMX", state: "México", country: "México", customer: { id: 1, name: "TechSolutions" } as any },
            { id: 2, site: "Sucursal Norte (Dev)", city: "Monterrey", state: "NL", country: "México", customer: { id: 1, name: "TechSolutions" } as any }
          ];
          const MOCK_DEPTS = [
            { id: 1, name: "Financiero (Dev)" },
            { id: 3, name: "Recursos Humanos (Dev)" },
            { id: 4, name: "Marketing (Dev)" }
          ];
          setSites(MOCK_SITES);
          setDepartments(MOCK_DEPTS);
        } else {
          console.error("Error cargando datos de contexto:", error);
        }
      } finally {
        setIsLoadingSites(false);
        setIsLoadingDepts(false);
      }
    };

    if (userData) {
      fetchContextData();
    }
  }, [userData]);

  // Sincronizar nombres perdidos tras recargar la página (Hydration)
  React.useEffect(() => {
    let newSiteName: string | undefined = undefined;
    let newDeptName: string | undefined = undefined;
    let newAreaName: string | undefined = undefined;
    let shouldUpdate = false;

    if (selectedSite && !siteName && sites.length > 0) {
      const foundSite = sites.find(s => s.id.toString() === selectedSite);
      if (foundSite) {
        newSiteName = foundSite.site;
        shouldUpdate = true;
      }
    }

    if (selectedDepartment && !departmentName && departments.length > 0) {
      const foundDept = departments.find(d => d.id.toString() === selectedDepartment);
      if (foundDept) {
        newDeptName = foundDept.name;
        shouldUpdate = true;
      }
    }

    if (selectedArea && !areaName) {
      const foundArea = AREAS_LIST.find(a => a.path === selectedArea);
      if (foundArea) {
        newAreaName = foundArea.name;
        shouldUpdate = true;
      }
    }

    if (shouldUpdate) {
      updateNames(newSiteName, newDeptName, newAreaName);
    }
  }, [sites, departments, selectedSite, selectedDepartment, selectedArea, siteName, departmentName, areaName, updateNames]);



  // Labels para mostrar la selección actual
  const siteLabel = sites.find(s => s.id.toString() === selectedSite)?.site || "Sitio";
  const deptLabel = departments.find(d => d.id.toString() === selectedDepartment)?.name || "Depto";
  const areaLabel = AREAS_LIST.find(a => a.path === selectedArea)?.name || "Área";

  return (
    <nav className="flex items-center space-x-1 text-sm font-medium">
      {/* Selector de Sitio */}
      <Popover open={openSite} onOpenChange={setOpenSite}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "h-8 gap-2 px-2 hover:bg-accent/50",
              selectedSite && "text-primary font-bold"
            )}
          >
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">{siteLabel}</span>
            <ChevronsUpDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar sitio..." />
            <CommandList>
              <CommandEmpty>
                {isLoadingSites ? "Cargando..." : "No se encontró sitio."}
              </CommandEmpty>
              <CommandGroup>
                {sites.map((site) => (
                  <CommandItem
                    key={site.id}
                    onSelect={() => {
                      setSite(site.id.toString(), site.site);
                      setOpenSite(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSite === site.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <div className="flex flex-col">
                      <span>{site.site}</span>
                      <span className="text-xs text-muted-foreground">{site.city}, {site.state}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />

      {/* Selector de Departamento */}
      <Popover open={openDept} onOpenChange={setOpenDept}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={!selectedSite}
            className={cn(
              "h-8 gap-2 px-2 hover:bg-accent/50",
              selectedDepartment && "text-primary font-bold",
              !selectedSite && "opacity-50"
            )}
          >
            <Briefcase className="h-4 w-4" />
            <span className="hidden sm:inline">{deptLabel}</span>
            <ChevronsUpDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar departamento..." />
            <CommandList>
              <CommandEmpty>
                {isLoadingDepts ? "Cargando..." : "No se encontró departamento."}
              </CommandEmpty>
              <CommandGroup>
                {departments.map((dept) => (
                  <CommandItem
                    key={dept.id}
                    onSelect={() => {
                      setDepartment(dept.id.toString(), dept.name);
                      setOpenDept(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDepartment === dept.id.toString() ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {dept.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <ChevronRight className="h-4 w-4 text-muted-foreground/50" />

      {/* Selector de Área */}
      <Popover open={openArea} onOpenChange={setOpenArea}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            disabled={!selectedDepartment}
            className={cn(
              "h-8 gap-2 px-2 hover:bg-accent/50",
              selectedArea && "text-primary font-bold",
              !selectedDepartment && "opacity-50"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            <span className="hidden sm:inline">{areaLabel}</span>
            <ChevronsUpDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[220px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar área..." />
            <CommandList>
              <CommandEmpty>No se encontró área.</CommandEmpty>
              <CommandGroup>
                {AREAS_LIST.map((area) => (
                  <CommandItem
                    key={area.id}
                    onSelect={() => {
                      setArea(area.path, area.name);
                      setOpenArea(false);
                      // Navegar al dashboard solo al hacer una selección explícita
                      toast.success("Contexto actualizado", { id: "context-toast" });
                      router.push("/dashboard");
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedArea === area.path ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {area.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </nav>
  );
}
