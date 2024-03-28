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
  const { setSelectedArea } = useAreaSelection();

  const handleDepartmentChange = (value: string | null) => {
    setSelectedDepartment(value);
  };

  const headerStyle = classNames(
    "bg-navbar fixed w-full z-40 px-4 shadow-sm shadow-slate-500/40 ",
    {}
  );

  return (
    <header className={headerStyle}>
      <div className="flex h-16 items-center justify-end 2xl:justify-between ">
        <section className="hidden 2xl:flex items-center gap-x-4">
          {/* Company Selection */}
          <CompanyLogo />

          {/* Site/Department combobox & ScrollArea areas */}
          <div className="hidden 2xl:flex justify-center items-center gap-x-2 p-2 z-50">
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

        {/* Theme switcher & User details */}
        <section className="flex items-center justify-between">
          <section>
            <NotificationsPopover />
          </section>

          <div className="p-2">
            <ThemeSwitcher />
          </div>

          <section className="hidden 2xl:flex gap-x-2">
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
        </section>
        {/* MobileSidebar trigger */}
        <section className="flex 2xl:hidden justify-center items-center">
          <MobileSidebar />
        </section>
      </div>
    </header>
  );
}
