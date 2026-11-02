export const BACKGROUND_BLUR_INTENSITY_PRESETS: Array<{
  label: string;
  value: number;
}> = [
  { label: "라이트", value: 100 },
  { label: "중간", value: 200 },
  { label: "강하게", value: 500 },
] as const;

export const DEFAULT_BACKGROUND_BLUR_INTENSITY = 10;
