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
import { BsShieldLock, BsBuilding, BsWindowStack, BsCardList, BsGrid1X2, BsDisplay, BsArrowRight } from "react-icons/bs";

import {
  PermissionTree,
  UserPermissionsDialogProps,
  UserPermissions,
  mockData,
  buildPermissionTree,
  getSafePermissions,
  getSafeUserPermissions,
} from "../permissions";

const UserPermissionsDialog: React.FC<UserPermissionsDialogProps> = ({
  id,
  name,
  permissions,
  totalPermissions,
  siteMetadata,
  onPermissionsChange = () => {},
  onClose = () => {},
}) => {
  // Usar datos del usuario real en lugar de datos mock
  const useMockData = false;

  // Usar datos mock o reales según configuración
  const effectiveSiteMetadata = useMockData ? mockData.siteMetadata : siteMetadata || {};
  const effectiveTotalPermissions = useMockData ? mockData.totalPermissions : totalPermissions || {};
  
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPermissions, setSelectedPermissions] = useState<UserPermissions>(
    getSafeUserPermissions(permissions)
  );

  // Construir árbol de permisos para visualización
  const permissionTree = useMemo(() => buildPermissionTree(
    effectiveSiteMetadata,
    effectiveTotalPermissions
  ), [effectiveSiteMetadata, effectiveTotalPermissions]);

  const handlePermissionChange = (permissions: UserPermissions) => {
    // Actualizar permisos seleccionados
    setSelectedPermissions(permissions);
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose();
  };

  const handleSave = () => {
    // Llamar a la función para guardar cambios
    onPermissionsChange(selectedPermissions);
    handleClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className="h-8 w-8 p-0 text-blue-500 hover:text-orange-500"
          title="Editar permisos"
        >
          <BsShieldLock className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[90%] md:max-w-[80%] lg:max-w-[70%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Permisos para:  <span className="text-blue-500 font-bold">{name}</span>
          </DialogTitle>
          <div className="text-xs sm:text-sm mt-2">
            <p className="mb-1">Asigna los permisos que el usuario tendra siguiendo esta jerarquía:</p>
            <div className="flex flex-col gap-1 mt-2">
              <div className="flex items-center">
                <BsWindowStack className="mr-2 text-blue-500" />
                <span className="text-blue-500 font-medium">Sitios</span>
                <BsArrowRight className="mx-2 text-muted-foreground" />
                <BsBuilding className="mr-2 text-green-500" />
                <span className="text-green-500 font-medium">Departamentos</span>
                <BsArrowRight className="mx-2 text-muted-foreground" />
                <BsCardList className="mr-2 text-amber-500" />
                <span className="text-amber-500 font-medium">Áreas</span>
                <BsArrowRight className="mx-2 text-muted-foreground" />
                <BsGrid1X2 className="mr-2 text-purple-500" />
                <span className="text-purple-500 font-medium">Módulos</span>
                <BsArrowRight className="mx-2 text-muted-foreground" />
                <BsDisplay className="mr-2 text-red-500" />
                <span className="text-red-500 font-medium">Pantallas</span>
              </div>
            </div>
          </div>
        </DialogHeader>
        
        <Separator className="my-2" />
        
        <div className="max-h-[50vh] md:max-h-[60vh] overflow-y-auto p-1">
          <PermissionTree
            permissionTree={permissionTree}
            tempPermissions={selectedPermissions}
            onPermissionsChange={handlePermissionChange}
          />
        </div>
        
        <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
          <DialogClose asChild>
            <Button 
              variant="outline" 
              onClick={handleClose}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancelar
            </Button>
          </DialogClose>
          <Button 
            onClick={handleSave}
            className="w-full sm:w-auto order-1 sm:order-2"
            style={{ backgroundColor: 'hsl(23, 95%, 55%)' }} // Color naranja corporativo
          >
            Guardar cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserPermissionsDialog;
