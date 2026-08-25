"use client";

import {
  useRef,
  useState,
} from "react";

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment";

import { Progress } from "@/components/ui/progress";

import {
  FileIcon,
  PauseIcon,
  PlayIcon,
  XIcon,
} from "lucide-react";

import { useUploadStore } from "@/lib/store/uploadstore";


function UploadBar() {

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [
    selectingUploadId,
    setSelectingUploadId,
  ] = useState<string | null>(null);


  const uploads =
    useUploadStore(
      (state) => state.uploads
    );


  const startUpload =
    useUploadStore(
      (state) => state.startUpload
    );


  const pauseUpload =
    useUploadStore(
      (state) => state.pauseUpload
    );


  const attachFile =
    useUploadStore(
      (state) => state.attachFile
    );


  const cancelUpload =
    useUploadStore(
      (state) => state.cancelUpload
    );


  /*
   * Completed uploads are removed from the
   * visible floating UI.
   */
  const visibleUploads =
    uploads.filter(
      (upload) =>
        upload.status !== "completed" &&
        upload.status !== "canceled"
    );


  if (
    visibleUploads.length === 0
  ) {
    return null;
  }


  function openFileSelector(
    uploadId: string
  ) {

    setSelectingUploadId(
      uploadId
    );

    fileInputRef.current?.click();
  }


  function handleFileSelected(
    event:
      React.ChangeEvent<HTMLInputElement>
  ) {

    const file =
      event.target.files?.[0];


    if (
      !file ||
      !selectingUploadId
    ) {
      return;
    }


    /*
     * Attach the file to the EXISTING
     * upload rather than creating a new one.
     */
    attachFile(
      selectingUploadId,
      file
    );


    setSelectingUploadId(
      null
    );


    /*
     * Allows selecting the same file again
     * later.
     */
    event.target.value = "";
  }


  return (
    <>
      {/* Hidden file selector */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={
          handleFileSelected
        }
      />


      <div className="fixed bottom-10 right-5 z-50 flex flex-col gap-3">

        {visibleUploads.map(
          (upload) => {

            const progress =
              upload.totalChunks > 0
                ? Math.min(
                    (
                      upload.uploadedChunks
                        .length /
                      upload.totalChunks
                    ) * 100,
                    100
                  )
                : 0;


            return (
              <Attachment
                key={upload.id}
              >

                <AttachmentMedia>
                  <FileIcon />
                </AttachmentMedia>


                <AttachmentContent>

                  <AttachmentTitle>
                    {upload.filename}
                  </AttachmentTitle>


                  <Progress
                    value={progress}
                  />


                  <div className="text-xs text-muted-foreground mt-1">

                    {upload.status ===
                      "needs-file" &&
                      "Select file to resume"}

                    {upload.status ===
                      "pending" &&
                      "Ready to upload"}

                    {upload.status ===
                      "uploading" &&
                      `${Math.round(
                        progress
                      )}% uploading`}

                    {upload.status ===
                      "paused" &&
                      `${Math.round(
                        progress
                      )}% paused`}

                    {upload.status ===
                      "failed" &&
                      (upload.error ||
                        "Upload failed")}

                  </div>

                </AttachmentContent>


                <AttachmentActions className="ml-2">

                  {/* New upload */}
                  {upload.status ===
                    "pending" && (
                    <AttachmentAction
                      onClick={() =>
                        startUpload(
                          upload.id
                        )
                      }
                    >
                      <span className="px-1 text-sm font-medium">
                        Start
                      </span>
                    </AttachmentAction>
                  )}


                  {/* Uploading */}
                  {upload.status ===
                    "uploading" && (
                    <AttachmentAction
                      onClick={() =>
                        pauseUpload(
                          upload.id,
                          true
                        )
                      }
                    >
                      <PauseIcon />
                    </AttachmentAction>
                  )}


                  {/* Paused */}
                  {upload.status ===
                    "paused" && (
                    <AttachmentAction
                      onClick={() => {

                        pauseUpload(
                          upload.id,
                          false
                        );

                        startUpload(
                          upload.id
                        );
                      }}
                    >
                      <PlayIcon />
                    </AttachmentAction>
                  )}


                  {/* File lost after refresh */}
                  {upload.status ===
                    "needs-file" && (
                    <AttachmentAction
                      onClick={() =>
                        openFileSelector(
                          upload.id
                        )
                      }
                    >
                      <span className="px-1 text-sm font-medium">
                        Select
                      </span>
                    </AttachmentAction>
                  )}


                  {/* Failed but file is still available */}
                  {upload.status ===
                    "failed" &&
                    upload.file && (
                      <AttachmentAction
                        onClick={() =>
                          startUpload(
                            upload.id
                          )
                        }
                      >
                        <PlayIcon />
                      </AttachmentAction>
                    )}


                  {/* Cancel */}
                  <AttachmentAction
                    onClick={() =>
                      cancelUpload(
                        upload.id
                      )
                    }
                  >
                    <XIcon />
                  </AttachmentAction>

                </AttachmentActions>

              </Attachment>
            );
          }
        )}

      </div>
    </>
  );
}

export default UploadBar;