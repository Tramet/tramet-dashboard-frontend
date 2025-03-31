"use client";

import { SideNavItemGroup } from "@trm/_types/type";

import {
  BsEnvelope,
  BsGear,
  BsHouseDoor,
  BsKanban,
  BsListUl,
  BsBuilding,
  BsWindowStack,
  BsPeople,
  BsShieldLock,
  BsClipboard2Check,
  BsArrowLeft,
  BsArrowClockwise,
} from "react-icons/bs";

// Get the module for a specific context (site, department, area)
export const getContextModules = (
  site: string | null,
  department: string | null,
  area: string | null,
  userRole: string | null | undefined
): SideNavItemGroup[] => {
  // Base navigation structure
  const navigation: SideNavItemGroup[] = [];

  // Determinar si es un administrador
  const isAdmin = userRole === "TRAMET_ADMIN" || userRole === "CUSTOMER_ADMIN";

  // Solo mostrar la sección "Inicio" para usuarios regulares, no para administradores
  if (!isAdmin) {
    navigation.push({
      home: {
        title: "Inicio",
        items: [
          {
            title: "Dashboard",
            path: "/dashboard",
            icon: <BsHouseDoor size={20} />,
          },
        ],
      },
    });
  }

  // Siempre incluir opción para volver a seleccionar contexto
  // if it's a complete context, show it as a "Reset selection" button
  if (site && department && area && !isAdmin) {
    // Asegurarse de que el objeto home existe
    if (navigation[0] && navigation[0].home) {
      navigation[0].home.items = [
        {
          title: "Volver a selección",
          path: "/dashboard",
          icon: <BsArrowClockwise size={20} />,
          onClick: "resetContext", // Este atributo será usado para identificar la acción en el componente
        },
      ];
    }
  }

  // Si hay un contexto completo y no es admin, mostrar módulos adicionales
  if (site && department && area && !isAdmin) {
    navigation.push({
      modules: {
        title: `Área: ${area}`,
        items: [
          {
            title: "Dashboard",
            path: "/dashboard",
            icon: <BsHouseDoor size={20} />,
          },
          {
            title: "Operaciones",
            icon: <BsKanban size={20} />,
            submenu: true,
            subMenuItems: [
              {
                title: "Operacion 1",
                path: "/dashboard/operations/1",
                icon: <BsKanban size={20} />,
              },
              {
                title: "Operacion 2",
                path: "/dashboard/operations/2",
                icon: <BsKanban size={20} />,
              },
            ],
          },
          {
            title: "Gestión",
            path: "/dashboard/management",
            icon: <BsGear size={20} />,
          },
          {
            title: "Auto-admin.",
            path: "/dashboard/autoadmin",
            icon: <BsListUl size={20} />,
          },
          {
            title: "Material de apoyo",
            path: "/dashboard/support",
            icon: <BsEnvelope size={20} />,
          },
        ],
      },
    });
  }

  // Incluir módulos de administración SOLO si el usuario tiene rol de administrador
  if (isAdmin) {
    navigation.push({
      admin: {
        title: "Administrador",
        items: [
          {
            title: "Dashboard",
            path: "/admin",
            icon: <BsHouseDoor size={20} />,
          },
          {
            title: "Departamentos",
            path: "/admin/departments",
            icon: <BsBuilding size={20} />,
          },
          {
            title: "Sitios",
            path: "/admin/sites",
            icon: <BsWindowStack size={20} />,
          },
          {
            title: "Usuarios",
            path: "/admin/users",
            icon: <BsPeople size={20} />,
          },
        ],
      },
    });
  }

  return navigation;
};

// Default export for backward compatibility
export const SIDENAV_ITEMS: SideNavItemGroup[] = getContextModules(null, null, null, null);
