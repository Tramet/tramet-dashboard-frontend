import React, { useState } from "react";
import { Button } from "@trm/_components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@trm/_components/ui/dialog";
import { MoreHorizontal } from "lucide-react";
import { DialogClose } from "@radix-ui/react-dialog";
import { Checkbox } from "@trm/_components/ui/checkbox";
import { Separator } from "@trm/_components/ui/separator";

export interface UserPermissions {
  id: string;
  name: string;
  permissions: {
    sites: string[];
    departments: string[];
    areas: string[];
    modules: string[];
    windows: string[];
  };
}

const UserPermissionsDialog = ({ id, name, permissions }: UserPermissions) => {
  const { sites, departments, areas, modules, windows } = permissions;

  const [selectedSites, setSelectedSites] = useState([...sites]);
  const [changedPermissions, setChangedPermissions] =
    useState<UserPermissions | null>(null);

  const handleCheckboxChange = (site: string) => {
    setSelectedSites((prevSelectedSites) => {
      if (prevSelectedSites.includes(site)) {
        // Si el sitio está seleccionado, se deselecciona
        return prevSelectedSites.filter((s) => s !== site);
      } else {
        // Si el sitio no está seleccionado, se selecciona
        return [...prevSelectedSites, site];
      }
    });
  };

  const handleSaveChanges = () => {
    // Crear un nuevo objeto de permisos con los sitios actualizados
    const updatedPermissions = {
      id,
      permissions: {
        ...permissions,
        sites: selectedSites,
      },
    };
    // Log de los nuevos datos antes de establecerlos como changedPermissions
    console.log("Nuevos permisos:", updatedPermissions);
    // Establecer los nuevos permisos cambiados
    setChangedPermissions(updatedPermissions);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar permisos</DialogTitle>
          <DialogDescription className="text-sidebar-foreground">
            Permisos para el usuario: <strong>{name}</strong> con ID:{" "}
            <strong>{id}</strong>
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col gap-y-3 mb-4">
          <h3 className="text-lg">Sitios</h3>
          <section
            id="sites"
            className="flex flex-col justify-center items-start gap-2">
            {permissions.sites.map((site) => (
              <div
                key={site}
                className="flex justify-start items-center space-x-1">
                <Checkbox
                  id={site}
                  className="flex justify-center items-center"
                  checked={selectedSites.includes(site)}
                  onCheckedChange={() => handleCheckboxChange(site)} // Llamar a handleCheckboxChange con el sitio actual
                />
                <label
                  htmlFor={site}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  {site}
                </label>
              </div>
            ))}
          </section>
        </div>
        <div>
          <h3>Departamentos</h3>
          {/* Render checkboxes for departments similar to sites */}
        </div>
        {/* Render areas, modules, and windows similarly */}
        <DialogFooter>
          <DialogClose asChild>
            <Button onClick={handleSaveChanges} type="submit">
              Guardar cambios
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
