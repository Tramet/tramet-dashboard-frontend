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
import { useTheme } from "next-themes";

export const SideBarMenuItem = ({ item }: { item: SideNavItem }) => {
  const { toggleCollapse } = useSideBarToggle();
  const pathname = usePathname();
  const { selectedArea, setSelectedArea } = useAreaSelection();
  const { selectedDepartment, setSelectedDepartment } = useDepartmentSelection();
  const { selectedSite, setSite } = useSiteSelection();
  const router = useRouter();
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const { theme } = useTheme();
  const isCustomTheme = theme === "custom";

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
      <div className="min-w-[20px] text-sidebar-foreground">{item.icon}</div>
      {!toggleCollapse && (
        <>
          <span className="ml-3 text-sm md:text-base text-start leading-6 font-semibold flex-grow text-sidebar-foreground">{item.title}</span>
          {item.submenu && (
            <div className="ml-auto text-sidebar-foreground">{submenuOpen ? <BsChevronDown size={14} /> : <BsChevronRight size={14} />}</div>
          )}
        </>
      )}
    </>
  );

  // Clases comunes para items
  const itemBaseClasses = "text-sidebar-foreground hover:text-sidebar-muted-foreground hover:bg-sidebar-muted transition duration-200";
  
  // Ahora usamos la misma clase sidebar-highlight para todos los temas
  // lo que varía es la implementación CSS para cada tema
  const activeItemClasses = "sidebar-highlight font-medium";

  // Si es un botón para resetear el contexto
  if (item.onClick === "resetContext") {
    return (
      <button
        onClick={handleResetContext}
        className={`flex items-center w-full justify-start min-h-[40px] py-2 px-4 rounded-md ${itemBaseClasses}`}>
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
                  `flex items-center w-full justify-start min-h-[40px] py-2 px-4 rounded-md ${itemBaseClasses}`,
                  {
                    [activeItemClasses]: isSubMenuActive,
                  }
                )}
                onClick={toggleSubmenu}>
                {buttonContent}
              </button>
            </TooltipTrigger>
            <TooltipContent side="right" align="start" className="p-0 min-w-[200px] bg-sidebar text-sidebar-foreground border border-border">
              <div className="font-semibold px-4 py-2 border-b border-border">{item.title}</div>
              <div className="py-2">
                {item.subMenuItems?.map((subItem, index) => (
                  <Link
                    key={index}
                    href={subItem.path || "#"}
                    className={classNames(
                      "block px-4 py-2 hover:bg-sidebar-muted",
                      {
                        [activeItemClasses]: pathname === subItem.path,
                      }
                    )}
                    onClick={(e) => {
                      // Verificar contexto completo
                      if (!subItem.path) return;
                      if (subItem.path.includes("/dashboard/") && (!selectedSite || !selectedDepartment || !selectedArea)) {
                        e.preventDefault();
                        window.alert(`Para acceder a esta sección, primero selecciona: ${
                          (!selectedSite ? "Sitio" : "") +
                          (!selectedDepartment ? "Departamento" : "") +
                          (!selectedArea ? "Área" : "")
                        }`);
                        return;
                      }
                    }}>
                    <span className="flex items-center">
                      <span className="mr-2 min-w-[20px] text-sidebar-foreground">{subItem.icon}</span>
                      <span className="text-sidebar-foreground">{subItem.title}</span>
                    </span>
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
            `flex items-center w-full justify-start min-h-[40px] py-2 px-4 rounded-md ${itemBaseClasses}`,
            {
              [activeItemClasses]: isSubMenuActive || submenuOpen,
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
                  "flex items-center py-3 px-3 hover:bg-sidebar-muted",
                  {
                    [activeItemClasses]: pathname === subItem.path,
                  }
                )}
                onClick={(e) => {
                  // Verificar contexto completo
                  if (!subItem.path) return;
                  if (subItem.path.includes("/dashboard/") && (!selectedSite || !selectedDepartment || !selectedArea)) {
                    e.preventDefault();
                    window.alert(`Para acceder a esta sección, primero selecciona: ${
                      (!selectedSite ? "Sitio" : "") +
                      (!selectedDepartment ? "Departamento" : "") +
                      (!selectedArea ? "Área" : "")
                    }`);
                    return;
                  }
                }}>
                <div className="mr-2 min-w-[20px] text-sidebar-foreground">{subItem.icon}</div>
                <span className="text-sidebar-foreground">{subItem.title}</span>
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
        `flex items-center w-full justify-start min-h-[40px] py-2 px-4 rounded-md ${itemBaseClasses}`,
        {
          [activeItemClasses]: pathname === item.path,
        }
      )}
      onClick={(e) => {
        // Verificar contexto completo
        if (!item.path) return;
        if (item.path.includes("/dashboard/") && (!selectedSite || !selectedDepartment || !selectedArea)) {
          e.preventDefault();
          window.alert(`Para acceder a esta sección, primero selecciona: ${
            (!selectedSite ? "Sitio" : "") +
            (!selectedDepartment ? "Departamento" : "") +
            (!selectedArea ? "Área" : "")
          }`);
          return;
        }
      }}>
      {buttonContent}
    </Link>
  );
};
