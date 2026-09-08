"use client";

import React, { useEffect, useMemo, useState, useRef } from "react";
import { useParams } from "next/navigation";
import {
  DownloadIcon,
  FileIcon,
  Loader2,
  AlertCircle,
  ZoomInIcon,
  ZoomOutIcon,
  RotateCcwIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import { useTopPanelStore } from "@/lib/store/TopPanelStore";
import { apiClient } from "@/lib/api/client";
import { BaseApiResponse } from "@/lib/types/base";

/* -------------------------------------------------------------------------- */
/*                                   Types                                    */
/* -------------------------------------------------------------------------- */

interface FileInfo {
  object_name: string;
  filename: string;
  mimetype: string;
}

interface ApiResponse extends BaseApiResponse {
  data: FileInfo;
}

type ViewerType = "image" | "video" | "pdf" | "unsupported";

/* -------------------------------------------------------------------------- */
/*                              Helper Functions                              */
/* -------------------------------------------------------------------------- */

function getViewerType(mimetype: string): ViewerType {
  if (mimetype.startsWith("image/")) {
    return "image";
  }

  if (mimetype.startsWith("video/")) {
    return "video";
  }

  if (mimetype === "application/pdf") {
    return "pdf";
  }

  return "unsupported";
}

/* -------------------------------------------------------------------------- */
/*                              Loading Screen                                */
/* -------------------------------------------------------------------------- */

function LoadingViewer() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-6 w-6 animate-spin" />

        <span className="text-sm">
          Loading file...
        </span>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Error Screen                                  */
/* -------------------------------------------------------------------------- */

interface ErrorViewerProps {
  message?: string;
}

function ErrorViewer({
  message = "Unable to load this file.",
}: ErrorViewerProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex max-w-sm flex-col items-center gap-3 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>

        <p className="text-sm text-muted-foreground">
          {message}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Unsupported File                               */
/* -------------------------------------------------------------------------- */

interface UnsupportedViewerProps {
  filename: string;
  mimetype: string;
}

function UnsupportedViewer({
  filename,
  mimetype,
}: UnsupportedViewerProps) {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex max-w-md flex-col items-center gap-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-xl border bg-muted">
          <FileIcon className="h-8 w-8 text-muted-foreground" />
        </div>

        <div>
          <h2 className="text-sm font-medium">
            Preview not available
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            This file type cannot be previewed yet.
          </p>
        </div>

        <div className="rounded-md border bg-muted/50 px-3 py-2">
          <p className="max-w-sm truncate text-xs text-muted-foreground">
            {filename}
          </p>

          <p className="mt-1 text-xs text-muted-foreground/70">
            {mimetype}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Image Viewer                                 */
/* -------------------------------------------------------------------------- */

interface ImageViewerProps {
  src: string;
  filename: string;
}

interface ImageViewerProps {
  src: string;
  filename: string;
}

function ImageViewer({
  src,
  filename,
}: ImageViewerProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const [zoom, setZoom] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef<HTMLDivElement>(null);

  const dragStartRef = useRef({
    x: 0,
    y: 0,
    positionX: 0,
    positionY: 0,
  });

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 5;
  const ZOOM_STEP = 0.25;

  if (error) {
    return (
      <ErrorViewer message="The image could not be loaded." />
    );
  }

  function clampZoom(value: number) {
    return Math.min(
      MAX_ZOOM,
      Math.max(MIN_ZOOM, value)
    );
  }

  function zoomIn() {
    setZoom((current) =>
      clampZoom(current + ZOOM_STEP)
    );
  }

  function zoomOut() {
    setZoom((current) =>
      clampZoom(current - ZOOM_STEP)
    );
  }

  function resetView() {
    setZoom(1);
    setPosition({ x: 0, y: 0 });
  }

  function handleWheel(
    event: React.WheelEvent<HTMLDivElement>
  ) {
    event.preventDefault();

    const delta = event.deltaY > 0
      ? -ZOOM_STEP
      : ZOOM_STEP;

    setZoom((current) =>
      clampZoom(current + delta)
    );
  }

  function handlePointerDown(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (zoom <= 1) return;

    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    setIsDragging(true);

    dragStartRef.current = {
      x: event.clientX,
      y: event.clientY,
      positionX: position.x,
      positionY: position.y,
    };
  }

  function handlePointerMove(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    if (!isDragging) return;

    const deltaX =
      event.clientX - dragStartRef.current.x;

    const deltaY =
      event.clientY - dragStartRef.current.y;

    setPosition({
      x: dragStartRef.current.positionX + deltaX,
      y: dragStartRef.current.positionY + deltaY,
    });
  }

  function handlePointerUp(
    event: React.PointerEvent<HTMLDivElement>
  ) {
    setIsDragging(false);

    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    }
  }

  function handleDoubleClick() {
    if (zoom === 1) {
      setZoom(2);
    } else {
      resetView();
    }
  }

  return (
    <div className="relative flex w-full max-w-[80rem] overflow-hidden rounded-3xl bg-accent">

      {/* ------------------------------------------------------------------ */}
      {/* Loading                                                            */}
      {/* ------------------------------------------------------------------ */}

      {!loaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading image...
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Controls                                                           */}
      {/* ------------------------------------------------------------------ */}

      {loaded && (
        <div className="absolute left-1/2 top-4 z-30 flex -translate-x-1/2 items-center gap-1 rounded-xl border border-border/50 bg-background/70 p-1 shadow-lg backdrop-blur-sm">

          <button
            type="button"
            onClick={zoomOut}
            disabled={zoom <= MIN_ZOOM}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-30"
            aria-label="Zoom out"
          >
            <ZoomOutIcon className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={resetView}
            className="flex h-9 min-w-16 items-center justify-center rounded-lg px-2 text-xs font-medium transition-colors hover:bg-accent"
            aria-label="Reset zoom"
          >
            {Math.round(zoom * 100)}%
          </button>

          <button
            type="button"
            onClick={zoomIn}
            disabled={zoom >= MAX_ZOOM}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-30"
            aria-label="Zoom in"
          >
            <ZoomInIcon className="h-4 w-4" />
          </button>

          <div className="mx-1 h-5 w-px bg-border" />

          <button
            type="button"
            onClick={resetView}
            className="flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:bg-accent"
            aria-label="Reset view"
          >
            <RotateCcwIcon className="h-4 w-4" />
          </button>

        </div>
      )}

      {/* ------------------------------------------------------------------ */}
      {/* Image viewport                                                     */}
      {/* ------------------------------------------------------------------ */}

      <div
        ref={viewportRef}
        className={`
          relative flex h-full w-full items-center justify-center
          overflow-hidden
          touch-none
          select-none
          ${zoom > 1
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-default"
          }
        `}
        onWheel={handleWheel}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={src}
          alt={filename}
          draggable={false}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`
            max-h-full
            max-w-full
            select-none
            object-contain
            ${loaded
              ? "opacity-100"
              : "opacity-0"
            }
            ${isDragging
              ? ""
              : "transition-transform duration-200"
            }
          `}
          style={{
            transform: `
              translate3d(
                ${position.x}px,
                ${position.y}px,
                0
              )
              scale(${zoom})
            `,
            transformOrigin: "center center",
          }}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                               Video Viewer                                 */
/* -------------------------------------------------------------------------- */

interface VideoViewerProps {
  src: string;
  filename: string;
}

function VideoViewer({
  src,
  filename,
}: VideoViewerProps) {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <ErrorViewer message="The video could not be loaded." />
    );
  }

  return (
    <div className="flex aspect-auto w-full items-center justify-center max-w-[90rem] rounded-2xl overflow-hidden bg-black">
      <video
        src={src}
        controls
        playsInline
        preload="metadata"
        aria-label={filename}
        onError={() => setError(true)}
        className="
          h-full
          w-full
          object-contain
        "
      >
        Your browser does not support video playback.
      </video>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                PDF Viewer                                  */
/* -------------------------------------------------------------------------- */

interface PdfViewerProps {
  src: string;
  filename: string;
}

function PdfViewer({
  src,
  filename,
}: PdfViewerProps) {
  return (
    <div className="h-full w-full overflow-hidden">
      <iframe
        src={src}
        title={filename}
        className="h-full w-full border-0"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Main Component                                */
/* -------------------------------------------------------------------------- */

function MediaPage() {
  const { fileId } = useParams<{ fileId: string }>();

  const {
    setAction,
    setPageTitle,
    setIsNested,
    reset,
  } = useTopPanelStore();

  const [file, setFile] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  /* ------------------------------------------------------------------------ */
  /*                         Oxygen Server Base URL                           */
  /* ------------------------------------------------------------------------ */

  const oxygenUrl =
    process.env.NEXT_PUBLIC_OXYGEN_URL ?? "";

  /* ------------------------------------------------------------------------ */
  /*                            Fetch File Info                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!fileId) {
      return;
    }

    let cancelled = false;

    async function fetchFileInfo() {
      try {
        setLoading(true);
        setError(false);

        const response = await apiClient.get(
          `/stream/${fileId}`
        );

        const data: ApiResponse = response.data;

        if (!data.suc) {
          console.error(
            "Failed to load file:",
            data.message
          );

          if (!cancelled) {
            setError(true);
            toast.error("Failed to load file");
          }

          return;
        }

        if (cancelled) {
          return;
        }

        setFile(data.data);
        setPageTitle(data.data.filename);
      } catch (err) {
        console.error(
          "Failed to fetch file information:",
          err
        );

        if (!cancelled) {
          setError(true);
          toast.error("Failed to load file");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchFileInfo();

    return () => {
      cancelled = true;
    };
  }, [fileId, setPageTitle]);

  /* ------------------------------------------------------------------------ */
  /*                              Stream URL                                  */
  /* ------------------------------------------------------------------------ */

  const streamUrl = useMemo(() => {
    if (!file) {
      return "";
    }

    return `${oxygenUrl}/stream/file/${encodeURIComponent(
      file.object_name
    )}`;
  }, [file, oxygenUrl]);

  /* ------------------------------------------------------------------------ */
  /*                             Download URL                                 */
  /* ------------------------------------------------------------------------ */

  const downloadUrl = useMemo(() => {
    if (!streamUrl) {
      return "";
    }

    return `${streamUrl}?download=1`;
  }, [streamUrl]);

  /* ------------------------------------------------------------------------ */
  /*                         Viewer Type                                      */
  /* ------------------------------------------------------------------------ */

  const viewerType = useMemo(() => {
    if (!file) {
      return "unsupported";
    }

    return getViewerType(file.mimetype);
  }, [file]);

  /* ------------------------------------------------------------------------ */
  /*                         Top Panel / Download                             */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    if (!file || !downloadUrl) {
      return;
    }

    setAction(
      <Button
        onClick={() => {
          window.location.href = downloadUrl;
        }}
      >
        <DownloadIcon className="h-4 w-4" />

        <span>
          Download
        </span>
      </Button>
    );

    setIsNested(true);

    return () => {
      reset();
    };
  }, [
    file,
    downloadUrl,
    setAction,
    setIsNested,
    reset,
  ]);

  /* ------------------------------------------------------------------------ */
  /*                              Loading                                     */
  /* ------------------------------------------------------------------------ */

  if (loading) {
    return (
      <section className="h-full w-full overflow-hidden">
        <LoadingViewer />
      </section>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                               Error                                      */
  /* ------------------------------------------------------------------------ */

  if (error || !file) {
    return (
      <section className="h-full w-full overflow-hidden">
        <ErrorViewer />
      </section>
    );
  }

  /* ------------------------------------------------------------------------ */
  /*                               Viewer                                     */
  /* ------------------------------------------------------------------------ */

  return (
    <section className="h-full w-full flex items-center justify-center overflow-hidden bg-background">
      {viewerType === "image" && (
        <ImageViewer
          src={streamUrl}
          filename={file.filename}
        />
      )}

      {viewerType === "video" && (
        <VideoViewer
          src={streamUrl}
          filename={file.filename}
        />
      )}

      {viewerType === "pdf" && (
        <PdfViewer
          src={streamUrl}
          filename={file.filename}
        />
      )}

      {viewerType === "unsupported" && (
        <UnsupportedViewer
          filename={file.filename}
          mimetype={file.mimetype}
        />
      )}
    </section>
  );
}

export default MediaPage;