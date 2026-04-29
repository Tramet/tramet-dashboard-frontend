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
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, MoreHorizontal, RefreshCw, Trash2, AlertCircle } from "lucide-react";

import { Button } from "@trm/_components/ui/button";
import { Checkbox } from "@trm/_components/ui/checkbox";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger, DialogFooter } from "@trm/_components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@trm/_components/ui/dropdown-menu";
import { Input } from "@trm/_components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@trm/_components/ui/table";
import { CreateUserDialog } from "@trm/_components/create-user-dialog";
import toast from "react-hot-toast";
import UserPermissionsDialog from "./users/user-permissions-dialog";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { getAllUsers, deleteUser, updateUserPermissions } from "@trm/_api/admin/users";
import { Combobox } from "@trm/_components/_layout/combobox/combobox";
import { useMediaQuery } from "@trm/_hooks/use-media-query";

// Modelo de usuario que incluye permisos pero sigue funcionando con la API simplificada
export type User = {
  id: string;
  user: string;
  position?: string;
  customerName?: string;
  permissions?: {
    sites: string[];
    departments: string[];
    areas: string[];
    modules: string[];
    screens: string[];
  };
};

// Interfaz para la estructura de usuario que viene de la API
export interface ApiUser {
  id: number;
  username: string;
  settings: {
    id: number;
    language: string;
    theme: string;
    notifications: boolean;
  };
  role: {
    id: number;
    name: string;
  };
  userauthorities: Array<{
    id: number;
    authority: {
      id: number;
      name: string;
    };
  }>;
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  authorities: Array<{
    authority: string;
  }>;
  enabled: boolean;
}

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
  departments: ["site1_dept1", "site1_dept2", "site1_dept3", "site2_dept1", "site2_dept2"],
  // Áreas (con prefijo que indica a qué departamento pertenecen)
  areas: [
    "site1_dept1_area1",
    "site1_dept1_area2",
    "site1_dept1_area3",
    "site1_dept2_area1",
    "site1_dept2_area2",
    "site1_dept3_area1",
    "site2_dept1_area1",
    "site2_dept1_area2",
    "site2_dept2_area1",
  ],
  // Módulos funcionales
  modules: ["dashboard", "operations", "management", "reports", "configuration"],
  // Pantallas (con prefijo que indica a qué módulo pertenecen)
  screens: [
    "dashboard_main",
    "dashboard_analytics",
    "operations_list",
    "operations_details",
    "management_users",
    "management_roles",
    "reports_daily",
    "reports_weekly",
    "reports_monthly",
    "configuration_system",
    "configuration_preferences",
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
    position: "Gerente de Sistemas",
    permissions: {
      sites: ["site1", "site2"],
      departments: ["site1_dept1", "site2_dept1"],
      areas: ["site1_dept1_area1", "site2_dept1_area1"],
      modules: ["dashboard", "operations", "management", "reports", "configuration"],
      screens: ["dashboard_main", "operations_list", "management_users", "reports_daily", "configuration_system"],
    },
  },
  {
    id: "2",
    user: "supervisor",
    position: "Supervisor",
    permissions: {
      sites: ["site1"],
      departments: ["site1_dept2"],
      areas: ["site1_dept2_area1"],
      modules: ["dashboard", "operations"],
      screens: ["dashboard_main", "operations_list"],
    },
  },
  {
    id: "3",
    user: "operador",
    position: "Operador",
    permissions: {
      sites: ["site1"],
      departments: ["site1_dept3"],
      areas: ["site1_dept3_area1"],
      modules: ["dashboard"],
      screens: ["dashboard_main"],
    },
  },
  {
    id: "4",
    user: "analista",
    position: "Analista",
    permissions: {
      sites: ["site2"],
      departments: ["site2_dept2"],
      areas: ["site2_dept2_area1"],
      modules: ["reports", "dashboard"],
      screens: ["dashboard_analytics", "reports_daily", "reports_weekly"],
    },
  },
  {
    id: "5",
    user: "tecnico",
    position: "Técnico",
    permissions: {
      sites: ["site1", "site2"],
      departments: ["site1_dept1", "site2_dept1"],
      areas: ["site1_dept1_area2", "site2_dept1_area2"],
      modules: ["operations"],
      screens: ["operations_details"],
    },
  },
];

