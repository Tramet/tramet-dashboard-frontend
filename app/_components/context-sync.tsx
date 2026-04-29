"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useContextStore from "@trm/_hooks/use-context-store";

/**
 * Componente silencioso que sincroniza el contexto de Zustand/Cookies con la URL.
 * Esto permite que el contexto persista en la URL y sea compartible.
 */
export function ContextSync() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { 
    selectedSite, setSite, 
    selectedDepartment, setDepartment, 
    selectedArea, setArea 
  } = useContextStore();
  
  const isInitialMount = useRef(true);

  // 1. Sincronizar de URL a Store al cargar (solo si la URL tiene los parámetros)
  useEffect(() => {
    const urlSite = searchParams.get("site");
    const urlDept = searchParams.get("dept");
    const urlArea = searchParams.get("area");

    if (urlSite && urlSite !== selectedSite) setSite(urlSite);
    if (urlDept && urlDept !== selectedDepartment) setDepartment(urlDept);
    if (urlArea && urlArea !== selectedArea) setArea(urlArea);
    
    isInitialMount.current = false;
  }, []);

  // 2. Sincronizar de Store a URL cuando cambie el contexto
  useEffect(() => {
    if (isInitialMount.current) return;
    if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/admin")) return;

    const currentParams = new URLSearchParams(searchParams.toString());
    let changed = false;

    if (selectedSite) {
      if (currentParams.get("site") !== selectedSite) {
        currentParams.set("site", selectedSite);
        changed = true;
      }
    } else {
      if (currentParams.has("site")) {
        currentParams.delete("site");
        changed = true;
      }
    }

    if (selectedDepartment) {
      if (currentParams.get("dept") !== selectedDepartment) {
        currentParams.set("dept", selectedDepartment);
        changed = true;
      }
    } else {
      if (currentParams.has("dept")) {
        currentParams.delete("dept");
        changed = true;
      }
    }

    if (selectedArea) {
      if (currentParams.get("area") !== selectedArea) {
        currentParams.set("area", selectedArea);
        changed = true;
      }
    } else {
      if (currentParams.has("area")) {
        currentParams.delete("area");
        changed = true;
      }
    }

    if (changed) {
      const newQuery = currentParams.toString();
      const newUrl = `${pathname}${newQuery ? `?${newQuery}` : ""}`;
      router.replace(newUrl, { scroll: false });
    }
  }, [selectedSite, selectedDepartment, selectedArea, pathname, router]);

  return null;
}
