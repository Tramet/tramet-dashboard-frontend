"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, MoreHorizontal, RefreshCw } from "lucide-react";

import { Button } from "@trm/_components/ui/button";
import { Checkbox } from "@trm/_components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@trm/_components/ui/dropdown-menu";
import { Input } from "@trm/_components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@trm/_components/ui/table";
import { CreateUserDialog } from "@trm/_components/create-user-dialog";
import { toast } from "sonner";
import UserPermissionsDialog from "./user-permissions-dialog";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { getAllUsers, deleteUser, updateUserPermissions } from "@trm/_api/admin/users";
import { Combobox } from "@trm/_layout/combobox/combobox";
import { useMediaQuery } from "@trm/_hooks/use-media-query";

// Modelo de usuario que incluye permisos pero sigue funcionando con la API simplificada
export type User = {
  id: string;
  user: string;
  password: string;
  // Campos opcionales para mantener compatibilidad
  status?: "active" | "inactive";
  fullName?: string;
  position?: string;
  permissions?: {
    sites: string[];
    departments: string[];
    areas: string[];
    modules: string[];
    screens: string[];
  };
};

// Datos predeterminados para los permisos cuando no están en la API
const defaultPermissions = {
  sites: [],
  departments: [],
  areas: [],
  modules: [],
  screens: [],
};

// Lista plana de todos los permisos posibles siguiendo la estructura jerárquica
const totalPermissions = {
  // Sitios
  sites: ["site1", "site2"],
  
  // Departamentos (con prefijo que indica a qué sitio pertenecen)
  departments: [
    "site1_dept1", "site1_dept2", "site1_dept3", 
    "site2_dept1", "site2_dept2"
  ],
  
  // Áreas (con prefijo que indica a qué departamento pertenecen)
  areas: [
    "site1_dept1_area1", "site1_dept1_area2", "site1_dept1_area3",
    "site1_dept2_area1", "site1_dept2_area2",
    "site1_dept3_area1",
    "site2_dept1_area1", "site2_dept1_area2",
    "site2_dept2_area1"
  ],
  
  // Módulos funcionales
  modules: ["dashboard", "operations", "management", "reports", "configuration"],
  
  // Pantallas (con prefijo que indica a qué módulo pertenecen)
  screens: [
    "dashboard_main", "dashboard_analytics",
    "operations_list", "operations_details",
    "management_users", "management_roles",
    "reports_daily", "reports_weekly", "reports_monthly",
    "configuration_system", "configuration_preferences"
  ],
};

const siteMetadata = {
  site1: {
    name: "Sitio Principal",
    departments: {
      site1_dept1: {
        name: "Departamento 1",
        areas: {
          site1_dept1_area1: { name: "Área 1" },
          site1_dept1_area2: { name: "Área 2" },
          site1_dept1_area3: { name: "Área 3" },
        },
      },
      site1_dept2: {
        name: "Departamento 2",
        areas: {
          site1_dept2_area1: { name: "Área 1" },
          site1_dept2_area2: { name: "Área 2" },
        },
      },
      site1_dept3: {
        name: "Departamento 3",
        areas: {
          site1_dept3_area1: { name: "Área 1" },
        },
      },
    },
  },
  site2: {
    name: "Sitio Secundario",
    departments: {
      site2_dept1: {
        name: "Departamento 1",
        areas: {
          site2_dept1_area1: { name: "Área 1" },
          site2_dept1_area2: { name: "Área 2" },
        },
      },
      site2_dept2: {
        name: "Departamento 2",
        areas: {
          site2_dept2_area1: { name: "Área 1" },
        },
      },
    },
  },
};

const generateSortableColumnHeader = (column: any, label: string) => {
  return (
    <Button variant="ghost" className="flex justify-start items-center text-start px-2 py-1" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {label}
      <span className="ml-2">
        {column.getIsSorted() === "asc" ? <ArrowUp className="size-4" /> : column.getIsSorted() === "desc" ? <ArrowDown className="size-4" /> : <ArrowUpDown className="size-4" />}
      </span>
    </Button>
  );
};

// Datos falsos para desarrollo
const mockUsers: User[] = [
  {
    id: "1",
    user: "admin",
    password: "admin123",
    status: "active",
    fullName: "Administrador Principal",
    position: "Gerente de Sistemas",
    permissions: {
      sites: ["site1", "site2"],
      departments: ["site1_dept1", "site2_dept1"],
      areas: ["site1_dept1_area1", "site2_dept1_area1"],
      modules: ["dashboard", "operations", "management", "reports", "configuration"],
      screens: ["dashboard_main", "operations_list", "management_users", "reports_daily", "configuration_system"]
    }
  },
  {
    id: "2",
    user: "supervisor",
    password: "super123",
    status: "active",
    fullName: "Supervisor de Planta",
    position: "Supervisor",
    permissions: {
      sites: ["site1"],
      departments: ["site1_dept2"],
      areas: ["site1_dept2_area1"],
      modules: ["dashboard", "operations"],
      screens: ["dashboard_main", "operations_list"]
    }
  },
  {
    id: "3",
    user: "operador",
    password: "oper123",
    status: "active",
    fullName: "Operador de Línea",
    position: "Operador",
    permissions: {
      sites: ["site1"],
      departments: ["site1_dept3"],
      areas: ["site1_dept3_area1"],
      modules: ["dashboard"],
      screens: ["dashboard_main"]
    }
  },
  {
    id: "4",
    user: "analista",
    password: "anal123",
    status: "active",
    fullName: "Analista de Datos",
    position: "Analista",
    permissions: {
      sites: ["site2"],
      departments: ["site2_dept2"],
      areas: ["site2_dept2_area1"],
      modules: ["reports", "dashboard"],
      screens: ["dashboard_analytics", "reports_daily", "reports_weekly"]
    }
  },
  {
    id: "5",
    user: "tecnico",
    password: "tec123",
    status: "inactive",
    fullName: "Técnico de Mantenimiento",
    position: "Técnico",
    permissions: {
      sites: ["site1", "site2"],
      departments: ["site1_dept1", "site2_dept1"],
      areas: ["site1_dept1_area2", "site2_dept1_area2"],
      modules: ["operations"],
      screens: ["operations_details"]
    }
  }
];

