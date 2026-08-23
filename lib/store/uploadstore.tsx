import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  initUpload,
  uploadChunk,
  getChunkStatus,
  getUploadStatus,
  completeUpload,
  InitUploadResponse,
  BaseApiResponse,
  CompleteUploadResponse
} from "@/lib/api/upload";
import { createSHA256 } from "hash-wasm";

interface Store {
  value: string;
  chunkSize: number;
  totalChunks: number;
  uploadedChunks: number[];
  failedChunks: number[];
  uploadId: string | undefined;
  isPaused: boolean;
  error: string | null;
  filename: string | null;
  file: File | null;
  pathname: string;
  totalSize: number;
  status: "pending" | "completed" | "uploading" | "retrying" | "failed" | "paused";
  setValue: (value: string) => void;
  startUpload: (file: File, pathname: string) => void;
  selectFile: (file: File) => void;
  pauseUpload: (state: boolean) => void;
  reset: () => void;
};

const initStore = {

}

export const useUploadStore = create<Store>()(
  persist(
    (set, get) => ({
      value: "",
      chunkSize: 1024,
      totalChunks: 0,
      uploadedChunks: [],
      failedChunks: [],
      isPaused: false,
      uploadId: undefined,
      error: null,
      status: "pending",
      file: null,
      filename: null,
      pathname: "",
      totalSize: 0,
      setValue: (value) => set({ value }),
      pauseUpload: (state: boolean) => set({ isPaused: state }),
      selectFile: (file: File) => {
        set({ filename: file.name, file });
      },
      reset: () => {
        set({
          value: "",
          chunkSize: 1024 * 1024,
          totalChunks: 0,
          uploadedChunks: [],
          failedChunks: [],
          isPaused: false,
          uploadId: undefined,
          error: null,
          status: "pending",
          file: null,
          filename: null,
          pathname: "",
          totalSize: 0,
        });
      },
      startUpload: async (file: File, pathname: string) => {

        try {
          if (!pathname || !file) return set({ error: "insufficient inputs" });
          console.log("Working");
          const isResuming =
            get().uploadId !== null &&
            get().filename === file.name &&
            get().totalSize === file.size &&
            get().pathname === pathname;

          // Calculate chunk size;

          const ChunkSize = get().chunkSize;
          const totalChunks = Math.ceil(file.size / ChunkSize);

          if (!isResuming) {
            set({
              filename: file.name,
              pathname,
              totalSize: file.size,
              totalChunks,
              uploadedChunks: [],
              failedChunks: [],
              uploadId: undefined,
              error: null,
              status: "pending",
            });
          }

          let currentUploadId = get().uploadId;

          if (currentUploadId == undefined) {
            const uploadInitResponse: InitUploadResponse = await initUpload({
              filename: file.name,
              size: file.size,
              mimetype: file.type,
              pathname,
              chunkSize: ChunkSize,
              totalChunks: totalChunks,
            })

            if (!uploadInitResponse.suc) {
              return set({
                error: "Unable to fetch uploadid",
                status: "failed",
              });
            }

            currentUploadId = uploadInitResponse.upload_id;

            set({
              uploadId: currentUploadId,
            });
          }

          set({ status: "uploading" });
          for (let i = 0; i < totalChunks; i++) {

            if (get().isPaused) {
              set({ status: "paused" });
              return;
            }


            // Already uploaded before reload
            if (get().uploadedChunks.includes(i)) {
              continue;
            }

            const startIndex = i * ChunkSize;
            const endIndex = Math.min(
              startIndex + ChunkSize,
              file.size
            );

            const chunk = file.slice(startIndex, endIndex);

            const uploadPart = await uploadChunk(
              `${currentUploadId}`,
              i,
              chunk
            );

            if (!uploadPart.suc) {
              set((state) => ({
                failedChunks: [
                  ...state.failedChunks,
                  i
                ],
                status: "failed",
              }));

              return;
            }

            set((state) => ({
              uploadedChunks: [
                ...state.uploadedChunks,
                i
              ],
            }));
          }

          if (get().failedChunks.length > 0) {
            set({ status: "retrying" });
            const failedChunks = get().failedChunks;
            for (let i = failedChunks[0]; i < failedChunks.length; i++) {
              if (get().isPaused) {
                return;
              }
              const startIndex = i * ChunkSize;
              const endIndex = startIndex + ChunkSize;
              const chunk = file.slice(startIndex, endIndex);
              const retryPart = await uploadChunk(
                `${currentUploadId}`,
                i,
                chunk
              );

              if (retryPart.suc) {
                set((state) => ({
                  failedChunks: state.failedChunks.filter(
                    (chunk) => chunk !== i
                  ),
                }));
                return
              }
            }
          }

          if (get().failedChunks.length > 0) {
            set({ error: "File cannot be uploaded", status: "failed" });
            return;
          }

          const hasher = await createSHA256();
          const uploadedChunks = [...get().uploadedChunks].sort((a, b) => a - b);

          for (const chunkIndex of uploadedChunks) {
            const start = chunkIndex * ChunkSize;
            const end = Math.min(start + ChunkSize, file.size);

            const hashChunk = await file
              .slice(start, end)
              .arrayBuffer();

            hasher.update(new Uint8Array(hashChunk));
          }

          const fileHash = hasher.digest();

          const completeUploadResponse: CompleteUploadResponse = await completeUpload(
            `${get().uploadId}`, fileHash
          )

          if (completeUploadResponse.suc) {
            set({ status: "completed" });
            return;
          }

          set({ status: "failed", error: "Unable to upload" });
        }
        catch (err: unknown) {
          if (err instanceof Error) {
            set({ status: "pending", error: err.message });
          }
        }
      }
    }),
    {
      name: "oxygen-upload-information",
    }
  )
);