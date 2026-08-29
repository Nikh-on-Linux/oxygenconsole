import { create } from "zustand";
import { createNewFolder, getFolderContents } from "@/lib/api/folders";
import { moveFile } from "@/lib/api/file";
import type { FolderContents } from "@/lib/types/folder";
import { BaseApiResponse } from "../types/base";

interface FileState {
  items: FolderContents;
  isLoading: boolean;
  subLoading: boolean;
  subError: string | null;
  error: string | null;
  response: any | null;
  subResponse: BaseApiResponse;
  fetchFolder: (folderId: string) => Promise<void>;
  createFolder: (pathstring: String, foldername: String) => Promise<void>;
  moveFile: (filename: string, sourcePath: string, destinationPath: string) => Promise<void>;
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
  subLoading: false,
  subError: null,
  subResponse: {},

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
  },

  moveFile: async (filename: string, sourcePath: string, destinationPath: string) => {
    set({
      subLoading: true,
      subError: null
    })

    try {
      const response: BaseApiResponse = await moveFile(filename, sourcePath, destinationPath);

      if (!response.suc) {
        set({
          subLoading: false,
          subError: response.message
        })
        return;
      }

      set({
        subLoading: false,
        subResponse: { message: response.message }
      })
    }
    catch (err) {
      if (err instanceof Error) set({
        subLoading: false,
        subError: err.message
      })
    }
  }
}));