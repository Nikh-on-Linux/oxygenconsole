
import { create } from 'zustand';
import type { ReactNode } from 'react';

interface TopPanelState {
  action: ReactNode | null;
  setPageTitle: (title: String | null) => void;
  setAction: (node: ReactNode | null) => void;
  setBreadCrumbs: (state: Boolean) => void;
  setPathInfo: (pathstate: Array<any>) => void;
  setIsNested: (state: Boolean) => void;
  setBackPath: (path: String) => void;
  reset: () => void;
  pagetitle: String | null;
  showBreadCrumbs: Boolean;
  isNested: Boolean;
  backPath: String;
  currentPath: String;
}

interface PathSegmentInterface {
  segment:string,
  route:string,
  isCurrent:boolean
}

export const useTopPanelStore = create<TopPanelState>((set) => ({
  action: null,
  pagetitle: null,
  showBreadCrumbs: false,
  isNested: false,
  backPath: "",
  currentPath : "",
  setIsNested: (state) => set({ isNested: state }),
  setPageTitle: (title) => set({ pagetitle: title }),
  setAction: (node) => set({ action: node }),
  setBreadCrumbs: (state) => set({ showBreadCrumbs: state }),
  setBackPath: (path)=>set({backPath:path}),
  setPathInfo: (pathstate) => {
    let path = "";
    pathstate.forEach((segment:PathSegmentInterface)=>{
      path += `/${segment.segment}`;
    })
    set({currentPath:path});
  },
  reset: () => set({
    action: null,
    pagetitle: null,
    showBreadCrumbs: false,
    isNested: false,
    backPath:"",
    currentPath: ""
  }),
}));