"use client";

import * as React from "react";
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
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";

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
import UserPermissionsDialog from "./user-permissions-dialog";

export type User = {
  id: string;
  status: "active" | "inactive";
  user: string;
  fullName: string;
  position: string;
  permissions: {
    sites: string[];
    departments: string[];
    areas: string[];
    modules: string[];
    screens: string[];
  };
  options: string;
  credentials: {
    email: string;
    password: string;
  };
};

const data: User[] = [
  {
    id: "1",
    status: "active",
    user: "johnwalker",
    fullName: "John Walker",
    position: "Developer",
    permissions: {
      sites: ["site1", "site2"],
      departments: ["department1", "department2"],
      areas: ["area1", "area2"],
      modules: ["module1", "module2"],
      screens: ["screen1", "screen2", "screen3", "screen4"],
    },
    options: "options",
    credentials: {
      email: "",
      password: "",
    },
  },
  {
    id: "2",
    status: "active",
    user: "janedoe",
    fullName: "Jane Doe",
    position: "Designer",
    permissions: {
      sites: ["site3", "site4"],
      departments: ["department3", "department4"],
      areas: ["area3", "area4"],
      modules: ["module3", "module4"],
      screens: ["screen3", "screen4"],
    },
    options: "options",
    credentials: {
      email: "janedoe@example.com",
      password: "password123",
    },
  },
  {
    id: "3",
    status: "inactive",
    user: "bobsmith",
    fullName: "Bob Smith",
    position: "Manager",
    permissions: {
      sites: ["site5", "site6"],
      departments: ["department5", "department6"],
      areas: ["area5", "area6"],
      modules: ["module5", "module6"],
      screens: ["screen5", "screen6"],
    },
    options: "options",
    credentials: {
      email: "bobsmith@example.com",
      password: "password456",
    },
  },
  {
    id: "4",
    status: "active",
    user: "Anasmith",
    fullName: "Ana Smith",
    position: "IT Lead",
    permissions: {
      sites: ["site7", "site8"],
      departments: ["department7", "department8"],
      areas: ["area7", "area8"],
      modules: ["module7", "module8"],
      screens: ["screen7", "screen8"],
    },
    options: "options",
    credentials: {
      email: "",
      password: "",
    },
  },
];

const totalPermissions: {
  sites: string[];
  departments: string[];
  areas: string[];
  modules: string[];
  screens: string[];
} = {
  sites: ["site1", "site2", "site3", "site4", "site5", "site6", "site7", "site8"],
  departments: [
    "department1",
    "department2",
    "department3",
    "department4",
    "department5",
    "department6",
    "department7",
    "department8",
  ],
  areas: ["area1", "area2", "area3", "area4", "area5", "area6", "area7", "area8"],
  modules: ["module1", "module2", "module3", "module4", "module5", "module6", "module7", "module8"],
  screens: ["screen1", "screen2", "screen3", "screen4", "screen5", "screen6", "screen7", "screen8"],
};

const generateSortableColumnHeader = (column: any, label: string) => {
  return (
    <Button
      variant="ghost"
      className="flex justify-start items-center text-start px-2 py-1"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
      {label}
      <span className="ml-2">
        {column.getIsSorted() === "asc" ? (
          <ArrowUp className="size-4" />
        ) : column.getIsSorted() === "desc" ? (
          <ArrowDown className="size-4" />
        ) : (
          <ArrowUpDown className="size-4" />
        )}
      </span>
    </Button>
  );
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => {
      return generateSortableColumnHeader(column, "ID");
    },
    cell: ({ row }) => row.original.id,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return generateSortableColumnHeader(column, "Estado");
    },
    cell: ({ row }) => {
      return row.original.status;
    },
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "user",
    header: "Usuario",
    cell: ({ row }) => row.original.user,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "fullName",
    header: "Nombre",
    cell: ({ row }) => row.original.fullName,
    enableSorting: true,
    enableHiding: true,
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      return generateSortableColumnHeader(column, "Puesto");
    },
    cell: ({ row }) => row.original.position,
    enableSorting: true,
    enableHiding: true,
  },
  {
    id: "permissions",
    header: "Permisos",
    cell: ({ row }) => (
      <div className="flex justify-start items-center">
        {/* button to open a dialog and edit permissions */}
        <UserPermissionsDialog
          id={row.original.id}
          name={row.original.fullName}
          permissions={row.original.permissions}
          totalPermissions={totalPermissions}
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "options",
    header: "Opciones",
    cell: ({ row }) => row.original.options,
    enableSorting: false,
    enableHiding: true,
  },
  {
    accessorKey: "actions",
    header: "Acciones",
    enableHiding: false,
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
            <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.id)}>
              Copiar ID del usuario
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Editar Usuario</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function AdminUsersTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
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
      <div className="flex items-center py-4">
        <Input
          placeholder="Filtrar por Nombre..."
          value={(table.getColumn("fullName")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("fullName")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columna <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="text-sidebar-foreground"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sin resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-sidebar-foreground">
          {table.getFilteredSelectedRowModel().rows.length} de {table.getFilteredRowModel().rows.length} filas(s)
          seleccionadas.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Previo
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </div>
  );
}
