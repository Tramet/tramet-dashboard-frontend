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
import { CheckIcon, Palette } from "lucide-react";

interface MenuItemProps {
  themeName: string;
  children: React.ReactNode;
}

const MenuItem = ({ themeName, children }: MenuItemProps) => {
  const { setTheme, theme } = useTheme();

  const handleClick = () => {
    setTheme(themeName);
  };

  return (
    <DropdownMenuItem onClick={handleClick}>
      <span>{children}</span>
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
          className="rounded-full p-0 bg-foreground hover:bg-muted text-background hover:text-muted-foreground border-0 outline-none">
          <Palette className="w-6 h-6" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="z-[99998]">
        <MenuItem themeName="light">Light</MenuItem>
        <MenuItem themeName="dark">Dark</MenuItem>
        <MenuItem themeName="custom">Tramet Light</MenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
