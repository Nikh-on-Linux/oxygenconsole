"use client"

import { useRef } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  CloudUploadIcon,
  FileIcon,
  PauseIcon,
  PlusIcon,
  XIcon,
} from "lucide-react"

import { useUploadStore } from "@/lib/store/uploadstore"
import { useTopPanelStore } from "@/lib/store/TopPanelStore"

function UploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null)

  const currentPath = useTopPanelStore((s) => s.currentPath)

  const {
    reset,
    startUpload,
    pauseUpload,
    uploadedChunks,
    totalChunks,
    isPaused,
    file,
    filename,
    error,
    status,
    selectFile,
  } = useUploadStore()

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const selectedFile = e.target.files?.[0]

    if (!selectedFile) return

    selectFile(selectedFile)
  }

  function handleStartUpload() {
    if (!file) return
    pauseUpload(false);
    startUpload(file, currentPath)
  }

  function removeInputFile() {
    reset()

    if (inputFileRef.current) {
      inputFileRef.current.value = ""
    }
  }

  const progress =
    totalChunks > 0
      ? uploadedChunks.length / totalChunks
      : 0

  const needsReselect =
    status === "paused" && !file

  return (
    <section className="w-full px-4 flex items-center justify-center overflow-y-auto">
      <div className="lg:max-w-[60rem] w-full aspect-video flex items-center justify-center border-border border-2 border-dashed rounded-lg">

        {!filename ? (
          <>
            <input
              type="file"
              className="hidden"
              ref={inputFileRef}
              onChange={handleInputChange}
            />

            <Button
              variant="default"
              onClick={() => inputFileRef.current?.click()}
            >
              <PlusIcon />
              <span>Browse File</span>
            </Button>
          </>
        ) : (
          <div className="flex flex-col gap-5">

            <div className="flex rounded-md items-center justify-center gap-2 bg-accent px-3 py-1.5 border border-border">
              <FileIcon className="w-4" />

              <span className="font-sans lg:max-w-[20rem] max-w-[8rem] line-clamp-1">
                {filename}
              </span>

              <Separator orientation="vertical" />

              <XIcon
                onClick={removeInputFile}
                className="w-4 cursor-pointer hover:text-accent-foreground/70 rounded-full aspect-square"
              />
            </div>

            <span className="text-sm text-center text-muted-foreground">
              {Math.round(progress * 100)}% — {status}
              {error ? ` — ${error}` : ""}
            </span>

            {needsReselect ? (
              <p className="text-xs text-center text-muted-foreground">
                Reselect this file to resume from{" "}
                {Math.round(progress * 100)}%.
              </p>
            ) : (
              <div className="flex gap-2 mx-auto">
                {status === "uploading" ? (
                  <Button
                    onClick={() => pauseUpload(true)}
                  >
                    <PauseIcon />
                    <span>Pause</span>
                  </Button>
                ) : (
                  <Button
                    disabled={status === "completed"}
                    onClick={handleStartUpload}
                  >
                    <CloudUploadIcon />
                    <span>
                      {status === "paused"
                        ? "Resume"
                        : "Upload"}
                    </span>
                  </Button>
                )}
              </div>
            )}

          </div>
        )}
      </div>
    </section>
  )
}

export default UploadPage