"use client";

import { SideNavItemGroup } from "@trm/_types/type";
import {
  BsEnvelope,
  BsGear,
  BsHouseDoor,
  BsKanban,
  BsListUl,
  BsQuestionCircle,
} from "react-icons/bs";

export const SIDENAV_ITEMS: SideNavItemGroup[] = [
  {
    menuList: [
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
];
