import { BaseApiResponse } from '../types/base';
import { apiClient } from './client';

export async function getFolderContents(folderId: string) {
  // let path = "";
  // if (folderId == "/") {
  //   path = "/";
  // }
  // else {
  //   path = `/${folderId}`
  // }
  const res = await apiClient.post(`/user/directory`, {
    path: folderId
  });
  return res.data.data;
}

export async function createNewFolder(pathstring: String, foldername: String) {
  const res = await apiClient.post(`/user/createfolder/${foldername}`, {
    path: pathstring
  });
  return res.data;
}

export async function setFolderName(foldername: string, sourcePath: string): Promise<BaseApiResponse> {
  const res = await apiClient.post('/user/rename/folder', {
    newName: foldername,
    sourcePath: sourcePath
  })

  return res.data;
}

export async function moveFolderLocation(destinationPath: string, folderId: string): Promise<BaseApiResponse> {
  const res = await apiClient.post(`/user/move/folder/${encodeURIComponent(folderId)}`, {
    destinationPath
  });

  return res.data;
}

export async function removeFolder(currentFolderPath: string): Promise<BaseApiResponse> {
  const response = await apiClient.delete('/user/folder',{
    data:{
      path:currentFolderPath
    }
  })

  return response.data;
}