export function AdminUsersTable() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  
  // Estados para filtros
  const [positionFilter, setPositionFilter] = useState<string>("");
  const [customerFilter, setCustomerFilter] = useState<string>("");
  
  // Estado para el diálogo de confirmación de eliminación
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; name: string } | null>(null);
  
  // Obtener estado de autenticación y rol
  const { isAuthenticated, userData: authUser } = useAuth();
  const isTrametAdmin = authUser?.role === "TRAMET_ADMIN";
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
      accessorKey: "customerName",
      header: ({ column }) => {
        return generateSortableColumnHeader(column, "Empresa");
      },
      cell: ({ row }) => (
        <span className={row.original.customerName === "Tramet" ? "text-primary font-semibold" : ""}>
          {row.original.customerName || "SaaS Global"}
        </span>
      ),
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
                if (!isAuthenticated) {
                  throw new Error("No estás autenticado");
                }

                await updateUserPermissions(row.original.id, updatedPermissions);
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
                }}>
                Copiar ID
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(user.user);
                  toast.success("Usuario copiado al portapapeles");
                }}>
                Copiar Usuario
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openDeleteConfirmation({ id: user.id, name: user.user })} className="text-destructive">
                <Trash2 className="h-4 w-4 mr-2" />
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
      if (!isAuthenticated) {
        setIsLoading(false);
        return null;
      }

      // Obtener usuarios reales mediante la API
      const apiUsers = await getAllUsers();
      
      // Mostrar los datos crudos de la API para debugging
      console.log("Datos crudos de usuarios desde la API:", apiUsers);

      // Mapear la estructura de la API a la estructura esperada por el frontend
      const usersWithMockedPermissions: User[] = apiUsers.map((apiUser) => {
        // Buscar si existe un usuario mockeado con el mismo nombre de usuario
        const mockedUser = mockUsers.find((mock) => mock.user === apiUser.username);

        return {
          id: apiUser.id.toString(),
          user: apiUser.username,
          position: apiUser.role.name,
          customerName: apiUser.username === "admin" ? "Tramet" : "Empresa Cliente", // Temporal hasta tener real mapping
          permissions: mockedUser?.permissions || defaultPermissions,
        };
      });

      setUsers(usersWithMockedPermissions);
      console.log("Usuarios cargados:", usersWithMockedPermissions);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
      toast.error(error instanceof Error ? error.message : "Error al cargar los usuarios");
    } finally {
      setIsLoading(false);
    }
  };

  // Función para abrir el diálogo de confirmación de eliminación
  const openDeleteConfirmation = (user: { id: string; name: string }) => {
    setUserToDelete(user);
    setShowDeleteDialog(true);
  };

  // Función para eliminar un usuario
  const handleDeleteUser = async (userId: string) => {
    if (!isAuthenticated) {
      toast.error("No estás autenticado para realizar esta acción");
      return null;
    }

    // Verificar que userId sea válido
    if (!userId) {
      toast.error("ID de usuario no válido");
      return null;
    }

    // Eliminar usuario mediante la API con toast promise
    await toast
      .promise(
        deleteUser(userId),
        {
          loading: "Eliminando usuario...",
          success: "Usuario eliminado con éxito",
          error: (err) => `Error: ${err instanceof Error ? err.message : "Error al eliminar el usuario"}`,
        },
        {
          style: {
            minWidth: "250px",
          },
          success: {
            duration: 5000,
            iconTheme: {
              primary: "hsl(23, 95%, 55%)",
              secondary: "white",
            },
          },
        }
      )
      .then(() => {
        // Actualizar la lista de usuarios sin esperar a que se actualice la lista completa
        setUsers((prev) => prev.filter((user) => user.id !== userId));

        // Refrescar la lista de usuarios después de un breve delay
        setTimeout(() => {
          fetchUsers();
        }, 1000);
      })
      .catch((error) => {
        // El error ya está gestionado por toast.promise
        console.error("Error al eliminar usuario:", error);
      });
  };

  // Obtener todas las posiciones únicas para el filtro
  const availablePositions = React.useMemo(() => {
    const positions = users.map((user) => user.position || "No asignado");
    return Array.from(new Set(positions)).sort();
  }, [users]);

  // Convertir posiciones a formato esperado por el Combobox
  const positionOptions = React.useMemo(() => {
    return availablePositions.map((position, index) => ({
      id: index,
      value: position,
      label: position,
    }));
  }, [availablePositions]);

  // Obtener todas las empresas únicas para el filtro
  const availableCustomers = React.useMemo(() => {
    const customers = users.map((user) => user.customerName || "SaaS Global");
    return Array.from(new Set(customers)).sort();
  }, [users]);

  const customerOptions = React.useMemo(() => {
    return availableCustomers.map((cust, index) => ({
      id: index,
      value: cust,
      label: cust,
    }));
  }, [availableCustomers]);

  // Filtrar usuarios por posición y empresa antes de pasarlos a la tabla
  const filteredUsers = React.useMemo(() => {
    return users.filter((user) => {
      const matchesPosition = !positionFilter || (user.position || "No asignado") === positionFilter;
      const matchesCustomer = !customerFilter || (user.customerName || "SaaS Global") === customerFilter;
      return matchesPosition && matchesCustomer;
    });
  }, [users, positionFilter, customerFilter]);

  // Manejar cambios en el filtro de posición
  const handlePositionFilterChange = (value: string | null) => {
    setPositionFilter(value || "");
  };

  const handleCustomerFilterChange = (value: string | null) => {
    setCustomerFilter(value || "");
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
    <div className="space-y-4">
      {/* Modal de confirmación para la eliminación de usuarios */}
      {showDeleteDialog && userToDelete && (
        <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogTitle className="flex items-center">
              <AlertCircle className="h-5 w-5 mr-2 text-destructive" />
              Confirmar eliminación
            </DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar al usuario <strong>{userToDelete.name}</strong>?
              <br />
              Esta acción no se puede deshacer y eliminará todos los datos asociados a este usuario.
            </DialogDescription>
            <DialogFooter className="sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => {
                  handleDeleteUser(userToDelete.id);
                  setShowDeleteDialog(false);
                }}
                style={{ backgroundColor: "hsl(0, 84%, 60%)" }}>
                Eliminar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Combobox name="Posición" comboboxList={positionOptions} onChange={handlePositionFilterChange} isDesktop={isDesktop} />
          {isTrametAdmin && (
            <Combobox name="Empresa" comboboxList={customerOptions} onChange={handleCustomerFilterChange} isDesktop={isDesktop} />
          )}
        </div>

        <div className="flex flex-wrap justify-end items-center gap-2">
          <Button variant="outline" onClick={fetchUsers} disabled={isLoading} className="flex items-center gap-1 text-xs sm:text-sm" size="sm">
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
                    customerName: "Empresa",
                    permissions: "Permisos",
                    actions: "Acciones",
                  };

                  return (
                    <DropdownMenuCheckboxItem key={column.id} className="capitalize" checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
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
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
          <Button variant="outline" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} size="sm">
            Previo
          </Button>
          <Button variant="outline" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} size="sm">
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
