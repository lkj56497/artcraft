import type { EditorCore } from "../index";
import type { RootNode } from "../../services/renderer/nodes/root-node";
import type { ExportOptions, ExportResult } from "../../export";
import { CanvasRenderer } from "../../services/renderer/canvas-renderer";
import { SceneExporter } from "../../services/renderer/scene-exporter";
import { buildScene } from "../../services/renderer/scene-builder";
import { createTimelineAudioBuffer } from "../../media/audio";
import { formatTimecode } from "opencut-wasm";
import { frameRateToFloat } from "../../fps/utils";
import { downloadBlob } from "../../utils/browser";

type SnapshotResult =
  | { success: true; blob: Blob; filename: string }
  | { success: false; error: string };

export class RendererManager {
  private renderTree: RootNode | null = null;
  private _isDegraded = false;
  private listeners = new Set<() => void>();

  constructor(private editor: EditorCore) {}

  get isDegraded(): boolean {
    return this._isDegraded;
  }

  setDegraded(degraded: boolean): void {
    if (this._isDegraded === degraded) return;
    this._isDegraded = degraded;
    this.notify();
  }

  setRenderTree({ renderTree }: { renderTree: RootNode | null }): void {
    this.renderTree = renderTree;
    this.notify();
  }

  getRenderTree(): RootNode | null {
    return this.renderTree;
  }

  async saveSnapshot(): Promise<{ success: boolean; error?: string }> {
    const snapshot = await this.createSnapshot();
    if (!snapshot.success) {
      return snapshot;
    }

    downloadBlob({ blob: snapshot.blob, filename: snapshot.filename });
    return { success: true };
  }

  async copySnapshot(): Promise<{ success: boolean; error?: string }> {
    if (typeof ClipboardItem === "undefined" || !navigator.clipboard?.write) {
      return {
        success: false,
        error: "이 브라우저는 클립보드 이미지 복사를 지원하지 않습니다",
      };
    }

    const snapshot = await this.createSnapshot();
    if (!snapshot.success) {
      return snapshot;
    }

    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [snapshot.blob.type || "image/png"]: snapshot.blob,
        }),
      ]);
      return { success: true };
    } catch (error) {
      console.error("Copy snapshot failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      };
    }
  }

  private async createSnapshot(): Promise<SnapshotResult> {
    try {
      const renderTree = this.getRenderTree();
      const activeProject = this.editor.project.getActive();

      if (!renderTree || !activeProject) {
        return { success: false, error: "캡처할 프로젝트나 장면이 없습니다" };
      }

      const duration = this.editor.timeline.getTotalDuration();
      if (duration === 0) {
        return { success: false, error: "프로젝트가 비어 있습니다" };
      }

      const { canvasSize, fps } = activeProject.settings;
      const renderTime = Math.min(
        this.editor.playback.getCurrentTime(),
        this.editor.timeline.getLastFrameTime(),
      );

      const renderer = new CanvasRenderer({
        width: canvasSize.width,
        height: canvasSize.height,
        fps,
      });

      const tempCanvas = document.createElement("canvas");
      tempCanvas.width = canvasSize.width;
      tempCanvas.height = canvasSize.height;

      await renderer.renderToCanvas({
        node: renderTree,
        time: renderTime,
        targetCanvas: tempCanvas,
      });

      const blob = await new Promise<Blob | null>((resolve) => {
        tempCanvas.toBlob((result) => resolve(result), "image/png");
      });

      if (!blob) {
        return { success: false, error: "이미지 만들기 실패" };
      }

      const timecode = formatTimecode({ time: renderTime, rate: fps })!.replace(/:/g, "-");
      const safeName =
        activeProject.metadata.name.replace(/[<>:"/\\|?*]/g, "-").trim() ||
        "snapshot";
      const filename = `${safeName}-${timecode}.png`;

      return { success: true, blob, filename };
    } catch (error) {
      console.error("Snapshot capture failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 오류",
      };
    }
  }

  async exportProject({
    options,
    onProgress,
    onCancel,
  }: {
    options: ExportOptions;
    onProgress?: ({ progress }: { progress: number }) => void;
    onCancel?: () => boolean;
  }): Promise<ExportResult> {
    const { format, quality, fps, includeAudio } = options;

    try {
      const tracks = this.editor.scenes.getActiveScene().tracks;
      const mediaAssets = this.editor.media.getAssets();
      const activeProject = this.editor.project.getActive();

      if (!activeProject) {
        return { success: false, error: "열린 프로젝트가 없습니다" };
      }

      const duration = this.editor.timeline.getTotalDuration();
      if (duration === 0) {
        return { success: false, error: "프로젝트가 비어 있습니다" };
      }

      const exportFps = fps ?? activeProject.settings.fps;
      const canvasSize = activeProject.settings.canvasSize;

      let audioBuffer: AudioBuffer | null = null;
      if (includeAudio) {
        onProgress?.({ progress: 0.05 });
        audioBuffer = await createTimelineAudioBuffer({
          tracks,
          mediaAssets,
          duration,
        });
      }

      const scene = buildScene({
        tracks,
        mediaAssets,
        duration,
        canvasSize,
        background: activeProject.settings.background,
      });

      const exporter = new SceneExporter({
        width: canvasSize.width,
        height: canvasSize.height,
        fps: exportFps,
        format,
        quality,
        shouldIncludeAudio: !!includeAudio,
        audioBuffer: audioBuffer || undefined,
      });

      exporter.on("progress", (progress) => {
        const adjustedProgress = includeAudio
          ? 0.05 + progress * 0.95
          : progress;
        onProgress?.({ progress: adjustedProgress });
      });

      let cancelled = false;
      const checkCancel = () => {
        if (onCancel?.()) {
          cancelled = true;
          exporter.cancel();
        }
      };

      const cancelInterval = setInterval(checkCancel, 100);

      try {
        const buffer = await exporter.export({ rootNode: scene });
        clearInterval(cancelInterval);

        if (cancelled) {
          return { success: false, cancelled: true };
        }

        if (!buffer) {
          return { success: false, error: "Export failed to produce buffer" };
        }

        return {
          success: true,
          buffer,
        };
      } finally {
        clearInterval(cancelInterval);
      }
    } catch (error) {
      console.error("Export failed:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "알 수 없는 내보내기 오류",
      };
    }
  }

  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((fn) => {
      fn();
    });
  }
}
