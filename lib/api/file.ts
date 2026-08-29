import { apiClient } from "./client";
import { BaseApiResponse } from "../types/base";

export async function moveFile(filename: string, sourcePath: string, destinationPath: string,): Promise<BaseApiResponse> {

    const response = await apiClient.post(`/user/move/file/${encodeURIComponent(filename)}`,{
        sourcePath:sourcePath,
        destinationPath:destinationPath
    })

    return response.data
}

export async function deleteFile(filename:string, path:string): Promise<BaseApiResponse>{
    console.log(filename,path)
    const reponse = await apiClient.delete(`/user/file/${filename}`,{
        data:{
            path:path
        }
    })

    return reponse.data;
}