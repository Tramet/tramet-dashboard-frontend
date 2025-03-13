import { create } from "zustand";

interface SiteSelectionState {
  selectedSite: string | null;
  setSite: (site: string | null) => void;
}

const useSiteSelection = create<SiteSelectionState>((set) => ({
  selectedSite: null,
  setSite: (site) => set({ selectedSite: site }),
}));

export default useSiteSelection;
