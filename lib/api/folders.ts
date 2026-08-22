import { apiClient } from './client';

export async function getFolderContents(folderId: string) {
  const res = await apiClient.get(`/myair/${folderId}`, {
    params: { includePath: true },
  });
  return res.data;
}