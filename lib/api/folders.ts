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

export async function createNewFolder(pathstring: string){
  let path = ""
  pathstring == "/" ? path = "/" : path=`/${pathstring}`
  console.log()
}