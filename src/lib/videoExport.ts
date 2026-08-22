// Client-Side 3D Turntable Video Exporter using browser MediaRecorder API
// Captures 60fps high-definition 360-degree orbit reels with 0 server costs!

export async function recordCanvasStream(
  canvas: HTMLCanvasElement,
  durationMs: number = 10000,
  onProgress?: (progressPercent: number) => void
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    try {
      if (typeof window === "undefined" || !canvas.captureStream) {
        throw new Error("MediaRecorder canvas stream not supported in this environment");
      }

      const stream = canvas.captureStream(60);

      // Determine supported mimeType
      const mimeTypes = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
        "video/mp4",
      ];
      const selectedMime =
        (typeof MediaRecorder !== "undefined" &&
          mimeTypes.find((type) => MediaRecorder.isTypeSupported(type))) ||
        "video/webm";

      const recorder = new MediaRecorder(stream, {
        mimeType: selectedMime,
        videoBitsPerSecond: 8000000, // 8 Mbps crisp quality
      });

      const chunks: BlobPart[] = [];

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      recorder.onstop = () => {
        const videoBlob = new Blob(chunks, { type: selectedMime });
        resolve(videoBlob);
      };

      recorder.onerror = (err) => {
        reject(err);
      };

      recorder.start(100);

      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(100, Math.round((elapsed / durationMs) * 100));
        onProgress?.(progress);

        if (elapsed >= durationMs) {
          clearInterval(interval);
          if (recorder.state !== "inactive") {
            recorder.stop();
          }
        }
      }, 100);
    } catch (err) {
      reject(err);
    }
  });
}

export function downloadBlob(blob: Blob, filename: string): boolean {
  if (typeof document === "undefined" || typeof URL === "undefined") {
    return false;
  }

  try {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    return true;
  } catch {
    return false;
  }
}
