"use client";
import { useState, useEffect } from "react";
import { ThemeSwitcher } from "@trm/_components/theme-switcher";
import { HeaderLogo } from "@trm/_components/header-logo";

import { Combobox } from "@trm/_layout/combobox/combobox";
import { COMBOBOX_LISTS } from "@trm/_layout/combobox/comboboxLists";
import { CarouselAreas } from "@trm/_layout/carousel-areas/carousel-areas";

import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import useAreaSelection from "@trm/_hooks/use-area-selection";
import classNames from "classnames";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { NotificationsPopover } from "../notifications-popover/notifications-popover";
import Link from "next/link";
import { MobileSidebar } from "../mobile-sidebar/mobile-sidebar";
import CompanyLogo from "../company-logo/company-logo";

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
  const { selectedDepartment, setSelectedDepartment } =
    useDepartmentSelection();
  const { selectedArea, setSelectedArea } = useAreaSelection();

  const handleDepartmentChange = (value: string | null) => {
    setSelectedDepartment(value);
  };

  const headerStyle = classNames(
    "bg-navbar fixed w-full z-40 px-4 shadow-md shadow-slate-500/40 ",
    {}
  );

  return (
    <header className={headerStyle}>
      <div className="flex h-16 items-center justify-end md:justify-between ">
        <section className="hidden md:flex items-center gap-x-4">
          {/* Company Selection */}
          <CompanyLogo />

          {/* Site/Department combobox & ScrollArea areas */}
          <div className="hidden xl:flex justify-center items-center gap-x-2 p-2 z-50">
            <Combobox
              isDesktop={true}
              name="Sitios"
              comboboxList={COMBOBOX_LISTS.sites}
            />
            <Combobox
              isDesktop={true}
              name="Departamentos"
              comboboxList={COMBOBOX_LISTS.departments}
              onChange={handleDepartmentChange}
            />
            {selectedDepartment === "supply-chain" && (
              <CarouselAreas setSelectedArea={setSelectedArea} />
            )}
          </div>
        </section>

        {/* Right side items */}
        <section className="flex items-center justify-between">
          {/* Notifications Popover */}
          <section>
            <NotificationsPopover />
          </section>

          <section className="p-2">
            <ThemeSwitcher />
          </section>

          {/* MobileSidebar trigger */}
          <section className="flex xl:hidden justify-center items-center">
            <MobileSidebar />
          </section>

          <section className="hidden xl:flex gap-x-2">
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
              <span className="text-md text-sidebar-foreground">
                {USER.fullName}
              </span>
            </div>
          </section>
        </section>
      </div>
    </header>
  );
}
