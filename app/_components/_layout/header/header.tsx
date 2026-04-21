"use client";
import { ThemeSwitcher } from "@trm/_components/theme-switcher";
import { ContextSelector } from "../context-selector/context-selector";
import classNames from "classnames";
import { Avatar, AvatarFallback, AvatarImage } from "@trm/_components/ui/avatar";
import { NotificationsPopover } from "../notifications-popover/notifications-popover";
import { MobileSidebar } from "../mobile-sidebar/mobile-sidebar";
import CompanyLogo from "../company-logo/company-logo";
import { useRouter } from "next/navigation";
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
  const { userData, logout } = useAuth();
  const { theme } = useTheme();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  const isCustomTheme = theme === "custom";

  const headerStyle = classNames(
    "fixed w-full z-40 px-4 shadow-md text-navbar-foreground border-b",
    {
      "bg-navbar": !isCustomTheme,
      "navbar-gradient border-none": isCustomTheme,
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
      <div className="flex h-16 items-center justify-between">
        <section className="flex items-center gap-x-6">
          <CompanyLogo />
          <div className="hidden lg:block h-6 w-[1px] bg-border mx-2" />
          <div className="hidden lg:block">
            <ContextSelector />
          </div>
        </section>

        {/* Right side items */}
        <section className="flex items-center gap-3">
          <section className="hidden sm:block">
            <NotificationsPopover />
          </section>

          <section className="hidden sm:block">
            <ThemeSwitcher />
          </section>

          {/* User Dropdown Menu */}
          <section>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className={userButtonStyle}>
                  <Avatar className="h-9 w-9 border-2 border-white/20">
                    <AvatarImage
                      src={userData?.sub ? "/avatars/02.png" : USER.img}
                      alt={userData?.sub || USER.fullName}
                    />
                    <AvatarFallback className="bg-primary/20 text-primary">
                      {userData?.sub ? userData.sub.substring(0, 2).toUpperCase() : "TRM"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start justify-center ml-1">
                    <span className="text-[10px] uppercase tracking-wider opacity-70">
                      {userData?.role === "TRAMET_ADMIN" || userData?.role === "CUSTOMER_ADMIN"
                        ? "Administrador"
                        : USER.position}
                    </span>
                    <span className="text-sm font-semibold">{userData?.sub || USER.fullName}</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel>Mi Cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </section>

          {/* MobileSidebar trigger */}
          <section className="md:hidden">
            <MobileSidebar />
          </section>
        </section>
      </div>
    </header>
  );
}

