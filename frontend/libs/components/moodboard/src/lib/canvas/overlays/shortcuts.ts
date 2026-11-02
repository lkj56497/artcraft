// Single source of truth for moodboard keyboard shortcuts. Consumed by
// `ShortcutCheatsheet.tsx` (rendering) and indirectly by
// `useKeyboardShortcuts.ts` (wiring). The `keys` array is the label shown
// to the user; the actual matching logic lives in the hook because some
// shortcuts are modifier-sensitive and platform-specific.

export interface ShortcutRow {
  label: string;
  keys: string[];
  section: "Tools" | "Selection" | "Editing" | "Viewport" | "History";
}

const isMac =
  typeof navigator !== "undefined" &&
  /Mac|iPod|iPhone|iPad/.test(navigator.platform);

export const MOD = isMac ? "⌘" : "Ctrl";

// Renders a key combo as a compact tooltip label. Mac uses adjacent symbols
// (⌘⇧Z); other platforms use "+" separators (Ctrl+Shift+Z). Pass keys in
// order, e.g. [MOD, "Shift", "Z"].
export const fmtShortcut = (keys: string[]): string =>
  isMac
    ? keys.map((k) => (k === "Shift" ? "⇧" : k)).join("")
    : keys.join("+");

export const SHORTCUTS: ShortcutRow[] = [
  // Tools
  { section: "Tools", label: "선택 도구", keys: ["V"] },
  { section: "Tools", label: "올가미 도구", keys: ["L"] },
  { section: "Tools", label: "텍스트 도구", keys: ["T"] },

  // Selection
  { section: "Selection", label: "모두 선택", keys: [MOD, "A"] },
  { section: "Selection", label: "선택 해제", keys: ["Esc"] },
  { section: "Selection", label: "선택에 추가 / 제거", keys: ["Shift", "Click"] },

  // Editing
  { section: "Editing", label: "선택 항목 삭제", keys: ["Delete"] },
  { section: "Editing", label: "선택 항목 그룹화", keys: [MOD, "G"] },
  { section: "Editing", label: "선택 항목 그룹 해제", keys: [MOD, "Shift", "G"] },
  { section: "Editing", label: "이미지 붙여넣기", keys: [MOD, "V"] },

  // Viewport
  { section: "Viewport", label: "화면 이동", keys: ["Middle-click", "drag"] },
  { section: "Viewport", label: "화면 이동 (보조)", keys: ["Space", "drag"] },
  { section: "Viewport", label: "줌", keys: ["Scroll"] },
  { section: "Viewport", label: "줌 초기화", keys: [MOD, "0"] },
  { section: "Viewport", label: "화면에 맞추기", keys: ["Shift", "1"] },

  // History
  { section: "History", label: "실행 취소", keys: [MOD, "Z"] },
  { section: "History", label: "다시 실행", keys: [MOD, "Shift", "Z"] },
];
