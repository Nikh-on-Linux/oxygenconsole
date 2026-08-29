import { apiClient } from "./client";
import { BaseApiResponse } from "../types/base";

export async function moveFile(filename: string, sourcePath: string, destinationPath: string,): Promise<BaseApiResponse> {

    const response = await apiClient.post(`/user/move/file/${encodeURIComponent(filename)}`,{
        sourcePath:sourcePath,
        destinationPath:destinationPath
    })

    return response.data
}