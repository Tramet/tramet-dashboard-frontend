"use client";
import { useSideBarToggle } from "@trm/_hooks/use-sidebar-toggle";
import classNames from "classnames";
import { ReactNode } from "react";

export default function PageWrapper({ children }: { children: ReactNode }) {
  const bodyStyle = classNames("bg-background flex flex-col pt-16 p-4  h-full w-full overflow-y-auto");

  return <div className={bodyStyle}>{children}</div>;
}
