"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@radix-ui/react-accordion";
import { useSideBarToggle } from "@trm/_hooks/use-sidebar-toggle";
import { SideNavItem } from "@trm/_types/type";
import classNames from "classnames";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { BsChevronRight } from "react-icons/bs";
import { buttonVariants } from "./ui/button";
import useAreaSelection from "@trm/_hooks/use-area-selection";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";

export const SideBarMenuItem = ({ item }: { item: SideNavItem }) => {
  const { toggleCollapse } = useSideBarToggle();
  const pathname = usePathname();
  const [openItem, setOpenItem] = useState("");
  const { selectedArea } = useAreaSelection();
  const { selectedDepartment } = useDepartmentSelection();

  const isItemActive = (path: string) =>
    pathname === `/${selectedDepartment}/${selectedArea}/${path}`;

  const isAnyChildActive = () =>
    item.subMenuItems?.some(
      (subItem) =>
        pathname === `/${selectedDepartment}/${selectedArea}/${subItem.path}`
    );

  return (
    <>
      {item.submenu ? (
        <Accordion
          type="single"
          collapsible
          className="space-y-2"
          key={item.title}
          value={openItem}
          onValueChange={setOpenItem}>
          <AccordionItem value={item.title} className="border-none">
            <AccordionTrigger
              className={classNames(
                buttonVariants({ variant: "ghost" }),
                "flex items-center justify-start w-full h-full text-sidebar-foreground py-2 px-4 hover:text-sidebar-muted-foreground hover:bg-sidebar-muted rounded-md transition duration-200",
                {
                  "bg-sidebar-muted":
                    isAnyChildActive() || openItem === item.title,
                }
              )}>
              <div className="min-w-[20px]">{item.icon}</div>
              {!toggleCollapse && (
                <>
                  <span className="ml-3 text-sm md:text-base leading-6 font-semibold">
                    {item.title}
                  </span>
                  <BsChevronRight
                    className={classNames(
                      "ml-auto stroke-2 text-xs transition-transform duration-200",
                      {
                        "rotate-90": openItem === item.title,
                      }
                    )}
                  />
                </>
              )}
            </AccordionTrigger>
            <AccordionContent className="pl-2">
              <div className="border-l-4">
                <div className="grid gap-y-2 leading-5 py-3">
                  {item.subMenuItems &&
                    item.subMenuItems.map((subItem, idx) => (
                      <Link
                        key={idx}
                        href={subItem.path}
                        className={classNames(
                          "flex items-center h-full opacity-90 text-sidebar-foreground py-2 pl-2 hover:text-sidebar-muted-foreground hover:bg-sidebar-muted rounded-md transition duration-200",
                          {
                            "text-sidebar-muted-foreground bg-sidebar-muted":
                              isItemActive(subItem.path),
                          }
                        )}
                        passHref>
                        <div className="min-w-[20px]">{subItem.icon}</div>
                        {!toggleCollapse && (
                          <span className="ml-3 text-xs md:text-sm leading-6 font-semibold">
                            {subItem.title}
                          </span>
                        )}
                      </Link>
                    ))}
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <Link
          href={item.path}
          passHref
          className={classNames(
            "flex items-center min-h-[40px] h-full text-sidebar-foreground py-2 px-4 hover:text-sidebar-muted-foreground hover:bg-sidebar-muted rounded-md transition duration-200",
            {
              "text-sidebar-muted-foreground bg-sidebar-muted": isItemActive(
                item.path
              ),
            }
          )}>
          <div className="min-w-[20px]">{item.icon}</div>
          {!toggleCollapse && (
            <span className="ml-3 text-sm md:text-base leading-6 font-semibold">
              {item.title}
            </span>
          )}
        </Link>
      )}
    </>
  );
};
