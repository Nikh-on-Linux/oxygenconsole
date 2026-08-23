import { create } from "zustand";
import { createNewFolder, getFolderContents } from "@/lib/api/folders";
import type { FolderContents } from "@/lib/types/folder";

interface FileState {
  items: FolderContents;
  isLoading: boolean;
  error: string | null;
  response: any | null;
  fetchFolder: (folderId: string) => Promise<void>;
  createFolder: (pathstring: String, foldername: String) => Promise<void>;
}

const emptyFolderContents: FolderContents = {
  folders: [],
  files: [],
};

export const useFileStore = create<FileState>((set) => ({
  items: emptyFolderContents,
  response: null,
  isLoading: false,
  error: null,

  fetchFolder: async (folderId: string) => {
    set({
      isLoading: true,
      error: null,
    });

    try {
      const data = await getFolderContents(folderId);

      set({
        items: data,
        isLoading: false,
      });
    } catch (err: unknown) {
      set({
        error:
          err instanceof Error
            ? err.message
            : "Failed to fetch folder contents",
        isLoading: false,
      });
    }
  },
  createFolder: async (pathstring: String, foldername: String) => {
    set({
      isLoading: true,
      error: null
    })
    try {
      const data = await createNewFolder(pathstring, foldername);
      set({
        response: data,
        isLoading: false
      })
    }
    catch (error: unknown) {
      set({ error: error instanceof Error ? error.message : "Failed to create folder" })
    }
  }
}));