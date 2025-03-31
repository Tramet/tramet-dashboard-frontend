"use client";

import * as React from "react";
import { useTheme } from "next-themes";

import { Button } from "@trm/_components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@trm/_components/ui/dropdown-menu";
import { CheckIcon, Palette, Sun, Moon } from "lucide-react";

interface MenuItemProps {
  themeName: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const MenuItem = ({ themeName, children, icon }: MenuItemProps) => {
  const { setTheme, theme } = useTheme();

  const handleClick = () => {
    setTheme(themeName);
  };

  return (
    <DropdownMenuItem onClick={handleClick} className="flex items-center gap-2">
      {icon && <span className="flex items-center justify-center w-4 h-4">{icon}</span>}
      <span className="flex-grow">{children}</span>
      {theme === themeName && <CheckIcon className="ml-2 h-4 w-4" />}
    </DropdownMenuItem>
  );
};

export const ThemeSwitcher: React.FC = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full p-0 bg-accent hover:bg-muted text-accent-foreground hover:text-muted-foreground border-0 outline-none">
          <Palette className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[99998] ">
        <MenuItem themeName="light" icon={<Sun className="h-4 w-4" />}>Claro</MenuItem>
        <MenuItem themeName="dark" icon={<Moon className="h-4 w-4" />}>Oscuro</MenuItem>
        <MenuItem themeName="custom" icon={<Palette className="h-4 w-4" />}>Tramet Claro</MenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
