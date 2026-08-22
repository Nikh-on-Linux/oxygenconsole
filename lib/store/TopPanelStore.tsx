
import { create } from 'zustand';
import type { ReactNode } from 'react';

interface TopPanelState {
  action: ReactNode | null;
  setAction: (node: ReactNode | null) => void;
  resetAction: () => void;
}

export const useTopPanelStore = create<TopPanelState>((set) => ({
  action: null,

  setAction: (node) => set({ action: node }),
  resetAction: () => set({ action: null }),
}));