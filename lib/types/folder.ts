export interface Folder {
  folder_id: string;
  folder_name: string;
}

export interface File {
  file_id: string;
  file_name: string;
}

export interface FolderContents {
  folders: Folder[];
  files: File[];
}