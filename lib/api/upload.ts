import { apiClient } from "@/lib/api/client";
import http from "http";
import https from "https";

export interface BaseApiResponse{
    message?:string;
    suc?:boolean;
}

export interface InitUploadResponse extends BaseApiResponse {
    upload_id?: string;

}

export interface UploadStatusResponse extends BaseApiResponse {
    information: Array<any>;
    status: string;
}

export interface CompleteUploadResponse extends BaseApiResponse {}

export interface ChunkInformation{
    upload_id:string;
    part_number:number;
    size:number;
    file_path:string;
    uploaded_at:string;
}

export interface ChunkStatusResponse extends BaseApiResponse{
    data:ChunkInformation[]
}

/**
 * Initialize a new upload.
 */
export async function initUpload(params: {
    filename: string;
    mimetype: string;
    size: number;
    pathname: string;
    totalChunks: number;
    chunkSize: number;
}): Promise<InitUploadResponse> {
    const response = await apiClient.post<InitUploadResponse>(
        "/upload/init",
        params
    );

    return response.data;
}

/**
 * Upload a single chunk.
 */
export async function uploadChunk(
    uploadId: string,
    index: number,
    chunk: Blob,
    signal?: AbortSignal
): Promise<BaseApiResponse> {
    const response = await apiClient.put(
        `/upload/${encodeURIComponent(uploadId)}/parts/${index}`,
        chunk,
        {
            signal,
            timeout: 120_000,
            headers: {
                "Content-Type": "application/octet-stream",
                "Content-Length": chunk.size
            },
            httpAgent: new http.Agent({ keepAlive: true }),
            httpsAgent: new https.Agent({ keepAlive: true }),
            maxBodyLength: Infinity,
            maxContentLength: Infinity
        }
    );

    return response.data;
} 
// Need to check http keep alive parameter;

/**
 * Get the current upload status.
 */
export async function getUploadStatus(
    status: string
): Promise<UploadStatusResponse> {
    const response =
        await apiClient.get<UploadStatusResponse>(
            `/upload/info/${encodeURIComponent(status)}`
        );

    return response.data;
}

/**
 * Complete an upload after all chunks have been uploaded.
 */
export async function completeUpload(
    uploadId: string,
    fileHash: string
): Promise<CompleteUploadResponse> {
    const response =
        await apiClient.post<CompleteUploadResponse>(
            `/upload/${encodeURIComponent(uploadId)}/complete/${encodeURIComponent(fileHash)}`,
        );

    return response.data;
}

/**
 * Get pending upload chunk status
 */
export async function getChunkStatus(uploadId: string): Promise<
    ChunkStatusResponse
> {
    const response =
        await apiClient.get<ChunkStatusResponse>(
            `/upload/info/chunks/${encodeURIComponent(uploadId)}`
        );
    console.log(response.data);
    return response.data;
}