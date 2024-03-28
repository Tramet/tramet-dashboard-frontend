import { Button } from "@trm/_components/ui/button";
import { Input } from "@trm/_components/ui/input";
import { Label } from "@trm/_components/ui/label";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@trm/_components/ui/sheet";
import { Menu } from "lucide-react";
import { SideBar } from "../sidebar/sidebar";
import CompanyLogo from "../company-logo/company-logo";
import { Combobox } from "../combobox/combobox";
import { COMBOBOX_LISTS } from "../combobox/comboboxLists";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import useAreaSelection from "@trm/_hooks/use-area-selection";
import { useState } from "react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { type UserDetails } from "@trm/_layout/header/header";
import { AvatarFallback } from "@trm/_components/ui/avatar";
import { SIDENAV_ITEMS } from "@trm/sidebar-modules";
import SideBarMenuGroup from "@trm/_components/sidebar-menu-group";

const USER: UserDetails = {
  id: 1,
  fullName: "Daniel Anaya Perez",
  email: "daniel@example.com",
  status: "Online",
  img: "/avatars/02.png",
  position: "Gerente",
};

export function MobileSidebar() {
  const { selectedDepartment, setSelectedDepartment } =
    useDepartmentSelection();

  const { setSelectedArea } = useAreaSelection();

  const handleDepartmentChange = (value: string | null) => {
    setSelectedDepartment(value);
  };
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button className="p-2 bg-sidebar-muted text-sidebar-muted-foreground hover:bg-input">
          <Menu width={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col justify-between items-start pl-6 pb-6 pt-6 pr-10">
        <div className="w-full flex flex-col justify-center items-start space-y-4">
          <CompanyLogo />
          <div className="flex flex-col space-y-2 justify-center items-start gap-x-2 p-2 z-50">
            <Combobox
              isDesktop={false}
              name="Sitios"
              comboboxList={COMBOBOX_LISTS.sites}
            />
            <Combobox
              isDesktop={false}
              name="Departamentos"
              comboboxList={COMBOBOX_LISTS.departments}
              onChange={handleDepartmentChange}
              setIsSheetOpen={setIsSheetOpen}
            />
          </div>
          <div className="flex flex-col gap-2 px-1 min-w-auto">
            {SIDENAV_ITEMS.map((item, idx) => {
              return <SideBarMenuGroup key={idx} menuGroup={item} />;
            })}
          </div>
        </div>
        <SheetFooter>
          <section className="flex gap-x-2">
            <div className="h-10 w-10 rounded-full bg-sidebar-muted flex items-center justify-center text-center">
              <Avatar className="h-10 w-10 rounded-full">
                <AvatarImage
                  className="rounded-full"
                  src={USER.img}
                  alt={USER.fullName}
                />
                <AvatarFallback>TRM</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col items-start justify-center">
              <span className="text-xs text-accent-foreground opacity-70">
                {USER.position}
              </span>
              <span className="text-sm text-sidebar-foreground">
                {USER.fullName}
              </span>
            </div>
          </section>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
