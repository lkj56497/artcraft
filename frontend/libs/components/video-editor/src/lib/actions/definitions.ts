import type { ShortcutKey } from "./keybinding";
import type { TActionWithOptionalArgs } from "./types";

export type TActionCategory =
  | "playback"
  | "navigation"
  | "editing"
  | "selection"
  | "history"
  | "timeline"
  | "controls"
  | "assets";

export interface TActionBaseDefinition {
  description: string;
  category: TActionCategory;
  args?: Record<string, unknown>;
}

export interface TActionDefinition extends TActionBaseDefinition {
  defaultShortcuts?: readonly ShortcutKey[];
}

export const ACTIONS = {
  "toggle-play": {
    description: "재생/일시정지",
    category: "playback",
  },
  "stop-playback": {
    description: "재생 정지",
    category: "playback",
  },
  "seek-forward": {
    description: "1초 앞으로",
    category: "playback",
    args: { seconds: "number" },
  },
  "seek-backward": {
    description: "1초 뒤로",
    category: "playback",
    args: { seconds: "number" },
  },
  "frame-step-forward": {
    description: "한 프레임 앞으로",
    category: "navigation",
  },
  "frame-step-backward": {
    description: "한 프레임 뒤로",
    category: "navigation",
  },
  "jump-forward": {
    description: "5초 앞으로",
    category: "navigation",
    args: { seconds: "number" },
  },
  "jump-backward": {
    description: "5초 뒤로",
    category: "navigation",
    args: { seconds: "number" },
  },
  "goto-start": {
    description: "타임라인 처음으로",
    category: "navigation",
  },
  "goto-end": {
    description: "타임라인 끝으로",
    category: "navigation",
  },
  split: {
    description: "재생 헤드에서 요소 자르기",
    category: "editing",
  },
  "split-left": {
    description: "자르고 왼쪽 제거",
    category: "editing",
  },
  "split-right": {
    description: "자르고 오른쪽 제거",
    category: "editing",
  },
  "delete-selected": {
    description: "현재 선택 삭제",
    category: "editing",
  },
  "copy-selected": {
    description: "선택한 요소 복사",
    category: "editing",
  },
  "paste-copied": {
    description: "재생 헤드에 요소 붙여넣기",
    category: "editing",
  },
  "toggle-snapping": {
    description: "스냅 전환",
    category: "editing",
  },
  "toggle-ripple-editing": {
    description: "리플 편집 전환",
    category: "editing",
  },
  "toggle-source-audio": {
    description: "원본 오디오 추출/복구",
    category: "editing",
  },
  "select-all": {
    description: "모든 요소 선택",
    category: "selection",
  },
  "cancel-interaction": {
    description: "현재 동작 취소",
    category: "controls",
  },
  "deselect-all": {
    description: "모든 요소 선택 해제",
    category: "selection",
  },
  "duplicate-selected": {
    description: "선택한 요소 복제",
    category: "selection",
  },
  "toggle-elements-muted-selected": {
    description: "선택한 요소 음소거/해제",
    category: "selection",
  },
  "toggle-elements-visibility-selected": {
    description: "선택한 요소 보이기/숨기기",
    category: "selection",
  },
  "toggle-bookmark": {
    description: "재생 헤드에 북마크 전환",
    category: "timeline",
  },
  undo: {
    description: "실행 취소",
    category: "history",
  },
  redo: {
    description: "다시 실행",
    category: "history",
  },
  "remove-media-asset": {
    description: "미디어 에셋 제거",
    category: "assets",
    args: { projectId: "string", assetId: "string" },
  },
  "remove-media-assets": {
    description: "미디어 에셋 제거",
    category: "assets",
    args: { projectId: "string", assetIds: "string[]" },
  },
} as const satisfies Record<string, TActionBaseDefinition>;

export type TAction = keyof typeof ACTIONS;

const ACTION_DEFAULT_SHORTCUTS = [
  ["toggle-play", ["space", "k"]],
  ["seek-forward", ["l"]],
  ["seek-backward", ["j"]],
  ["frame-step-forward", ["right"]],
  ["frame-step-backward", ["left"]],
  ["jump-forward", ["shift+right"]],
  ["jump-backward", ["shift+left"]],
  ["goto-start", ["home", "enter"]],
  ["goto-end", ["end"]],
  ["split", ["s"]],
  ["split-left", ["q"]],
  ["split-right", ["w"]],
  ["delete-selected", ["backspace", "delete"]],
  ["copy-selected", ["ctrl+c"]],
  ["paste-copied", ["ctrl+v"]],
  ["toggle-snapping", ["n"]],
  ["select-all", ["ctrl+a"]],
  ["cancel-interaction", ["escape"]],
  ["duplicate-selected", ["ctrl+d"]],
  ["undo", ["ctrl+z"]],
  ["redo", ["ctrl+shift+z", "ctrl+y"]],
] as const satisfies ReadonlyArray<
  readonly [TActionWithOptionalArgs, readonly ShortcutKey[]]
>;

const ACTION_DEFAULT_SHORTCUTS_BY_ACTION = new Map<
  TAction,
  readonly ShortcutKey[]
>(ACTION_DEFAULT_SHORTCUTS);

export function getActionDefinition({
  action,
}: {
  action: TAction;
}): TActionDefinition {
  return {
    ...ACTIONS[action],
    defaultShortcuts: ACTION_DEFAULT_SHORTCUTS_BY_ACTION.get(action),
  };
}

export function getDefaultShortcuts(): Map<
  ShortcutKey,
  TActionWithOptionalArgs
> {
  const shortcuts = new Map<ShortcutKey, TActionWithOptionalArgs>();

  for (const [action, defaultShortcuts] of ACTION_DEFAULT_SHORTCUTS) {
    for (const shortcut of defaultShortcuts) {
      shortcuts.set(shortcut, action);
    }
  }

  return shortcuts;
}
