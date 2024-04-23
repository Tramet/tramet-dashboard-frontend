"use client";

import React, { useEffect } from "react";
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
import { BsShieldLock } from "react-icons/bs";

type UserPermissionsDialogProps = {
  id: string;
  name: string;
  permissions: {
    sites: string[];
    departments: string[];
    areas: string[];
    modules: string[];
    screens: string[];
  };
  totalPermissions: string[];
};

type UserPermissions = {
  sites: string[];
  departments: string[];
  areas: string[];
  modules: string[];
  screens: string[];
};

const UserPermissionsDialog: React.FC<UserPermissionsDialogProps> = ({
  id,
  name,
  permissions,
  totalPermissions,
}) => {
  const [tempPermissions, setTempPermissions] = React.useState(permissions);

  const permissionsTitles = {
    sites: "Sitios",
    departments: "Departamentos",
    areas: "Áreas",
    modules: "Módulos",
    screens: "Pantallas",
  };

  const handleCheckboxChange = (
    type: keyof UserPermissions,
    item: string,
    checked: boolean
  ) => {
    setTempPermissions((prevPermissions) => ({
      ...prevPermissions,
      [type]: checked
        ? [...prevPermissions[type], item]
        : prevPermissions[type].filter((perm: string) => perm !== item),
    }));
  };

  const handleSaveChanges = () => {
    const newPermissions = {
      id: id,
      ...tempPermissions,
    };
    console.log("Nuevos permisos:", newPermissions);
    // Aquí puedes realizar la lógica para guardar los cambios en la base de datos
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <BsShieldLock className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Editar permisos</DialogTitle>
          <DialogDescription className="text-sidebar-foreground">
            Permisos para el usuario: <strong>{name}</strong> con ID:{" "}
            <strong>{id}</strong>
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="flex flex-col overflow-y-auto max-h-[450px]">
          {Object.entries(totalPermissions).map(([type, items]) => (
            <section key={type} className="flex flex-col gap-y-3 mb-4 ">
              <h3 className="text-lg">
                {permissionsTitles[type as keyof typeof permissionsTitles]}
              </h3>
              <div className="flex justify-start text-sidebar-foreground items-start gap-2 flex-wrap">
                {items.map((item: string) => (
                  <div
                    key={
                      // gen random uuid
                      Math.random().toString(36).substr(2, 9)
                    }
                    className="flex items-center space-x-1">
                    <Checkbox
                      id={item}
                      className="flex justify-center items-center"
                      checked={tempPermissions[
                        type as keyof UserPermissions
                      ]?.includes(item)}
                      onCheckedChange={(checked: boolean) =>
                        handleCheckboxChange(
                          type as keyof UserPermissions,
                          item,
                          checked
                        )
                      }
                    />
                    <label
                      htmlFor={item}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {item}
                    </label>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
        <Separator />
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
