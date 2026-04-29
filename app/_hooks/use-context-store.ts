import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

interface ContextState {
  selectedSite: string | null;
  siteName: string | null;
  selectedDepartment: string | null;
  departmentName: string | null;
  selectedArea: string | null;
  areaName: string | null;
  
  setSite: (site: string | null, name?: string | null) => void;
  setDepartment: (dept: string | null, name?: string | null) => void;
  setArea: (area: string | null, name?: string | null) => void;
  updateNames: (siteName?: string, deptName?: string, areaName?: string) => void;
  resetContext: () => void;
}

// Almacenamiento personalizado en cookies para que el servidor pueda leerlo
const cookieStorage = {
  getItem: (name: string) => {
    return Cookies.get(name) || null;
  },
  setItem: (name: string, value: string) => {
    Cookies.set(name, value, { expires: 7, path: "/" });
  },
  removeItem: (name: string) => {
    Cookies.remove(name, { path: "/" });
  },
};

export const useContextStore = create<ContextState>()(
  persist(
    (set) => ({
      selectedSite: null,
      siteName: null,
      selectedDepartment: null,
      departmentName: null,
      selectedArea: null,
      areaName: null,

      setSite: (site, name = null) => set({ 
        selectedSite: site, 
        siteName: name,
        selectedDepartment: null, 
        departmentName: null,
        selectedArea: null,
        areaName: null
      }),
      
      setDepartment: (dept, name = null) => set({ 
        selectedDepartment: dept, 
        departmentName: name,
        selectedArea: null,
        areaName: null
      }),
      
      setArea: (area, name = null) => set({ 
        selectedArea: area,
        areaName: name
      }),

      updateNames: (siteName, deptName, areaName) => set((state) => ({
        siteName: siteName !== undefined ? siteName : state.siteName,
        departmentName: deptName !== undefined ? deptName : state.departmentName,
        areaName: areaName !== undefined ? areaName : state.areaName,
      })),

      resetContext: () => set({ 
        selectedSite: null, 
        siteName: null,
        selectedDepartment: null, 
        departmentName: null,
        selectedArea: null,
        areaName: null
      }),
    }),
    {
      name: "tramet-context",
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);

export default useContextStore;
