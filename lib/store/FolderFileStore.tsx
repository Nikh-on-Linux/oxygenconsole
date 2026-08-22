import { create } from 'zustand';
import { getFolderContents } from '@/lib/api/folders';

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
}

interface FileState {
  items: FileItem[];
  isLoading: boolean;
  error: string | null;
  fetchFolder: (folderId: string) => Promise<void>;
}

export const useFileStore = create<FileState>((set) => ({
  items: [],
  isLoading: false,
  error: null,

  fetchFolder: async (folderId) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getFolderContents(folderId);
      set({ items: data.items, isLoading: false });
    } catch (err) {
      set({ error: (err as Error).message, isLoading: false });
    }
  },
}));