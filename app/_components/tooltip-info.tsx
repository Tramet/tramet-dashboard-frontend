import React from "react";
import { Button } from "@trm/_components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@trm/_components/ui/tooltip";

import { Info, LucideIcon } from "lucide-react";

interface ToolTipInfoProps {
  text: string;
  icon?: LucideIcon;
}

export function TooltipInfo({ text, icon }: ToolTipInfoProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          asChild
          className="flex justify-center items-center cursor-pointer transition-colors hover:text-accent">
          <Info width={20} />
        </TooltipTrigger>
        <TooltipContent side="right" align="center">
          <p className="flex justify-center items-center">{text}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
