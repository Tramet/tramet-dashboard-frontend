import React from "react";
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

type PermissionType = {
  id: string;
  name: string;
  permissions: {
    sites: string[];
    departments: string[];
    areas: string[];
    modules: string[];
    screens: string[];
    [key: string]: string[]; // Add index signature
  };
};

const totalPermissions = {
  sites: ["site1", "site2", "site3", "site4", "site5"],
  departments: [
    "department1",
    "department2",
    "department3",
    "department4",
    "department5",
  ],
  areas: ["area1", "area2", "area3", "area4", "area5"],
  modules: ["module1", "module2", "module3", "module4", "module5"],
  screens: ["screen1", "screen2", "screen3", "screen4", "screen5"],
};

const UserPermissionsDialog: React.FC<PermissionType> = ({
  id,
  name,
  permissions,
}) => {
  const [tempPermissions, setTempPermissions] = React.useState(permissions);

  const handleCheckboxChange = (
    type: string,
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
    console.log("Nuevos permisos:", tempPermissions);
    // Aquí puedes realizar la lógica para guardar los cambios en la base de datos
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
        {Object.entries(totalPermissions).map(([type, items]) => (
          <section key={type} className="flex flex-col gap-y-3 mb-4 ">
            <h3 className="text-lg">{type}</h3>
            <div className="flex justify-start text-sidebar-foreground items-start gap-2 flex-wrap">
              {items.map((item) => (
                <div key={item} className="flex items-center space-x-1">
                  <Checkbox
                    id={item}
                    className="flex justify-center items-center"
                    checked={tempPermissions[
                      type as keyof typeof tempPermissions
                    ].includes(item)}
                    onCheckedChange={(checked: boolean) =>
                      handleCheckboxChange(type, item, checked)
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
