import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  initUpload,
  uploadChunk,
  completeUpload,
  cancelUpload as cancelUploadRequest,
  InitUploadResponse,
  CompleteUploadResponse,
} from "@/lib/api/upload";
import { createSHA256 } from "hash-wasm";

type UploadStatus =
  | "pending"
  | "completed"
  | "uploading"
  | "retrying"
  | "failed"
  | "paused"
  | "needs-file"
  | "canceled";

export interface UploadItem {
  id: string;

  chunkSize: number;
  totalChunks: number;

  uploadedChunks: number[];
  failedChunks: number[];

  uploadId: string | undefined;

  isPaused: boolean;

  error: string | null;

  filename: string;
  file: File | null;

  pathname: string;
  totalSize: number;

  status: UploadStatus;
}

interface Store {
  uploads: UploadItem[];

  selectFile: (
    file: File,
    pathname: string
  ) => void;

  attachFile: (
    id: string,
    file: File
  ) => void;

  startUpload: (
    id: string
  ) => Promise<void>;

  pauseUpload: (
    id: string,
    state: boolean
  ) => void;

  cancelUpload: (
    id: string
  ) => Promise<void>;

  reset: (
    id: string
  ) => void;

  updateUpload: (
    id: string,
    updates: Partial<UploadItem>
  ) => void;
}


/*
 * Prevent two startUpload() calls from running
 * simultaneously for the same upload.
 *
 * This is runtime-only and is intentionally not persisted.
 */
const runningUploads = new Set<string>();


