export interface Folder {
  folder_id: string;
  folder_name: string;
}

export interface File {
  file_id: string;
  filename: string;
  mimetype:string;
  encoding:string;
}

export interface FolderContents {
  folders: Folder[];
  files: File[];
}