// _hooks/useDepartmentSelection.ts
import { create } from "zustand";

interface AreaSelectionState {
  selectedArea: string | null; // Cambiar a string | undefined
  setSelectedArea: (area: string | null) => void;
}

const useAreaSelection = create<AreaSelectionState>((set) => ({
  selectedArea: null,
  setSelectedArea: (area) => set({ selectedArea: area }),
}));

export default useAreaSelection;
