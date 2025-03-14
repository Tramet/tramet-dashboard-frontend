"use client";

import { useSideBarToggle } from "@trm/_hooks/use-sidebar-toggle";
import { SideNavItem } from "@trm/_types/type";
import classNames from "classnames";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import useAreaSelection from "@trm/_hooks/use-area-selection";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import useSiteSelection from "@trm/_hooks/use-site-selection";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

export const SideBarMenuItem = ({ item }: { item: SideNavItem }) => {
  const { toggleCollapse } = useSideBarToggle();
  const pathname = usePathname();
  const { selectedArea, setSelectedArea } = useAreaSelection();
  const { selectedDepartment, setSelectedDepartment } = useDepartmentSelection();
  const { selectedSite, setSite } = useSiteSelection();
  const router = useRouter();
  const [submenuOpen, setSubmenuOpen] = useState(false);

  // Verificar si algún submenú está activo (para resaltar el padre)
  const isSubMenuActive = item.subMenuItems?.some((subItem) => pathname === subItem.path);

  // Manejar la acción de reseteo de contexto
  const handleResetContext = () => {
    // Resetear el contexto
    setSite(null);
    setSelectedDepartment(null);
    setSelectedArea(null);
    // Navegar al dashboard para mostrar el flujo de selección
    router.push("/dashboard");
  };

  // Manejar la apertura/cierre del submenú
  const toggleSubmenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSubmenuOpen(!submenuOpen);
  };

  // Contenido del botón o enlace
  const buttonContent = (
    <>
      <div className="min-w-[20px]">{item.icon}</div>
      {!toggleCollapse && (
        <>
          <span className="ml-3 text-sm md:text-base text-start leading-6 font-semibold flex-grow">{item.title}</span>
          {item.submenu && (
            <div className="ml-auto">{submenuOpen ? <BsChevronDown size={14} /> : <BsChevronRight size={14} />}</div>
          )}
        </>
      )}
    </>
  );

  // Si es un botón para resetear el contexto
  if (item.onClick === "resetContext") {
    return (
      <button
        onClick={handleResetContext}
        className="flex items-center w-full justify-start min-h-[40px] text-sidebar-foreground py-2 px-4 hover:text-sidebar-muted-foreground hover:bg-sidebar-muted rounded-md transition duration-200">
        {buttonContent}
      </button>
    );
  }

  // Si es un elemento con submenú
  if (item.submenu) {
    // Cuando la barra está colapsada, usamos un tooltip
    if (toggleCollapse) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={classNames(
                  "flex items-center w-full justify-start min-h-[40px] text-sidebar-foreground py-2 px-4 hover:text-sidebar-muted-foreground hover:bg-sidebar-muted rounded-md transition duration-200",
                  {
                    "text-sidebar-muted-foreground bg-sidebar-muted": isSubMenuActive,
                  }
                )}>
                {buttonContent}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" align="start" className="p-0 min-w-[200px] bg-sidebar">
              <div className="font-semibold text-sidebar-foreground px-4 py-2 border-b">{item.title}</div>
              <div className="py-2">
                {item.subMenuItems?.map((subItem, index) => (
                  <Link
                    key={index}
                    href={subItem.path || "#"}
                    className={classNames(
                      "flex items-center min-h-[32px] text-sidebar-foreground py-1 px-4 hover:text-sidebar-muted-foreground hover:bg-sidebar-muted transition duration-200",
                      {
                        "text-sidebar-muted-foreground bg-sidebar-muted": pathname === subItem.path,
                      }
                    )}>
                    <div className="min-w-[20px]">{subItem.icon}</div>
                    <span className="ml-3 text-sm leading-6 font-medium">{subItem.title}</span>
                  </Link>
                ))}
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    // Cuando la barra no está colapsada, usamos el desplegable normal
    return (
      <div className="relative">
        <button
          onClick={toggleSubmenu}
          className={classNames(
            "flex items-center w-full justify-start min-h-[40px] text-sidebar-foreground py-2 px-4 hover:text-sidebar-muted-foreground hover:bg-sidebar-muted rounded-md transition duration-200",
            {
              "text-sidebar-muted-foreground bg-sidebar-muted": isSubMenuActive || submenuOpen,
            }
          )}>
          {buttonContent}
        </button>

        {/* Submenú desplegable cuando la barra no está colapsada */}
        {submenuOpen && item.subMenuItems && (
          <div className="pl-7 mt-1 space-y-1">
            {item.subMenuItems.map((subItem, index) => (
              <Link
                key={index}
                href={subItem.path || "#"}
                className={classNames(
                  "flex items-center min-h-[32px] text-sidebar-foreground py-1 px-4 hover:text-sidebar-muted-foreground hover:bg-sidebar-muted rounded-md transition duration-200",
                  {
                    "text-sidebar-muted-foreground bg-sidebar-muted": pathname === subItem.path,
                  }
                )}>
                <div className="min-w-[20px]">{subItem.icon}</div>
                <span className="ml-3 text-sm leading-6 font-medium">{subItem.title}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Si es un enlace normal
  return (
    <Link
      href={item.path || "#"}
      className={classNames(
        "flex items-center min-h-[40px] h-full text-sidebar-foreground py-2 px-4 hover:text-sidebar-muted-foreground hover:bg-sidebar-muted rounded-md transition duration-200",
        {
          "text-sidebar-muted-foreground bg-sidebar-muted": pathname === item.path,
        }
      )}>
      {buttonContent}
    </Link>
  );
};
