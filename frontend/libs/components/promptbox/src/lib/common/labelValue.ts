// Korean UI labels are shown in pickers, but the app still keys settings by the
// original English values. Map a displayed label back to its value.
const KO_TO_VALUE: Record<string, string> = {
  가로: "wide",
  세로: "tall",
  정사각형: "square",
  자동: "auto",
};

export const labelValue = (label: string): string =>
  KO_TO_VALUE[label] ?? label.toLowerCase();
