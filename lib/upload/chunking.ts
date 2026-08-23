export function fileFingerprint(file: File): string {
  // Cheap, good-enough match key for "is this the same file the user picked before"
  return `${file.name}:${file.size}:${file.lastModified}`;
}

export function getTotalChunks(fileSize: number, chunkSize: number): number {
  return Math.ceil(fileSize / chunkSize);
}

export function getChunk(file: File, index: number, chunkSize: number): Blob {
  const start = index * chunkSize;
  const end = Math.min(start + chunkSize, file.size);
  return file.slice(start, end);
}