"use client";
import React, { useEffect, useState } from "react";
import classNames from "classnames";
import { useSideBarToggle } from "@trm/_hooks/use-sidebar-toggle";
import SideBarMenuGroup from "@trm/_components/sidebar-menu-group";
import { Separator } from "@trm/_components/ui/separator";
import { BsList } from "react-icons/bs";

import { getContextModules } from "@trm/sidebar-modules";
import useSiteSelection from "@trm/_hooks/use-site-selection";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import useAreaSelection from "@trm/_hooks/use-area-selection";
import { useAuth } from "@trm/_lib/auth/auth-context";

export const SideBar = () => {
  const { toggleCollapse, invokeToggleCollapse } = useSideBarToggle();
  const sidebarToggle = () => {
    invokeToggleCollapse();
  };

  const asideStyle = classNames(
    "hidden md:flex sm:flex-col border-r p-2 gap-y-4 pt-20 bg-sidebar text-sidebar-foreground h-full shadow-sm shadow-slate-500/40 transition duration-300 ease-in-out overflow-x-auto sidebar z-10",
    {
      ["w-[20rem]"]: !toggleCollapse,
      ["sm:w-[5rem]"]: toggleCollapse,
    }
  );

  const { selectedSite } = useSiteSelection();
  const { selectedDepartment } = useDepartmentSelection();
  const { selectedArea } = useAreaSelection();
  const { userData } = useAuth();

  // Obtenemos el rol del usuario desde el contexto de autenticación
  const userRole = userData?.role;

  // Get the appropriate navigation items based on context and user role
  const navItems = getContextModules(selectedSite, selectedDepartment, selectedArea, userRole);

  return (
    <aside className={asideStyle}>
      <div className="flex w-full justify-center items-center">
        <button
          onClick={sidebarToggle}
          className="flex items-center justify-center shrink-btn bg-sidebar-muted text-sidebar-muted-foreground hover:bg-accent hover:text-accent-foreground rounded-md w-[30px] h-[30px] shadow-md shadow-black/10 transition duration-300 ease-in-out">
          <BsList />
        </button>
      </div>
      <Separator className="bg-border opacity-50" />
      <nav className="flex flex-col gap-2 transition duration-300 ease-in-out">
        <div className="flex flex-col gap-2 px-1 min-w-auto">
          {navItems.map((item, idx) => {
            return <SideBarMenuGroup key={idx} menuGroup={item} />;
          })}
        </div>
      </nav>
    </aside>
  );
};
