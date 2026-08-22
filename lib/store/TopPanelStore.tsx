
import { create } from 'zustand';
import type { ReactNode } from 'react';

interface TopPanelState {
  action: ReactNode | null;
  setPageTitle: (title: String | null) => void;
  setAction: (node: ReactNode | null) => void;
  setBreadCrumbs: (state: Boolean) => void;
  setIsNested: (state: Boolean) => void;
  reset: () => void;
  pagetitle: String | null;
  showBreadCrumbs: Boolean;
  isNested: Boolean;
}

export const useTopPanelStore = create<TopPanelState>((set) => ({
  action: null,
  pagetitle: null,
  showBreadCrumbs: false,
  isNested: false,
  setIsNested: (state) => set({ isNested: state }),
  setPageTitle: (title) => set({ pagetitle: title }),
  setAction: (node) => set({ action: node }),
  setBreadCrumbs: (state) => set({ showBreadCrumbs: state }),
  reset: () => set({
    action: null,
    pagetitle: null,
    showBreadCrumbs: false,
    isNested: false
  }),
}));