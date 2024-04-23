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
} from "react-icons/bs";

export const SIDENAV_ITEMS: SideNavItemGroup[] = [
  {
    admin: {
      title: "Administrador",
      items: [
        {
          title: "Deparamentos",
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
    home: {
      title: "Inicio",
      items: [
        {
          title: "Dashboard",
          path: "dashboard",
          icon: <BsHouseDoor size={20} />,
        },
        {
          title: "Operaciones",
          icon: <BsKanban size={20} />,
          submenu: true,
          subMenuItems: [
            {
              title: "Operacion 1",
              path: "operation-1",
              icon: <BsKanban size={20} />,
            },
            {
              title: "Operacion 2",
              path: "operation-2",
              icon: <BsKanban size={20} />,
            },
          ],
        },
        {
          title: "Gestión",
          path: "management",
          icon: <BsGear size={20} />,
        },
        {
          title: "Auto-admin.",
          path: "autoadmin",
          icon: <BsListUl size={20} />,
        },
        {
          title: "Material de apoyo",
          path: "support-material",
          icon: <BsEnvelope size={20} />,
        },
      ],
    },
  },
];
