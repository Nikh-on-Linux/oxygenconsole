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


  /*
   * Create a completely new upload.
   *
   * Returns the local upload ID.
   */
  selectFile: (
    file: File,
    pathname: string
  ) => string;


  /*
   * Attach a File object to an
   * existing persisted upload.
   */
  attachFile: (
    id: string,
    file: File
  ) => void;


  /*
   * Start/resume ONE upload.
   */
  startUpload: (
    id: string
  ) => Promise<void>;


  /*
   * Queue MULTIPLE uploads.
   */
  startUploads: (
    ids: string[]
  ) => void;


  /*
   * Pause/resume one upload.
   */
  pauseUpload: (
    id: string,
    state: boolean
  ) => void;


  /*
   * Cancel one upload.
   */
  cancelUpload: (
    id: string
  ) => Promise<void>;


  /*
   * Remove one upload.
   */
  reset: (
    id: string
  ) => void;


  /*
   * Generic state updater.
   */
  updateUpload: (
    id: string,
    updates: Partial<UploadItem>
  ) => void;
}


/*
 * ============================================================
 * CLIENT-SIDE UPLOAD SCHEDULER
 * ============================================================
 */


/*
 * Maximum number of files that can be
 * uploading at the same time.
 */
const MAX_CONCURRENT_UPLOADS = 3;


/*
 * Uploads that are currently executing
 * startUpload().
 */
const runningUploads =
  new Set<string>();


/*
 * Uploads waiting for an available slot.
 */
const queuedUploads =
  new Set<string>();


/*
 * Number of uploads currently occupying
 * scheduler slots.
 */
let activeUploadCount = 0;


/*
 * ============================================================
 * Upload Queue
 * ============================================================
 *
 * Starts queued uploads until all available
 * concurrency slots are occupied.
 */
const drainUploadQueue = () => {

  while (
    activeUploadCount <
    MAX_CONCURRENT_UPLOADS
  ) {

    /*
     * Get the first queued upload.
     *
     * Set preserves insertion order,
     * effectively giving us FIFO behavior.
     */
    const nextId =
      Array.from(
        queuedUploads
      )[0];


    /*
     * Nothing left in the queue.
     */
    if (!nextId) {
      return;
    }


    /*
     * Remove from queue before starting.
     */
    queuedUploads.delete(
      nextId
    );


    /*
     * It might have been started by
     * another operation.
     */
    if (
      runningUploads.has(nextId)
    ) {
      continue;
    }


    /*
     * Consume one scheduler slot.
     */
    activeUploadCount++;


    /*
     * Start the upload.
     *
     * Do NOT await here.
     *
     * This allows up to three files
     * to execute simultaneously.
     */
    void useUploadStore
      .getState()
      .startUpload(nextId)
      .finally(() => {

        /*
         * Release scheduler slot.
         */
        activeUploadCount--;


        /*
         * Try to start another queued
         * upload immediately.
         */
        drainUploadQueue();
      });
  }
};


