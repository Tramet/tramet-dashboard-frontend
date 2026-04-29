"use client";

import { Button } from "@trm/_components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "@trm/_components/ui/sheet";
import { LogOut, Menu } from "lucide-react";
import CompanyLogo from "../company-logo/company-logo";
import useContextStore from "@trm/_hooks/use-context-store";
import { useEffect, useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@trm/_components/ui/avatar";
import SideBarMenuGroup from "@trm/_components/sidebar-menu-group";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@trm/_components/ui/separator";
import { getContextModules } from "@trm/sidebar-modules";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { getSites } from "@trm/_api/sites";
import { getDepartments } from "@trm/_api/departments";
import { AREAS_LIST } from "@trm/_components/_layout/carousel-areas/areas-list";

export function MobileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");

  const { 
    selectedSite,
    selectedDepartment,
    selectedArea 
  } = useContextStore();

  const { userData, logout } = useAuth();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Estados para etiquetas resueltas
  const [siteLabel, setSiteLabel] = useState<string>("");
  const [deptLabel, setDeptLabel] = useState<string>("");
  const [areaLabel, setAreaLabel] = useState<string>("");

  useEffect(() => {
    const resolveLabels = async () => {
      if (selectedSite) {
        try {
          const sites = await getSites();
          const site = sites.find(s => s.id.toString() === selectedSite);
          setSiteLabel(site?.site || selectedSite);
        } catch (e) { setSiteLabel(selectedSite); }
      }
      if (selectedDepartment) {
        try {
          const depts = await getDepartments();
          const dept = depts.find(d => d.id.toString() === selectedDepartment);
          setDeptLabel(dept?.name || selectedDepartment);
        } catch (e) { setDeptLabel(selectedDepartment); }
      }
      if (selectedArea) {
        const area = AREAS_LIST.find(a => a.path === selectedArea);
        setAreaLabel(area?.name || selectedArea);
      }
    };
    resolveLabels();
  }, [selectedSite, selectedDepartment, selectedArea]);

  const navItems = getContextModules(selectedSite, selectedDepartment, selectedArea, userData?.role, pathname);

  const handleLogout = () => {
    logout();
    setIsSheetOpen(false);
    router.push("/login");
  };

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-md p-0 bg-foreground hover:bg-muted text-background hover:text-muted-foreground border-0 outline-none">
          <Menu width={20} />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="flex flex-col justify-between items-start pl-6 pb-6 pt-6 pr-6 min-w-[280px] max-w-[384px]">
        <div className="w-full">
          <SheetHeader className="mb-4">
            <CompanyLogo />
          </SheetHeader>

          {!isAdminPage && (
            <div className="w-full mb-4">
              {selectedSite && selectedDepartment && selectedArea && (
                <div className="bg-muted p-3 rounded-lg mt-2 mb-4 border border-border/50">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Contexto Operativo</p>
                  <div className="space-y-1">
                    <p className="text-sm">
                      <span className="text-muted-foreground">Sitio:</span> <span className="font-medium text-foreground">{siteLabel}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Depto:</span> <span className="font-medium text-foreground">{deptLabel}</span>
                    </p>
                    <p className="text-sm">
                      <span className="text-muted-foreground">Área:</span> <span className="font-medium text-primary">{areaLabel}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator className="my-4" />

          <div className="w-full overflow-y-auto max-h-[calc(100vh-350px)]">
            <nav className="flex flex-col gap-2 transition duration-300 ease-in-out">
              <div className="flex flex-col gap-2 px-1 min-w-auto">
                {navItems.map((item, idx) => (
                  <SideBarMenuGroup key={idx} menuGroup={item} />
                ))}
              </div>
            </nav>
          </div>
        </div>

        {userData && (
          <SheetFooter className="w-full border-t pt-4 mt-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-x-2 items-center">
                <Avatar className="h-10 w-10 rounded-full">
                  <AvatarImage className="rounded-full" src="/avatars/default.png" alt={userData.sub || "Usuario"} />
                  <AvatarFallback>{userData.sub ? userData.sub.substring(0, 2).toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center">
                  <span className="text-[10px] uppercase font-bold opacity-50 tracking-tighter">
                    {userData.role === "TRAMET_ADMIN" || userData.role === "CUSTOMER_ADMIN"
                      ? "Administrador"
                      : "Usuario"}
                  </span>
                  <span className="text-sm font-semibold text-sidebar-foreground">{userData.sub || "Usuario"}</span>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-red-600 hover:text-red-700 hover:bg-red-100 px-2"
                onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                <span className="text-xs">Salir</span>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
