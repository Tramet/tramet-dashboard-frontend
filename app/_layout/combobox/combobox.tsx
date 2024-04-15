import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@trm/_lib/utils";
import { Button } from "@trm/_components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@trm/_components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@trm/_components/ui/popover";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@trm/_components/ui/drawer";
import { CarouselAreas } from "../carousel-areas/carousel-areas";
import useAreaSelection from "@trm/_hooks/use-area-selection";
import useDepartmentSelection from "@trm/_hooks/use-department-selection";

interface ComboboxProps {
  name: string;
  comboboxList?: {
    id: number;
    value: string;
    label: string;
    href?: string;
  }[];
  onChange?: ((value: string | null) => void) | undefined;
  isDesktop: boolean;
  setIsSheetOpen?: ((value: boolean) => void) | undefined;
}

const getSingularOfName = (name: string): string => {
  return name.slice(0, -1);
};

function ComboboxContent({
  selectedValue,
  handleSelect,
  comboboxList,
  name,
}: {
  selectedValue: string;
  handleSelect: (value: string) => void;
  comboboxList: ComboboxProps["comboboxList"];
  name: ComboboxProps["name"];
}) {
  return (
    <Command>
      <CommandInput placeholder={`Buscar ${name}`} />
      <CommandEmpty>{`No se encontro ningún ${getSingularOfName(
        name
      )}.`}</CommandEmpty>
      <CommandGroup>
        <CommandList>
          {comboboxList?.map((comboboxValue) => (
            <CommandItem
              key={comboboxValue.id}
              value={comboboxValue.value}
              onSelect={() => handleSelect(comboboxValue.value)}
              className={cn(
                "text-sm",
                selectedValue === comboboxValue.value &&
                  "bg-primary text-primary-foreground"
              )}>
              <Check
                className={cn(
                  "mr-2 h-4 w-4",
                  selectedValue === comboboxValue.value
                    ? "opacity-100"
                    : "opacity-0"
                )}
              />
              {comboboxValue.label}
            </CommandItem>
          ))}
        </CommandList>
      </CommandGroup>
    </Command>
  );
}

export function Combobox({
  comboboxList,
  name,
  onChange,
  isDesktop,
  setIsSheetOpen,
}: ComboboxProps): JSX.Element {
  const [open, setOpen] = useState(false);
  const { selectedDepartment, setSelectedDepartment } =
    useDepartmentSelection();
  const { setSelectedArea } = useAreaSelection();
  const [selectedValue, setSelectedValue] = useState("");

  const handleSelect = (value: string): void => {
    if (selectedValue === value) {
      setSelectedValue("");
      onChange?.(null);
    } else {
      setSelectedValue(value);
      onChange?.(value);
    }
    setOpen(false);
  };

  const handleDrawerClick = () => {
    if (
      selectedDepartment === "supply-chain" &&
      !selectedValue &&
      name === "Departamentos"
    ) {
      setOpen(true);
    } else {
      setOpen(!open);
    }
  };

  const handleDepartmentSelect = (value: string): void => {
    setSelectedDepartment(value);
    setOpen(true); // Abre el Drawer después de seleccionar el departamento
  };

  const handleAreaSelect = (value: string): void => {
    setSelectedArea(value);
    setOpen(false); // Cierra el Drawer después de seleccionar el área y el sheet
    setIsSheetOpen?.(false);
  };

  return (
    <>
      {isDesktop ? (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-[140px] max-w-[140px] text-xs flex justify-between items-center text-popover-foreground hover:bg-input overflow-hidden text-wrap`}
              onClick={() => setOpen(!open)}>
              <p className="text-start">
                {selectedValue
                  ? comboboxList?.find(
                      (comboboxValue) => comboboxValue.value === selectedValue
                    )?.label
                  : name}
              </p>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 z-50">
            <ComboboxContent
              selectedValue={selectedValue}
              handleSelect={handleSelect}
              comboboxList={comboboxList}
              name={name}
            />
          </PopoverContent>
        </Popover>
      ) : (
        <Drawer open={open} onOpenChange={setOpen}>
          <DrawerTrigger asChild className="w-full">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className={`w-full min-w-[150px] sm:max-w-[250px] text-xs flex justify-between items-center text-popover-foreground hover:bg-input overflow-hidden text-wrap`}
              onClick={handleDrawerClick}>
              <p className="text-start">
                {selectedValue
                  ? comboboxList?.find(
                      (comboboxValue) => comboboxValue.value === selectedValue
                    )?.label
                  : name}
              </p>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </DrawerTrigger>

          <DrawerContent onClick={(e) => e.stopPropagation()}>
            {name === "Departamentos" ? (
              <>
                <ComboboxContent
                  selectedValue={selectedDepartment as string}
                  handleSelect={handleDepartmentSelect}
                  comboboxList={comboboxList}
                  name={name}
                />
                {selectedDepartment === "supply-chain" && (
                  <div className="w-full pt-5 border-t">
                    <CarouselAreas
                      setSelectedArea={
                        handleAreaSelect as (area: string | null) => void
                      }
                    />
                  </div>
                )}
                <Button
                  className="mt-5 w-full"
                  variant="outline"
                  onClick={() => {
                    setSelectedDepartment(""); // Deseleccionar el departamento
                    setSelectedArea(""); // Deseleccionar el área
                    setSelectedValue(""); // Deseleccionar el valor seleccionado del combobox
                    onChange?.(null); // Llamar a onChange con null para reflejar los cambios
                    // setOpen(false); // Cerrar el Drawer
                    // setIsSheetOpen?.(false); // Cerrar el Sheet
                  }}>
                  Deseleccionar
                </Button>
              </>
            ) : (
              <ComboboxContent
                selectedValue={selectedValue}
                handleSelect={handleSelect}
                comboboxList={comboboxList}
                name={name}
              />
            )}
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
