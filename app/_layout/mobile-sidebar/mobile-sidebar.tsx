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
import { LogOut, Menu, User } from "lucide-react";
import { SideBar } from "../sidebar/sidebar";
import CompanyLogo from "../company-logo/company-logo";
import { Combobox } from "../combobox/combobox";
import { COMBOBOX_LISTS } from "../combobox/comboboxLists";
import useSiteSelection from "@trm/_hooks/use-site-selection";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import useAreaSelection from "@trm/_hooks/use-area-selection";
import { useState } from "react";
import { Avatar, AvatarImage } from "@trm/_components/ui/avatar";
import { type UserDetails } from "@trm/_layout/header/header";
import { AvatarFallback } from "@trm/_components/ui/avatar";
import { SIDENAV_ITEMS } from "@trm/sidebar-modules";
import SideBarMenuGroup from "@trm/_components/sidebar-menu-group";
import { usePathname, useRouter } from "next/navigation";
import { Separator } from "@trm/_components/ui/separator";
import { getContextModules } from "@trm/sidebar-modules";
import { useAuth } from "@trm/_lib/auth/auth-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@trm/_components/ui/dropdown-menu";

const USER: UserDetails = {
  id: 1,
  fullName: "Daniel Anaya Perez",
  email: "daniel@example.com",
  status: "Online",
  img: "/avatars/02.png",
  position: "Gerente",
};

export function MobileSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAdminPage = pathname.includes("/admin");

  // Hooks para el contexto de selección
  const { selectedSite, setSite } = useSiteSelection();
  const { selectedDepartment, setSelectedDepartment } = useDepartmentSelection();
  const { selectedArea, setSelectedArea } = useAreaSelection();

  // Hook para obtener la información del usuario autenticado
  const { userData, logout } = useAuth();

  // Estado para controlar la apertura del panel lateral
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Obtener los ítems de navegación basados en el contexto y rol del usuario
  const navItems = getContextModules(selectedSite, selectedDepartment, selectedArea, userData?.role);

  // Manejadores para los cambios en los selectores
  const handleSiteChange = (value: string | null) => {
    setSite(value);
    // Al cambiar el sitio, reseteamos departamento y área
    if (value !== selectedSite) {
      setSelectedDepartment(null);
      setSelectedArea(null);
    }
  };

  const handleDepartmentChange = (value: string | null) => {
    setSelectedDepartment(value);
    // Al cambiar el departamento, reseteamos el área
    if (value !== selectedDepartment) {
      setSelectedArea(null);
    }
  };

  const handleLogout = () => {
    logout();
    setIsSheetOpen(false); // Cerrar el sidebar móvil
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
              {/* Información del contexto seleccionado */}
              {selectedSite && selectedDepartment && selectedArea && (
                <div className="bg-muted p-2 rounded-md mt-2 mb-4">
                  <p className="text-sm font-medium">Contexto actual:</p>
                  <div className="grid grid-cols-1 gap-1 mt-1">
                    <p className="text-xs text-muted-foreground">
                      Sitio: <span className="text-foreground">{selectedSite}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Departamento: <span className="text-foreground">{selectedDepartment}</span>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Área: <span className="text-foreground">{selectedArea}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator className="my-2" />

          {/* Menú de navegación */}
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

        {/* Footer con información del usuario y menú desplegable */}
        {userData && (
          <SheetFooter className="w-full border-t pt-4 mt-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex gap-x-2 items-center">
                <Avatar className="h-10 w-10 rounded-full">
                  <AvatarImage className="rounded-full" src="/avatars/default.png" alt={userData.sub || "Usuario"} />
                  <AvatarFallback>{userData.sub ? userData.sub.substring(0, 2).toUpperCase() : "U"}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start justify-center">
                  <span className="text-xs text-accent-foreground opacity-70">
                    {userData.role === "TRAMET_ADMIN" || userData.role === "CUSTOMER_ADMIN"
                      ? "Administrador"
                      : "Usuario"}
                  </span>
                  <span className="text-sm text-sidebar-foreground">{userData.sub || "Usuario"}</span>
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
