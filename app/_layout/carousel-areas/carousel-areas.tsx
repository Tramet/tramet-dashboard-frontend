"use client";
import { useState } from "react";
import { AREAS_LIST } from "./areas-list";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import classNames from "classnames";

import { Card, CardContent } from "@trm/_components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@trm/_components/ui/carousel";

interface CarouselAreasProps {
  className?: string;
  setSelectedArea: (area: string | null) => void;
}

export function CarouselAreas({ setSelectedArea }: CarouselAreasProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { selectedDepartment } = useDepartmentSelection();

  const handleSelectedArea = (area: string) => {
    setSelectedArea(area);
    router.push(`/${selectedDepartment}/${area}/dashboard`);
  };

  const [isDragging, setIsDragging] = useState(false);

  return (
    <div
      className="flex justify-center items-center h-full"
      onMouseDown={() => setIsDragging(true)}
      onMouseUp={() => setIsDragging(false)}
      onMouseEnter={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
      style={{
        cursor: isDragging ? "grabbing" : "pointer",
        userSelect: "none",
      }}>
      <Carousel
        opts={{
          dragFree: true,
          align: "start",
        }}
        className="w-full max-w-sm ml-12">
        <CarouselContent className="-ml-1 h-full">
          {AREAS_LIST.map((area) => (
            <CarouselItem
              key={area.id}
              className={classNames("basis-1/4 pl-1 text-wrap cursor-pointer", {
                "cursor-grabbing": isDragging,
              })}>
              <Card
                className={classNames(
                  "flex justify-center items-center h-full transition-all hover:bg-input rounded-sm",
                  {
                    "bg-input text-primary": new RegExp(
                      `^/${selectedDepartment}/${area.path}(?:/.+)?$`
                    ).test(pathname),
                  }
                )}>
                <CardContent
                  onClick={() => handleSelectedArea(area.path)}
                  className="flex flex-col justify-center items-center text-center text-xs p-0">
                  <area.icon height={20} />
                  <p className="flex justify-center items-center ">
                    {area.name}
                  </p>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hover:scale-110" />
        <CarouselNext className="hover:scale-110" />
      </Carousel>
    </div>
  );
}
