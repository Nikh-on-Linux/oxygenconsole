import { create } from "zustand";

interface NavigationStore {
  backPath: string | null;

  setBackPath: (path: string) => void;
  clearBackPath: () => void;
}

export const useNavigationStore = create<NavigationStore>((set) => ({
  backPath: null,

  setBackPath: (path) =>
    set({
      backPath: path,
    }),

  clearBackPath: () =>
    set({
      backPath: null,
    }),
}));