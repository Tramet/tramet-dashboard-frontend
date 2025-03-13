import { SideNavItemGroup } from "@trm/_types/type";
import React from "react";
import { SideBarMenuItem } from "./sidebar-menu-item";
import { useSideBarToggle } from "@trm/_hooks/use-sidebar-toggle";
import { Separator } from "@trm/_components/ui/separator";

const SideBarMenuGroup = ({ menuGroup }: { menuGroup: SideNavItemGroup }) => {
  const { toggleCollapse } = useSideBarToggle();

  // Función auxiliar para renderizar un grupo de menú
  const renderMenuGroup = (key: string, group: any) => {
    if (!group || !group.items || group.items.length === 0) return null;

    return (
      <div className="mb-4" key={key}>
        {!toggleCollapse && <h2 className="text-lg text-sidebar-foreground font-semibold px-4 mb-2">{group.title}</h2>}
        <div className="flex flex-col gap-2">
          {group.items.map((item: any, index: number) => (
            <SideBarMenuItem key={`${key}-${index}`} item={item} />
          ))}
        </div>
        <Separator className="mt-2" />
      </div>
    );
  };

  return (
    <div className="w-full">
      {/* Procesar todos los grupos disponibles */}
      {Object.keys(menuGroup).map((key) => {
        const group = menuGroup[key as keyof SideNavItemGroup];
        return renderMenuGroup(key, group);
      })}
    </div>
  );
};

export default SideBarMenuGroup;
