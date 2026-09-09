import { BaseApiResponse } from "./base";

export interface Folder extends BaseApiResponse {
  folder_id: string;
  folder_name: string;
}

export interface File extends BaseApiResponse {
  file_id: string;
  filename: string;
  mimetype:string;
  encoding:string;
}

export interface FolderContents extends BaseApiResponse {
  folders: Folder[];
  files: File[];
}