export const useUploadStore = create<Store>()(
  persist(
    (set, get) => ({

      uploads: [],


      /*
       * Create a completely NEW upload.
       */
      selectFile: (
        file: File,
        pathname: string
      ) => {

        const upload: UploadItem = {
          id: crypto.randomUUID(),

          chunkSize: 1024 * 1024,
          totalChunks: 0,

          uploadedChunks: [],
          failedChunks: [],

          uploadId: undefined,

          isPaused: false,

          error: null,

          filename: file.name,
          file,

          pathname,
          totalSize: file.size,

          status: "pending",
        };

        set((state) => ({
          uploads: [
            ...state.uploads,
            upload,
          ],
        }));
      },


      /*
       * Attach a newly selected File object to an
       * EXISTING persisted upload.
       *
       * This is used after refresh/revisit.
       */
      attachFile: (
        id: string,
        file: File
      ) => {

        const upload = get().uploads.find(
          (item) => item.id === id
        );

        if (!upload) return;


        /*
         * Make sure the selected file is actually
         * the same file as the original upload.
         */
        if (
          file.name !== upload.filename ||
          file.size !== upload.totalSize
        ) {

          set((state) => ({
            uploads: state.uploads.map((item) =>
              item.id === id
                ? {
                    ...item,
                    error:
                      "Selected file does not match the original file.",
                  }
                : item
            ),
          }));

          return;
        }


        set((state) => ({
          uploads: state.uploads.map((item) =>
            item.id === id
              ? {
                  ...item,
                  file,
                  error: null,
                  isPaused: false,
                  status: "paused",
                }
              : item
          ),
        }));
      },


      /*
       * Generic state updater.
       */
      updateUpload: (
        id: string,
        updates: Partial<UploadItem>
      ) => {

        set((state) => ({
          uploads: state.uploads.map((upload) =>
            upload.id === id
              ? {
                  ...upload,
                  ...updates,
                }
              : upload
          ),
        }));
      },


      /*
       * Pause / resume request.
       *
       * When pause=true, the current chunk is allowed
       * to finish. The upload loop checks isPaused
       * before starting the NEXT chunk.
       */
      pauseUpload: (
        id: string,
        state: boolean
      ) => {

        const upload = get().uploads.find(
          (item) => item.id === id
        );

        if (!upload) return;


        if (state) {

          set((current) => ({
            uploads: current.uploads.map((item) =>
              item.id === id
                ? {
                    ...item,
                    isPaused: true,
                  }
                : item
            ),
          }));

          return;
        }


        set((current) => ({
          uploads: current.uploads.map((item) =>
            item.id === id
              ? {
                  ...item,
                  isPaused: false,
                }
              : item
          ),
        }));
      },


      /*
       * Start / resume an upload.
       */
      startUpload: async (
        id: string
      ) => {

        if (runningUploads.has(id)) {
          return;
        }

        const initialUpload = get().uploads.find(
          (item) => item.id === id
        );

        if (!initialUpload) return;

        if (!initialUpload.file) {

          get().updateUpload(id, {
            status: "needs-file",
            error:
              "Please select the original file to resume.",
          });

          return;
        }


        runningUploads.add(id);


        try {

          const uploadAtStart =
            get().uploads.find(
              (item) => item.id === id
            );

          if (!uploadAtStart?.file) {
            return;
          }


          const file = uploadAtStart.file;

          const pathname =
            uploadAtStart.pathname;

          const chunkSize =
            uploadAtStart.chunkSize;


          const totalChunks =
            Math.ceil(
              file.size / chunkSize
            );


          /*
           * Keep the current upload state.
           * We do NOT reset uploadedChunks here.
           */
          get().updateUpload(id, {
            totalChunks,
            status: "uploading",
            error: null,
            isPaused: false,
          });


          /*
           * Use an existing server uploadId when
           * resuming. Only initialize when this is
           * actually a new upload.
           */
          let currentUploadId =
            get().uploads.find(
              (item) => item.id === id
            )?.uploadId;


          if (!currentUploadId) {

            const response: InitUploadResponse =
              await initUpload({
                filename: file.name,
                size: file.size,
                mimetype: file.type,
                pathname,
                chunkSize,
                totalChunks,
              });


            if (!response.suc) {

              get().updateUpload(id, {
                status: "failed",
                error:
                  "Unable to fetch uploadid",
              });

              return;
            }


            currentUploadId =
              response.upload_id;


            get().updateUpload(id, {
              uploadId: currentUploadId,
            });
          }


          /*
           * Upload missing chunks.
           */
          for (
            let i = 0;
            i < totalChunks;
            i++
          ) {

            const current =
              get().uploads.find(
                (item) => item.id === id
              );


            if (!current) {
              return;
            }


            /*
             * The current chunk is never
             * interrupted.
             *
             * Pause is checked BEFORE starting
             * the next chunk.
             */
            if (current.isPaused) {

              get().updateUpload(id, {
                status: "paused",
              });

              return;
            }


            /*
             * Resumability:
             * skip chunks already recorded
             * as uploaded locally.
             */
            if (
              current.uploadedChunks.includes(i)
            ) {
              continue;
            }


            const start =
              i * chunkSize;

            const end =
              Math.min(
                start + chunkSize,
                file.size
              );


            const chunk =
              file.slice(
                start,
                end
              );


            const response =
              await uploadChunk(
                currentUploadId,
                i,
                chunk
              );


            if (!response.suc) {

              get().updateUpload(id, {
                failedChunks: [
                  ...current.failedChunks,
                  i,
                ],
                status: "failed",
                error:
                  "Chunk failed to upload.",
              });

              return;
            }


            /*
             * Add the chunk only once.
             */
            get().updateUpload(id, {
              uploadedChunks:
                get()
                  .uploads
                  .find(
                    (item) =>
                      item.id === id
                  )
                  ?.uploadedChunks.includes(i)
                  ? get()
                      .uploads
                      .find(
                        (item) =>
                          item.id === id
                      )!
                      .uploadedChunks
                  : [
                      ...(get()
                        .uploads
                        .find(
                          (item) =>
                            item.id === id
                        )!
                        .uploadedChunks),
                      i,
                    ],

              failedChunks:
                get()
                  .uploads
                  .find(
                    (item) =>
                      item.id === id
                  )!
                  .failedChunks.filter(
                    (chunk) =>
                      chunk !== i
                  ),
            });
          }


          /*
           * Get the latest state after all chunks.
           */
          const finalUpload =
            get().uploads.find(
              (item) => item.id === id
            );


          if (!finalUpload) {
            return;
          }


          if (
            finalUpload.uploadedChunks.length !==
            totalChunks
          ) {

            get().updateUpload(id, {
              status: "failed",
              error:
                "Not all chunks were uploaded.",
            });

            return;
          }


          /*
           * Build the whole-file hash in the
           * correct chunk order.
           */
          const hasher =
            await createSHA256();


          const uploadedChunks = [
            ...finalUpload.uploadedChunks,
          ].sort(
            (a, b) => a - b
          );


          for (
            const chunkIndex
            of uploadedChunks
          ) {

            const start =
              chunkIndex * chunkSize;

            const end =
              Math.min(
                start + chunkSize,
                file.size
              );


            const hashChunk =
              await file
                .slice(
                  start,
                  end
                )
                .arrayBuffer();


            hasher.update(
              new Uint8Array(
                hashChunk
              )
            );
          }


          const fileHash =
            hasher.digest();


          const completeResponse:
            CompleteUploadResponse =
              await completeUpload(
                currentUploadId,
                fileHash
              );


          if (
            completeResponse.suc
          ) {

            get().updateUpload(id, {
              status: "completed",
              isPaused: false,
            });

            return;
          }


          get().updateUpload(id, {
            status: "failed",
            error:
              "Unable to complete upload.",
          });


        } catch (err: unknown) {

          get().updateUpload(id, {
            status: "failed",
            error:
              err instanceof Error
                ? err.message
                : "Unknown upload error.",
          });

        } finally {

          runningUploads.delete(id);
        }
      },


      /*
       * Cancel the server upload first.
       *
       * Only remove local persisted state when
       * cancellation succeeds.
       */
      cancelUpload: async (
        id: string
      ) => {

        const upload =
          get().uploads.find(
            (item) => item.id === id
          );


        if (!upload) return;


        if (!upload.uploadId) {

          get().reset(id);

          return;
        }


        try {

          const response =
            await cancelUploadRequest(
              upload.uploadId
            );


          if (!response.suc) {

            get().updateUpload(id, {
              error:
                response.message ||
                "Unable to cancel upload.",
            });

            return;
          }


          /*
           * Server cancellation succeeded.
           * Remove the upload from Zustand,
           * which also removes it from persisted
           * localStorage through persist().
           */
          get().reset(id);

        } catch (err: unknown) {

          get().updateUpload(id, {
            error:
              err instanceof Error
                ? err.message
                : "Unable to cancel upload.",
          });
        }
      },


      /*
       * Remove one upload from Zustand.
       *
       * Because the store uses persist(),
       * this also removes it from persistent memory.
       */
      reset: (
        id: string
      ) => {

        set((state) => ({
          uploads:
            state.uploads.filter(
              (upload) =>
                upload.id !== id
            ),
        }));
      },
    }),

    {
      name: "oxygen-upload-information",

      /*
       * IMPORTANT:
       *
       * File objects are NOT persisted.
       * Only metadata/state is stored.
       */
      partialize: (state) => ({
        uploads: state.uploads.map(
          (upload) => ({
            ...upload,
            file: null,
          })
        ),
      }),

      /*
       * After a refresh/revisit, every unfinished
       * upload needs the original File again.
       */
      onRehydrateStorage: () => {
        return (state) => {

          if (!state) return;


          const uploads =
            state.uploads.map(
              (upload) => {

                if (
                  upload.status !==
                    "completed" &&
                  upload.status !==
                    "canceled"
                ) {

                  return {
                    ...upload,
                    file: null,
                    status:
                      "needs-file" as const,
                    isPaused: true,
                  };
                }

                return upload;
              }
            );


          state.uploads = uploads;
        };
      },
    }
  )
);