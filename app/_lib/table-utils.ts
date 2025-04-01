import { ColumnDef } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { Button } from "@trm/_components/ui/button";
import React from "react";

/**
 * Genera un encabezado de columna ordenable para tablas
 * 
 * @param column Columna a la que aplicar la ordenación
 * @param label Texto a mostrar en el encabezado
 * @returns Componente JSX para el encabezado de columna
 */
export const generateSortableColumnHeader = (column: any, label: string) => {
  return React.createElement(
    Button,
    { 
      variant: "ghost", 
      className: "flex justify-start items-center text-start px-2 py-1",
      onClick: () => column.toggleSorting(column.getIsSorted() === "asc")
    },
    label,
    React.createElement(
      "span",
      { className: "ml-2" },
      column.getIsSorted() === "asc" 
        ? React.createElement(ArrowUp, { className: "size-4" })
        : column.getIsSorted() === "desc" 
          ? React.createElement(ArrowDown, { className: "size-4" })
          : React.createElement(ArrowUpDown, { className: "size-4" })
    )
  );
};
