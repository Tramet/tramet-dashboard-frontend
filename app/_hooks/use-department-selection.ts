// _hooks/useDepartmentSelection.ts
import { create } from "zustand";

interface DepartmentSelectionState {
  selectedDepartment: string | null; // Cambiar a string | undefined
  setSelectedDepartment: (department: string | null) => void;
}

const useDepartmentSelection = create<DepartmentSelectionState>((set) => ({
  selectedDepartment: null,
  setSelectedDepartment: (department) =>
    set({ selectedDepartment: department }),
}));

export default useDepartmentSelection;