export function AdminUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  // Estado para el filtro de posición
  const [positionFilter, setPositionFilter] = useState<string>("");
  // Obtener el token de autenticación
  const { token, isAuthenticated } = useAuth();
  // Verificar si está en modo desktop
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Definición de columnas para nuestra tabla
  const columns: ColumnDef<User>[] = [
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
                fetchUsers(); // Recargar la lista para mostrar los cambios
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
                  navigator.clipboard.writeText(user.password);
                  toast.success("Contraseña copiada al portapapeles");
                }}
              >
                Copiar Contraseña
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={() => handleDeleteUser(user.id)}
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

  // Función para cargar los usuarios desde el backend
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // Usar datos falsos para desarrollo
      setTimeout(() => {
        setUsers(mockUsers);
        setIsLoading(false);
      }, 500); // Simular tiempo de carga
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error(error instanceof Error ? error.message : "Error al cargar los usuarios");
      setIsLoading(false);
    }
  };

  // Función para eliminar un usuario
  const handleDeleteUser = async (userId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
      return;
    }
    
    try {
      // Eliminar usuario de los datos falsos
      setUsers(prev => prev.filter(user => user.id !== userId));
      
      toast.success("Usuario eliminado con éxito");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
      toast.error(error instanceof Error ? error.message : "Error al eliminar el usuario");
    }
  };

  // Obtener todas las posiciones únicas para el filtro
  const availablePositions = React.useMemo(() => {
    const positions = users.map(user => user.position || "No asignado");
    return Array.from(new Set(positions)).sort();
  }, [users]);

  // Convertir posiciones a formato esperado por el Combobox
  const positionOptions = React.useMemo(() => {
    return availablePositions.map((position, index) => ({
      id: index,
      value: position,
      label: position
    }));
  }, [availablePositions]);

  // Filtrar usuarios por posición antes de pasarlos a la tabla
  const filteredUsers = React.useMemo(() => {
    if (!positionFilter) return users;
    return users.filter(user => (user.position || "No asignado") === positionFilter);
  }, [users, positionFilter]);

  // Manejar cambios en el filtro de posición
  const handlePositionFilterChange = (value: string | null) => {
    setPositionFilter(value || "");
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
    
    // Escuchar el evento de actualización de la tabla
    const handleRefresh = () => fetchUsers();
    window.addEventListener("refreshUsersTable", handleRefresh);
    
    // Limpiar evento al desmontar
    return () => {
      window.removeEventListener("refreshUsersTable", handleRefresh);
    };
  }, []);

  const table = useReactTable({
    data: filteredUsers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      {/* Controles responsivos con diseño que se adapta a móviles */}
      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-4 py-4">
        <div className="flex flex-col sm:flex-row gap-2 w-full md:max-w-lg">
          <Input
            placeholder="Filtrar por Usuario..."
            value={(table.getColumn("user")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("user")?.setFilterValue(event.target.value)}
            className="w-full"
          />
          
          {/* Filtro de posición usando Combobox */}
          <Combobox
            name="Puestos"
            comboboxList={positionOptions}
            onChange={handlePositionFilterChange}
            isDesktop={isDesktop}
          />
        </div>

        <div className="flex flex-wrap justify-end items-center gap-2">
          <Button 
            variant="outline" 
            onClick={fetchUsers} 
            disabled={isLoading}
            className="flex items-center gap-1 text-xs sm:text-sm"
            size="sm"
          >
            <RefreshCw className={`h-3 w-3 sm:h-4 sm:w-4 ${isLoading ? "animate-spin" : ""}`} />
            <span className="sm:inline">Actualizar</span>
          </Button>
          
          <CreateUserDialog />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs sm:text-sm">
                <span className="sm:inline">Columnas</span>
                <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 ml-0 sm:ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  // Crear un mapa de nombres legibles para las columnas
                  const columnLabels: Record<string, string> = {
                    id: "ID",
                    user: "Usuario",
                    position: "Puesto",
                    permissions: "Permisos",
                    actions: "Acciones"
                  };
                  
                  return (
                    <DropdownMenuCheckboxItem 
                      key={column.id} 
                      className="capitalize" 
                      checked={column.getIsVisible()} 
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {columnLabels[column.id] || column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Cargando usuarios...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow className="text-sidebar-foreground" key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No hay usuarios para mostrar.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button 
            variant="outline" 
            onClick={() => table.previousPage()} 
            disabled={!table.getCanPreviousPage()}
            size="sm"
          >
            Previo
          </Button>
          <Button 
            variant="outline" 
            onClick={() => table.nextPage()} 
            disabled={!table.getCanNextPage()}
            size="sm"
          >
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
