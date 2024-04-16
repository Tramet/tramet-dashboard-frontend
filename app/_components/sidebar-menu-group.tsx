import { SideNavItemGroup } from "@trm/_types/type";
import React from "react";
import { SideBarMenuItem } from "./sidebar-menu-item";
import { useSideBarToggle } from "@trm/_hooks/use-sidebar-toggle";
import { TooltipInfo } from "@trm/_components/tooltip-info";
import { Info } from "lucide-react";
import useAreaSelection from "@trm/_hooks/use-area-selection";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import { usePathname } from "next/navigation"; // Importando usePathname desde next/navigation
import { SIDENAV_ITEMS } from "@trm/sidebar-modules";

const SideBarMenuGroup = ({ menuGroup }: { menuGroup: SideNavItemGroup }) => {
  const { toggleCollapse } = useSideBarToggle();
  const { selectedArea } = useAreaSelection();
  const { selectedDepartment } = useDepartmentSelection();
  const pathname = usePathname();
  const isAdminRoute = pathname.includes("/admin");

  return (
    <>
      {isAdminRoute ? (
        <>
          {SIDENAV_ITEMS.map(
            (item, idx) =>
              !toggleCollapse && (
                <h1
                  key={`title${idx}`}
                  className="flex justify-start items-center text-lg text-sidebar-foreground font-semibold px-4">
                  {item.admin?.title}
                </h1>
              )
          )}
          {menuGroup.admin?.items.map((item, index) => (
            <SideBarMenuItem key={index} item={item} />
          ))}
        </>
      ) : selectedArea ? (
        menuGroup.home?.items.map((item, index) => (
          <SideBarMenuItem key={index} item={item} />
        ))
      ) : (
        <div className="text-accent-foreground text-sm text-center">
          {toggleCollapse ? (
            <div className="flex justify-center items-center">
              <TooltipInfo text="Selecciona un departamento y un area" />
            </div>
          ) : (
            <div className="flex justify-center items-center gap-x-2">
              <Info width={20} />
              <p className="text-start text-pretty">
                Selecciona un departamento y un area
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default SideBarMenuGroup;
