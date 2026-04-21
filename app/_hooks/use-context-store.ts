import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";

interface ContextState {
  selectedSite: string | null;
  selectedDepartment: string | null;
  selectedArea: string | null;
  
  setSite: (site: string | null) => void;
  setDepartment: (dept: string | null) => void;
  setArea: (area: string | null) => void;
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
      selectedDepartment: null,
      selectedArea: null,

      setSite: (site) => set({ 
        selectedSite: site, 
        selectedDepartment: null, 
        selectedArea: null 
      }),
      
      setDepartment: (dept) => set({ 
        selectedDepartment: dept, 
        selectedArea: null 
      }),
      
      setArea: (area) => set({ 
        selectedArea: area 
      }),

      resetContext: () => set({ 
        selectedSite: null, 
        selectedDepartment: null, 
        selectedArea: null 
      }),
    }),
    {
      name: "tramet-context",
      storage: createJSONStorage(() => cookieStorage),
    }
  )
);

export default useContextStore;
