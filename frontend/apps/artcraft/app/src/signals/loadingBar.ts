import { signal } from "@preact/signals-core";

export const loadingBarIsShowing = signal(false);
export const loadingBarData = signal<{
  label: string;
  message: string;
  progress: number;
}>({
  label: "편집기 엔진 불러오는 중... 🦊",
  progress: 5,
  message: "",
});
