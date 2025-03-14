"use client";

import React, { useState, useMemo } from "react";
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
import { DialogClose } from "@radix-ui/react-dialog";
import { Separator } from "@trm/_components/ui/separator";
import { BsShieldLock } from "react-icons/bs";

import {
  PermissionTree,
  UserPermissionsDialogProps,
  UserPermissions,
  mockData,
  buildPermissionTree,
  getSafePermissions,
  getSafeUserPermissions,
} from "./permissions";

const UserPermissionsDialog: React.FC<UserPermissionsDialogProps> = ({
  id,
  name,
  permissions,
  totalPermissions,
  siteMetadata,
  onPermissionsChange = () => {},
  onClose = () => {},
}) => {
  // Usar siempre los datos mock para este componente (en un caso real, esto podría ser configurable)
  const useMockData = true;

  // Usar datos mock o reales según configuración
  const effectiveSiteMetadata = useMockData ? mockData.siteMetadata : siteMetadata || {};
  const effectiveTotalPermissions = useMockData ? mockData.totalPermissions : totalPermissions;

  // Asegurar que totalPermissions tenga una estructura válida
  const safePermissions = getSafePermissions(effectiveTotalPermissions);

  // Estado temporal para los permisos editados
  const [tempPermissions, setTempPermissions] = useState<UserPermissions>(
    useMockData ? mockData.permissions : getSafeUserPermissions(permissions)
  );

  // Memoizar el árbol de permisos para evitar recalculos innecesarios
  const permissionTree = useMemo(
    () => buildPermissionTree(effectiveSiteMetadata, safePermissions),
    [effectiveSiteMetadata, safePermissions]
  );

  // Método para actualizar los permisos del usuario
  const handlePermissionsChange = (newPermissions: UserPermissions) => {
    setTempPermissions(newPermissions);
  };

  // Guardar cambios
  const handleSaveChanges = () => {
    const fullPermissions = {
      id: id,
      ...tempPermissions,
    };
    onPermissionsChange(fullPermissions);
    onClose();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <BsShieldLock className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar permisos</DialogTitle>
          <DialogDescription className="text-sidebar-foreground">
            Permisos para el usuario: <strong>{name}</strong> con ID: <strong>{id}</strong>
            {useMockData && <span className="ml-2 text-xs text-amber-500">(Usando datos simulados)</span>}
          </DialogDescription>
        </DialogHeader>
        <Separator />

        <div>
          <div className="text-sm text-muted-foreground mb-2">
            Selecciona un <span className="font-medium text-blue-500">sitio</span>, luego un{" "}
            <span className="font-medium text-green-500">departamento</span>, después un{" "}
            <span className="font-medium text-amber-500">área</span>, y finalmente los{" "}
            <span className="font-medium text-purple-500">módulos</span> y{" "}
            <span className="font-medium text-red-500">pantallas</span> a los que este usuario tendrá acceso.
          </div>

          {/* Leyenda de colores */}
          <div className="bg-muted/30 rounded p-2 mb-2 flex flex-wrap gap-3 text-xs">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-1"></div>
              <span>Sitios</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-1"></div>
              <span>Departamentos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 mr-1"></div>
              <span>Áreas</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-1"></div>
              <span>Módulos</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-1"></div>
              <span>Pantallas</span>
            </div>
          </div>

          {/* Árbol de permisos */}
          <PermissionTree
            permissionTree={permissionTree}
            tempPermissions={tempPermissions}
            onPermissionsChange={handlePermissionsChange}
          />
        </div>

        <Separator />
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" onClick={onClose}>
              Cancelar
            </Button>
          </DialogClose>
          <Button onClick={handleSaveChanges} type="submit">
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
