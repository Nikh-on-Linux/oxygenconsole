import { create } from "zustand";
import { getFolderContents } from "@/lib/api/folders";
import type { FolderContents } from "@/lib/types/folder";

interface FileState {
  items: FolderContents;
  isLoading: boolean;
  error: string | null;
  fetchFolder: (folderId: string) => Promise<void>;
}

const emptyFolderContents: FolderContents = {
  folders: [],
  files: [],
};

export const useFileStore = create<FileState>((set) => ({
  items: emptyFolderContents,
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
}));