export const useUploadStore =
  create<Store>()(

    persist(

      (set, get) => ({

        uploads: [],


        /*
         * ====================================================
         * SELECT FILE
         * ====================================================
         */
        selectFile: (
          file: File,
          pathname: string
        ) => {

          /*
           * Local ID.
           *
           * This ID identifies the upload
           * inside the browser.
           */
          const id =
            crypto.randomUUID();


          const upload: UploadItem = {

            id,


            chunkSize:
              1024 * 1024,


            totalChunks:
              0,


            uploadedChunks:
              [],


            failedChunks:
              [],


            uploadId:
              undefined,


            isPaused:
              false,


            error:
              null,


            filename:
              file.name,


            file,


            pathname,


            totalSize:
              file.size,


            status:
              "pending",
          };


          set((state) => ({

            uploads: [
              ...state.uploads,
              upload,
            ],

          }));


          /*
           * The caller needs this ID
           * to queue the upload.
           */
          return id;
        },


        /*
         * ====================================================
         * ATTACH FILE
         * ====================================================
         *
         * Used after page refresh/revisit.
         */
        attachFile: (
          id: string,
          file: File
        ) => {

          const upload =
            get().uploads.find(
              (item) =>
                item.id === id
            );


          if (!upload) {
            return;
          }


          /*
           * Make sure the newly selected
           * file matches the original file.
           */
          if (
            file.name !==
              upload.filename ||

            file.size !==
              upload.totalSize
          ) {

            set((state) => ({

              uploads:
                state.uploads.map(
                  (item) =>
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


          /*
           * Reattach the File object.
           */
          set((state) => ({

            uploads:
              state.uploads.map(
                (item) =>
                  item.id === id
                    ? {

                        ...item,

                        file,

                        error:
                          null,

                        isPaused:
                          false,

                        status:
                          "paused",

                      }
                    : item
              ),

          }));
        },


        /*
         * ====================================================
         * GENERIC UPDATE
         * ====================================================
         */
        updateUpload: (
          id: string,
          updates:
            Partial<UploadItem>
        ) => {

          set((state) => ({

            uploads:
              state.uploads.map(
                (upload) =>
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
         * ====================================================
         * START MULTIPLE UPLOADS
         * ====================================================
         */
        startUploads: (
          ids: string[]
        ) => {

          /*
           * Read current uploads once.
           */
          const uploads =
            get().uploads;


          for (
            const id of ids
          ) {

            const upload =
              uploads.find(
                (item) =>
                  item.id === id
              );


            /*
             * Upload no longer exists.
             */
            if (!upload) {
              continue;
            }


            /*
             * Already running.
             */
            if (
              runningUploads.has(id)
            ) {
              continue;
            }


            /*
             * Already waiting.
             */
            if (
              queuedUploads.has(id)
            ) {
              continue;
            }


            /*
             * Don't automatically start
             * completed uploads.
             */
            if (
              upload.status ===
                "completed"
            ) {
              continue;
            }


            /*
             * Don't automatically restart
             * canceled uploads.
             */
            if (
              upload.status ===
                "canceled"
            ) {
              continue;
            }


            /*
             * Add to FIFO queue.
             */
            queuedUploads.add(id);
          }


          /*
           * Fill all available slots.
           */
          drainUploadQueue();
        },


        /*
         * ====================================================
         * PAUSE / RESUME
         * ====================================================
         */
        pauseUpload: (
          id: string,
          state: boolean
        ) => {

          const upload =
            get().uploads.find(
              (item) =>
                item.id === id
            );


          if (!upload) {
            return;
          }


          /*
           * ==================================================
           * PAUSE
           * ==================================================
           */
          if (state) {

            /*
             * If the upload hasn't started yet,
             * remove it from the waiting queue.
             */
            queuedUploads.delete(id);


            set((current) => ({

              uploads:
                current.uploads.map(
                  (item) =>
                    item.id === id
                      ? {

                          ...item,

                          isPaused:
                            true,

                        }
                      : item
                ),

            }));


            return;
          }


          /*
           * ==================================================
           * RESUME
           * ==================================================
           */
          set((current) => ({

            uploads:
              current.uploads.map(
                (item) =>
                  item.id === id
                    ? {

                        ...item,

                        isPaused:
                          false,

                      }
                    : item
              ),

          }));


          /*
           * If it isn't currently running,
           * place it back in the queue.
           */
          if (
            !runningUploads.has(id)
          ) {

            queuedUploads.add(id);

            drainUploadQueue();
          }
        },


        /*
         * ====================================================
         * START ONE UPLOAD
         * ====================================================
         *
         * The scheduler controls HOW MANY of
         * these can execute simultaneously.
         *
         * This function itself still handles
         * exactly ONE file.
         */
        startUpload: async (
          id: string
        ) => {

          /*
           * Prevent duplicate execution
           * of the same upload.
           */
          if (
            runningUploads.has(id)
          ) {
            return;
          }


          const initialUpload =
            get().uploads.find(
              (item) =>
                item.id === id
            );


          if (!initialUpload) {
            return;
          }


          /*
           * File objects are lost after
           * persistence/reload.
           */
          if (
            !initialUpload.file
          ) {

            get().updateUpload(
              id,
              {

                status:
                  "needs-file",

                error:
                  "Please select the original file to resume.",

              }
            );


            return;
          }


          /*
           * Mark upload as running.
           */
          runningUploads.add(id);


          try {

            /*
             * Always retrieve the latest state.
             */
            const uploadAtStart =
              get().uploads.find(
                (item) =>
                  item.id === id
              );


            if (
              !uploadAtStart?.file
            ) {
              return;
            }


            const file =
              uploadAtStart.file;


            const pathname =
              uploadAtStart.pathname;


            const chunkSize =
              uploadAtStart.chunkSize;


            const totalChunks =
              Math.ceil(
                file.size /
                chunkSize
              );


            /*
             * Preserve uploadedChunks.
             *
             * This is important for resume.
             */
            get().updateUpload(
              id,
              {

                totalChunks,

                status:
                  "uploading",

                error:
                  null,

                isPaused:
                  false,

              }
            );


            /*
             * =================================================
             * INITIALIZE UPLOAD
             * =================================================
             */
            let currentUploadId =
              get().uploads.find(
                (item) =>
                  item.id === id
              )?.uploadId;


            /*
             * Only initialize a new server
             * upload if we don't already
             * have an uploadId.
             */
            if (
              !currentUploadId
            ) {

              const response:
                InitUploadResponse =
                await initUpload({

                  filename:
                    file.name,

                  size:
                    file.size,

                  mimetype:
                    file.type,

                  pathname,

                  chunkSize,

                  totalChunks,

                });


              if (
                !response.suc
              ) {

                get().updateUpload(
                  id,
                  {

                    status:
                      "failed",

                    error:
                      "Unable to fetch uploadid",

                  }
                );


                return;
              }


              currentUploadId =
                response.upload_id;


              get().updateUpload(
                id,
                {

                  uploadId:
                    currentUploadId,

                }
              );
            }


            /*
             * =================================================
             * UPLOAD CHUNKS
             * =================================================
             */
            for (
              let i = 0;
              i < totalChunks;
              i++
            ) {

              const current =
                get().uploads.find(
                  (item) =>
                    item.id === id
                );


              if (!current) {
                return;
              }


              /*
               * Pause is checked before
               * starting the next chunk.
               *
               * The current chunk is
               * never interrupted.
               */
              if (
                current.isPaused
              ) {

                get().updateUpload(
                  id,
                  {

                    status:
                      "paused",

                  }
                );


                return;
              }


              /*
               * Skip chunks that were already
               * successfully uploaded.
               */
              if (
                current.uploadedChunks
                  .includes(i)
              ) {

                continue;
              }


              const start =
                i *
                chunkSize;


              const end =
                Math.min(
                  start +
                    chunkSize,

                  file.size
                );


              const chunk =
                file.slice(
                  start,
                  end
                );


              /*
               * Upload one chunk.
               */
              const response =
                await uploadChunk(
                  currentUploadId,
                  i,
                  chunk
                );


              /*
               * Chunk failed.
               */
              if (
                !response.suc
              ) {

                const latest =
                  get().uploads.find(
                    (item) =>
                      item.id === id
                  );


                if (!latest) {
                  return;
                }


                /*
                 * Avoid duplicate failed
                 * chunk entries.
                 */
                const failedChunks =
                  latest.failedChunks
                    .includes(i)
                    ? latest.failedChunks
                    : [
                        ...latest.failedChunks,
                        i,
                      ];


                get().updateUpload(
                  id,
                  {

                    failedChunks,

                    status:
                      "failed",

                    error:
                      "Chunk failed to upload.",

                  }
                );


                return;
              }


              /*
               * Get latest state after
               * successful chunk upload.
               */
              const latest =
                get().uploads.find(
                  (item) =>
                    item.id === id
                );


              if (!latest) {
                return;
              }


              /*
               * Add chunk only once.
               */
              if (
                !latest.uploadedChunks
                  .includes(i)
              ) {

                get().updateUpload(
                  id,
                  {

                    uploadedChunks:
                      [
                        ...latest.uploadedChunks,
                        i,
                      ],

                    failedChunks:
                      latest.failedChunks
                        .filter(
                          (chunk) =>
                            chunk !== i
                        ),

                  }
                );
              }
            }


            /*
             * =================================================
             * VERIFY CHUNKS
             * =================================================
             */
            const finalUpload =
              get().uploads.find(
                (item) =>
                  item.id === id
              );


            if (!finalUpload) {
              return;
            }


            if (
              finalUpload
                .uploadedChunks
                .length !==
              totalChunks
            ) {

              get().updateUpload(
                id,
                {

                  status:
                    "failed",

                  error:
                    "Not all chunks were uploaded.",

                }
              );


              return;
            }


            /*
             * =================================================
             * CREATE WHOLE-FILE SHA256
             * =================================================
             */
            const hasher =
              await createSHA256();


            /*
             * Make sure chunks are hashed
             * in their original order.
             */
            const uploadedChunks =
              [
                ...finalUpload.uploadedChunks,
              ].sort(
                (a, b) =>
                  a - b
              );


            for (
              const chunkIndex
              of uploadedChunks
            ) {

              const start =
                chunkIndex *
                chunkSize;


              const end =
                Math.min(
                  start +
                    chunkSize,

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


            /*
             * =================================================
             * COMPLETE UPLOAD
             * =================================================
             */
            const completeResponse:
              CompleteUploadResponse =
              await completeUpload(
                currentUploadId,
                fileHash
              );


            if (
              completeResponse.suc
            ) {

              get().updateUpload(
                id,
                {

                  status:
                    "completed",

                  isPaused:
                    false,

                }
              );


              return;
            }


            get().updateUpload(
              id,
              {

                status:
                  "failed",

                error:
                  "Unable to complete upload.",

              }
            );

          } catch (
            err: unknown
          ) {

            get().updateUpload(
              id,
              {

                status:
                  "failed",

                error:
                  err instanceof Error
                    ? err.message
                    : "Unknown upload error.",

              }
            );

          } finally {

            /*
             * This only controls the
             * per-upload running state.
             *
             * The scheduler separately
             * releases its slot in .finally().
             */
            runningUploads.delete(id);
          }
        },


        /*
         * ====================================================
         * CANCEL UPLOAD
         * ====================================================
         */
        cancelUpload: async (
          id: string
        ) => {

          /*
           * If it is still waiting in the
           * queue, prevent it from starting.
           */
          queuedUploads.delete(id);


          const upload =
            get().uploads.find(
              (item) =>
                item.id === id
            );


          if (!upload) {
            return;
          }


          /*
           * If server initialization hasn't
           * happened yet, there is nothing
           * to cancel on the server.
           */
          if (
            !upload.uploadId
          ) {

            get().reset(id);

            return;
          }


          try {

            const response =
              await cancelUploadRequest(
                upload.uploadId
              );


            if (
              !response.suc
            ) {

              get().updateUpload(
                id,
                {

                  error:
                    response.message ||
                    "Unable to cancel upload.",

                }
              );


              return;
            }


            /*
             * Server cancellation succeeded.
             */
            get().reset(id);

          } catch (
            err: unknown
          ) {

            get().updateUpload(
              id,
              {

                error:
                  err instanceof Error
                    ? err.message
                    : "Unable to cancel upload.",

              }
            );
          }
        },


        /*
         * ====================================================
         * RESET
         * ====================================================
         */
        reset: (
          id: string
        ) => {

          /*
           * Remove from waiting queue.
           */
          queuedUploads.delete(id);


          /*
           * Remove local upload record.
           *
           * persist() will consequently
           * remove it from localStorage.
           */
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
        name:
          "oxygen-upload-information",


        /*
         * ====================================================
         * PERSISTENCE
         * ====================================================
         *
         * File objects cannot be persisted.
         */
        partialize:
          (state) => ({

            uploads:
              state.uploads.map(
                (upload) => ({

                  ...upload,

                  file:
                    null,

                })
              ),

          }),


        /*
         * ====================================================
         * REHYDRATION
         * ====================================================
         */
        onRehydrateStorage:
          () => {

            return (
              state
            ) => {

              if (!state) {
                return;
              }


              const uploads =
                state.uploads.map(
                  (upload) => {

                    /*
                     * Every unfinished upload
                     * needs its original File
                     * object attached again.
                     */
                    if (
                      upload.status !==
                        "completed" &&

                      upload.status !==
                        "canceled"
                    ) {

                      return {

                        ...upload,

                        file:
                          null,

                        status:
                          "needs-file",

                        isPaused:
                          true,

                      };
                    }


                    return upload;
                  }
                );


              state.uploads =
                uploads;
            };
          },
      }
    )
  );