import { HeaderLogo } from "@trm/_components/header-logo";
import useAreaSelection from "@trm/_hooks/use-area-selection";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import classNames from "classnames";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const COMPANY = {
  name: "TRAMET",
};

const CompanyLogo = () => {
  const { setSelectedArea } = useAreaSelection();
  const { setSelectedDepartment } = useDepartmentSelection();
  const [mounted, setMounted] = useState(false);

  const clearRoute = () => {
    setSelectedDepartment(null);
    setSelectedArea(null);
  };

  useEffect(() => setMounted(true), []);
  return (
    <Link href="/" onClick={clearRoute}>
      <div className="relative flex items-center ">
        {mounted && <HeaderLogo />}
        <h3
          className={classNames(
            "font-bold text-2xl min-w-max text-sidebar-foreground"
          )}>
          {COMPANY.name}
        </h3>
      </div>
    </Link>
  );
};

export default CompanyLogo;
