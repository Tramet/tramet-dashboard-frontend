"use client";

import React from "react";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { User, defaultPermissions } from "@trm/_types/user";
import { updateUserPermissions } from "@trm/_api/admin/users";
import { toast } from "sonner";
import { generateSortableColumnHeader } from "@trm/_lib/table-utils";
import UserPermissionsDialog from "@trm/_components/users/user-permissions-dialog";
import { totalPermissions, siteMetadata } from "@trm/_data/permissions.metadata";
import { Button } from "@trm/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@trm/_components/ui/dropdown-menu";

type UsersTableColumnsProps = {
  isAuthenticated: boolean;
  token: string | null;
  onDeleteUser: (userId: string) => void;
  onRefresh: () => void;
};

/**
 * Definición de columnas para la tabla de usuarios
 * Separado para mejor mantenibilidad y cumplir con el principio de responsabilidad única
 */
export const getUsersTableColumns = ({
  isAuthenticated,
  token,
  onDeleteUser,
  onRefresh,
}: UsersTableColumnsProps): ColumnDef<User>[] => {
  return [
    {
      accessorKey: "id",
      header: ({ column }) => {
        return generateSortableColumnHeader(column, "ID");
      },
      cell: ({ row }) => <span className="font-mono text-xs">{row.original.id}</span>,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "user",
      header: ({ column }) => {
        return generateSortableColumnHeader(column, "Usuario");
      },
      cell: ({ row }) => row.original.user,
      enableSorting: true,
      enableHiding: true,
    },
    {
      accessorKey: "position",
      header: ({ column }) => {
        return generateSortableColumnHeader(column, "Puesto");
      },
      cell: ({ row }) => row.original.position || "No asignado",
      enableSorting: true,
      enableHiding: true,
    },
    {
      id: "permissions",
      header: "Permisos",
      cell: ({ row }) => (
        <div className="flex justify-start items-center">
          <UserPermissionsDialog 
            id={row.original.id} 
            name={row.original.user} 
            permissions={row.original.permissions || defaultPermissions} 
            totalPermissions={totalPermissions}
            siteMetadata={siteMetadata}
            onPermissionsChange={async (updatedPermissions) => {
              try {
                if (!token || !isAuthenticated) {
                  throw new Error("No hay un token de autenticación válido");
                }
                
                await updateUserPermissions(token, row.original.id, updatedPermissions);
                toast.success("Permisos actualizados correctamente");
                onRefresh(); // Recargar la lista para mostrar los cambios
              } catch (error) {
                console.error("Error al actualizar permisos:", error);
                toast.error(error instanceof Error ? error.message : "Error al actualizar los permisos");
              }
            }}
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: true,
    },
    {
      accessorKey: "actions",
      header: "Acciones",
      enableHiding: true,
      cell: ({ row }) => {
        const user = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Acciones</DropdownMenuLabel>
              <DropdownMenuItem 
                onClick={() => {
                  navigator.clipboard.writeText(user.id);
                  toast.success("ID copiado al portapapeles");
                }}
              >
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => {
                  navigator.clipboard.writeText(user.user);
                  toast.success("Usuario copiado al portapapeles");
                }}
              >
                Copiar Usuario
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => onDeleteUser(user.id)}
                className="text-destructive"
              >
                Eliminar Usuario
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
};
