"use client";
import React from "react";
import classNames from "classnames";
import { useSideBarToggle } from "@trm/_hooks/use-sidebar-toggle";
import SideBarMenuGroup from "@trm/_components/sidebar-menu-group";
import { Separator } from "@trm/_components/ui/separator";
import { BsList } from "react-icons/bs";

import { getContextModules } from "@trm/sidebar-modules";
import useContextStore from "@trm/_hooks/use-context-store";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { usePathname } from "next/navigation";
import usePermissionsStore from "@trm/_hooks/use-permissions";

export const SideBar = () => {
  const { toggleCollapse, invokeToggleCollapse } = useSideBarToggle();
  const sidebarToggle = () => {
    invokeToggleCollapse();
  };

  const asideStyle = classNames(
    "hidden md:flex sm:flex-col border-r p-2 gap-y-4 pt-20 bg-sidebar text-sidebar-foreground h-full shadow-sm transition-all duration-300 ease-in-out overflow-x-auto sidebar z-10",
    {
      ["w-[20rem]"]: !toggleCollapse,
      ["sm:w-[5rem]"]: toggleCollapse,
    }
  );

  const { selectedSite, selectedDepartment, selectedArea } = useContextStore();
  const { userData } = useAuth();
  const pathname = usePathname();

  // Obtenemos el rol del usuario desde el contexto de autenticación
  const userRole = userData?.role;
  const { permissions } = usePermissionsStore();

  // Get the appropriate navigation items based on context, role and current path
  const navItems = getContextModules(selectedSite, selectedDepartment, selectedArea, userRole, pathname, permissions);

  // Separamos los items normales del "footer" (cambio de plano)
  const mainNavItems = navItems.filter(item => !Object.keys(item).includes("footer"));
  const footerNavItem = navItems.find(item => Object.keys(item).includes("footer"));

  return (
    <aside className={asideStyle}>
      <div className="flex w-full justify-center items-center">
        <button
          onClick={sidebarToggle}
          className="flex items-center justify-center shrink-btn bg-sidebar-muted text-sidebar-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md w-[30px] h-[30px] shadow-sm transition duration-300 ease-in-out">
          <BsList />
        </button>
      </div>
      <Separator className="bg-border opacity-50" />
      
      <nav className="flex flex-col flex-grow gap-2 transition duration-300 ease-in-out overflow-y-auto">
        <div className="flex flex-col gap-2 px-1 min-w-auto text-sm">
          {mainNavItems.map((item, idx) => {
            return <SideBarMenuGroup key={idx} menuGroup={item} />;
          })}
        </div>
      </nav>

      {footerNavItem && (
        <div className="mt-auto pt-2">
          <Separator className="bg-border opacity-50 mb-4" />
          <div className="px-1">
            <SideBarMenuGroup menuGroup={footerNavItem} />
          </div>
        </div>
      )}
    </aside>
  );
};

