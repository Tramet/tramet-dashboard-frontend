"use client";
import { ThemeSwitcher } from "@trm/_components/theme-switcher";
import { Combobox } from "@trm/_layout/combobox/combobox";
import { COMBOBOX_LISTS } from "@trm/_layout/combobox/comboboxLists";
import { CarouselAreas } from "@trm/_layout/carousel-areas/carousel-areas";

import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import useAreaSelection from "@trm/_hooks/use-area-selection";
import classNames from "classnames";
import { Avatar, AvatarFallback, AvatarImage } from "@trm/_components/ui/avatar";
import { NotificationsPopover } from "../notifications-popover/notifications-popover";
import Link from "next/link";
import { MobileSidebar } from "../mobile-sidebar/mobile-sidebar";
import CompanyLogo from "../company-logo/company-logo";
import Image from "next/image";
import adminBtn from "../../../public/adminBtn.png";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@trm/_components/ui/button";
import { useAuth } from "@trm/_lib/auth/auth-context";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@trm/_components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

export type UserDetails = {
  id: number;
  fullName: string;
  email: string;
  img: string;
  status: "Online" | "Offline";
  position: string;
};

const USER: UserDetails = {
  id: 1,
  fullName: "Daniel Anaya Perez",
  email: "daniel@example.com",
  status: "Online",
  img: "/avatars/02.png",
  position: "Gerente",
};

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { userData, logout } = useAuth();
  const { theme } = useTheme();

  const { selectedDepartment, setSelectedDepartment } = useDepartmentSelection();
  const { selectedArea, setSelectedArea } = useAreaSelection();

  const handleDepartmentChange = (value: string | null) => {
    setSelectedDepartment(value);
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isCustomTheme = theme === "custom";

  const headerStyle = classNames(
    "fixed w-full z-40 px-4 shadow-md text-navbar-foreground",
    {
      "bg-navbar": !isCustomTheme,
      "navbar-gradient": isCustomTheme,
    }
  );

  const userButtonStyle = classNames(
    "relative h-10 rounded-full p-0 pl-0 pr-2 flex items-center gap-2 text-navbar-foreground",
    {
      "hover:bg-navbar/80": !isCustomTheme,
      "hover:bg-white/10": isCustomTheme,
    }
  );

  return (
    <header className={headerStyle}>
      <div className="flex h-16 items-center justify-end md:justify-between">
        <section className="hidden md:flex items-center gap-x-4">
          {/* Company Selection */}
          <CompanyLogo />
        </section>

        {/* Right side items */}
        <section className="flex items-center justify-between gap-3">
          {/* Notifications Popover */}
          <section>
            <NotificationsPopover />
          </section>

          <section>
            <ThemeSwitcher />
          </section>

          {/* MobileSidebar trigger */}
          <section className="flex md:hidden justify-center items-center">
            <MobileSidebar />
          </section>

          {/* User Dropdown Menu */}
          <section className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={userButtonStyle}>
                  <div className={classNames("h-10 w-10 rounded-full flex items-center justify-center text-center", {
                    "bg-sidebar-muted": !isCustomTheme,
                    "bg-white/10": isCustomTheme,
                  })}>
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage
                        className="rounded-full"
                        src={userData?.sub ? "/avatars/02.png" : USER.img}
                        alt={userData?.sub || USER.fullName}
                      />
                      <AvatarFallback>
                        {userData?.sub ? userData.sub.substring(0, 2).toUpperCase() : "TRM"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex flex-col items-start justify-center">
                    <span className="text-xs opacity-70">
                      {userData?.role === "TRAMET_ADMIN" || userData?.role === "CUSTOMER_ADMIN"
                        ? "Administrador"
                        : USER.position}
                    </span>
                    <span className="text-sm font-medium">{userData?.sub || USER.fullName}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive hover:text-destructive" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </section>
        </section>
      </div>
    </header>
  );
}
