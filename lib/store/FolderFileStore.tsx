import { create } from "zustand";
import { createNewFolder, getFolderContents, setFolderName, moveFolderLocation, removeFolder } from "@/lib/api/folders";
import { moveFile, deleteFile, setFileName } from "@/lib/api/file";
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
  renameFolder: (foldername: string, sourcePath: string) => Promise<void>;
  moveFolder: (destinationPath: string, folderId: string) => Promise<void>;
  deleteFolder: (currentFolderPath: string) => Promise<void>;
  moveFile: (filename: string, sourcePath: string, destinationPath: string) => Promise<void>;
  deleteFile: (filename: string, sourcePath: string) => Promise<void>;
  renameFile: (filename: string, sourcePath: string, newName: string) => Promise<void>;
  resetItems: () => void;
  resetResponse: () => void;
  resetSubresponse : ()=>void;
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
  subResponse: { message: "", suc: false },

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
      subError: null,
      subResponse: {}
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
  },

  deleteFile: async (filename: string, sourcePath: string) => {
    set({
      subLoading: true,
      subError: null,
      subResponse: { message: "", suc: false }
    })
    try {
      const response: BaseApiResponse = await deleteFile(filename, sourcePath);

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
    catch (error) {
      if (error instanceof Error) {
        set({
          subError: error.message,
          subLoading: false
        })
      }
    }
  },

  renameFolder: async (foldername: string, sourcePath: string) => {
    set({
      subLoading: true,
      subError: null,
      subResponse: { message: "", suc: false }
    })
    const response = await setFolderName(foldername, sourcePath);
    set({
      subLoading: false,
      subResponse: { message: response.message, suc: response.suc }
    })
  },

  moveFolder: async (destinationPath: string, folderId: string) => {
    set({
      subLoading: true,
      subError: null,
      subResponse: { message: "", suc: false }
    })
    const res = await moveFolderLocation(destinationPath, folderId);
    set({
      subLoading: false,
      subResponse: { message: res.message, suc: res.suc }
    })
  },

  renameFile: async (filename: string, sourcePath: string, newName: string) => {
    set({
      subLoading: true,
      subError: null,
      subResponse: {}
    });

    const response = await setFileName(filename, sourcePath, newName);

    set({
      subLoading: false,
      subResponse: { message: response.message, suc: response.suc }
    })
  },

  resetItems: () => { set({ items: emptyFolderContents }) },

  resetResponse: () => { set({ response: null }) },

  deleteFolder: async (currentFolderPath: string) => {
    set({
      subLoading: true,
      subError: null,
      subResponse: {}
    })

    const response = await removeFolder(currentFolderPath);

    set({
      subLoading: false,
      subResponse: { message: response.message, suc: response.suc }
    })
  },

  resetSubresponse: ()=> {
    set({
      subResponse:{}
    })
  },
}));