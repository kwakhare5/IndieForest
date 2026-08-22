import { describe, it, expect } from "vitest";
import { downloadBlob, recordCanvasStream } from "./videoExport";

describe("videoExport", () => {
  it("returns false safely when document is undefined in node environment", () => {
    const mockBlob = new Blob(["fake video content"], { type: "video/webm" });
    const result = downloadBlob(mockBlob, "test-orbit.webm");
    // In standard node env without window/document, returns false without throwing
    expect(result).toBe(false);
  });

  it("handles recordCanvasStream rejection when canvas has no captureStream", async () => {
    const fakeCanvas = {} as HTMLCanvasElement;
    await expect(recordCanvasStream(fakeCanvas, 1000)).rejects.toThrow();
  });
});
