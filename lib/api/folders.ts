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