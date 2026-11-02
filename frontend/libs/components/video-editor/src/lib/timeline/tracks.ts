import type { TrackType } from "./types";

// Default user-visible names for each track type. Shown in the
// properties panel header and used when creating a new track without
// an explicit name (drag-and-drop, paste-element, etc.).
export const DEFAULT_TRACK_NAMES: Record<TrackType, string> = {
  video: "영상 트랙",
  text: "텍스트 트랙",
  audio: "오디오 트랙",
  graphic: "그래픽 트랙",
  effect: "효과 트랙",
} as const;
