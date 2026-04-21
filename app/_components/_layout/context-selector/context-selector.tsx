"use client";

import * as React from "react";
import { ChevronRight, Home, Building2, LayoutGrid, Check, ChevronsUpDown } from "lucide-react";
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
import { COMBOBOX_LISTS } from "../combobox/comboboxLists";
import { AREAS_LIST } from "../carousel-areas/areas-list";

export function ContextSelector() {
  const { 
    selectedSite, setSite, 
    selectedDepartment, setDepartment, 
    selectedArea, setArea 
  } = useContextStore();

  const [openSite, setOpenSite] = React.useState(false);
  const [openDept, setOpenDept] = React.useState(false);
  const [openArea, setOpenArea] = React.useState(false);

  // Helper to find labels
  const siteLabel = COMBOBOX_LISTS.sites.find(s => s.value === selectedSite)?.label || "Sitio";
  const deptLabel = COMBOBOX_LISTS.departments.find(d => d.value === selectedDepartment)?.label || "Depto";
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
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar sitio..." />
            <CommandList>
              <CommandEmpty>No se encontró sitio.</CommandEmpty>
              <CommandGroup>
                {COMBOBOX_LISTS.sites.map((site) => (
                  <CommandItem
                    key={site.id}
                    onSelect={() => {
                      setSite(site.value);
                      setOpenSite(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedSite === site.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {site.label}
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
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">{deptLabel}</span>
            <ChevronsUpDown className="h-3 w-3 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar departamento..." />
            <CommandList>
              <CommandEmpty>No se encontró departamento.</CommandEmpty>
              <CommandGroup>
                {COMBOBOX_LISTS.departments.map((dept) => (
                  <CommandItem
                    key={dept.id}
                    onSelect={() => {
                      setDepartment(dept.value);
                      setOpenDept(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedDepartment === dept.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {dept.label}
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
        <PopoverContent className="w-[200px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Buscar área..." />
            <CommandList>
              <CommandEmpty>No se encontró área.</CommandEmpty>
              <CommandGroup>
                {AREAS_LIST.map((area) => (
                  <CommandItem
                    key={area.id}
                    onSelect={() => {
                      setArea(area.path);
                      setOpenArea(false);
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
