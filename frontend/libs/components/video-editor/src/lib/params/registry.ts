import type {
  ParamDefinition,
  ParamValue,
  ParamValues,
} from "./index";
import { MIN_TRANSFORM_SCALE } from "../animation/transform";
import type { BlendMode } from "../rendering";
import type {
  ElementType,
  TimelineElement,
} from "../timeline/types";
import { DEFAULTS } from "../timeline/defaults";
import { VOLUME_DB_MAX, VOLUME_DB_MIN } from "../timeline/audio-constants";
import {
  CORNER_RADIUS_MAX,
  CORNER_RADIUS_MIN,
} from "../text/background";

// Per-element-type parameter registry. Each ElementType maps to an
// ordered list of ParamDefinitions; the properties panel iterates these
// to render the editor controls. ParamDefinition.read/write are
// optional overrides for cases where the param doesn't live in
// `element.params` (e.g. element.type, mediaId, etc.) — most params use
// the default `element.params[key]` accessor.
//
// The registry is keyed by ElementType, so adding a new element type
// requires registering its params here at module-init time.

export type ElementParamDefinition<TKey extends string = string> =
  ParamDefinition<TKey> & {
    read?: ({ element }: { element: TimelineElement }) => ParamValue | null;
    write?: ({
      element,
      value,
    }: {
      element: TimelineElement;
      value: ParamValue;
    }) => TimelineElement;
  };

export function buildDefaultParamValues(
  params: readonly ParamDefinition[],
): ParamValues {
  const values: ParamValues = {};
  for (const param of params) {
    values[param.key] = param.default;
  }
  return values;
}

export class DefinitionRegistry<TKey extends string, TDefinition> {
  private definitions = new Map<TKey, TDefinition>();
  private entityName: string;

  constructor(entityName: string) {
    this.entityName = entityName;
  }

  register({
    key,
    definition,
  }: {
    key: TKey;
    definition: TDefinition;
  }): void {
    this.definitions.set(key, definition);
  }

  has(key: TKey): boolean {
    return this.definitions.has(key);
  }

  get(key: TKey): TDefinition {
    const def = this.definitions.get(key);
    if (!def) {
      throw new Error(`Unknown ${this.entityName}: ${key}`);
    }
    return def;
  }

  getAll(): TDefinition[] {
    return Array.from(this.definitions.values());
  }
}

const BLEND_MODE_OPTIONS: Array<{ value: BlendMode; label: string }> = [
  { value: "normal", label: "표준" },
  { value: "darken", label: "어둡게" },
  { value: "multiply", label: "곱하기" },
  { value: "color-burn", label: "색상 번" },
  { value: "lighten", label: "밝게" },
  { value: "screen", label: "스크린" },
  { value: "plus-lighter", label: "더하기 밝게" },
  { value: "color-dodge", label: "색상 닷지" },
  { value: "overlay", label: "오버레이" },
  { value: "soft-light", label: "소프트 라이트" },
  { value: "hard-light", label: "하드 라이트" },
  { value: "difference", label: "차이" },
  { value: "exclusion", label: "제외" },
  { value: "hue", label: "색조" },
  { value: "saturation", label: "채도" },
  { value: "color", label: "색상" },
  { value: "luminosity", label: "광도" },
];

const visualElementParams: ElementParamDefinition[] = [
  {
    key: "transform.positionX",
    label: "위치 X",
    type: "number",
    default: DEFAULTS.element.transform.position.x,
    min: -100_000,
    step: 1,
  },
  {
    key: "transform.positionY",
    label: "위치 Y",
    type: "number",
    default: DEFAULTS.element.transform.position.y,
    min: -100_000,
    step: 1,
  },
  {
    key: "transform.scaleX",
    label: "크기 X",
    type: "number",
    default: DEFAULTS.element.transform.scaleX,
    min: MIN_TRANSFORM_SCALE,
    step: 0.01,
  },
  {
    key: "transform.scaleY",
    label: "크기 Y",
    type: "number",
    default: DEFAULTS.element.transform.scaleY,
    min: MIN_TRANSFORM_SCALE,
    step: 0.01,
  },
  {
    key: "transform.rotate",
    label: "회전",
    type: "number",
    default: DEFAULTS.element.transform.rotate,
    min: -360,
    max: 360,
    step: 1,
  },
  {
    key: "opacity",
    label: "불투명도",
    type: "number",
    default: DEFAULTS.element.opacity,
    min: 0,
    max: 1,
    step: 0.01,
  },
  {
    key: "blendMode",
    label: "혼합 모드",
    type: "select",
    default: DEFAULTS.element.blendMode,
    keyframable: false,
    options: BLEND_MODE_OPTIONS,
  },
];

const audioElementParams: ElementParamDefinition[] = [
  {
    key: "volume",
    label: "볼륨",
    type: "number",
    default: DEFAULTS.element.volume,
    min: VOLUME_DB_MIN,
    max: VOLUME_DB_MAX,
    step: 0.01,
  },
  {
    key: "muted",
    label: "음소거됨",
    type: "boolean",
    default: false,
    keyframable: false,
  },
];

const textElementParams: ElementParamDefinition[] = [
  {
    key: "content",
    label: "내용",
    type: "text",
    default: "기본 텍스트",
    keyframable: false,
  },
  {
    key: "fontFamily",
    label: "글꼴",
    type: "font",
    default: "Arial",
    keyframable: false,
  },
  {
    key: "fontSize",
    label: "글자 크기",
    type: "number",
    default: 15,
    min: 1,
    step: 1,
  },
  {
    key: "color",
    label: "색상",
    type: "color",
    default: "#ffffff",
  },
  {
    key: "textAlign",
    label: "텍스트 정렬",
    type: "select",
    default: "center",
    keyframable: false,
    options: [
      { value: "left", label: "왼쪽" },
      { value: "center", label: "가운데" },
      { value: "right", label: "오른쪽" },
    ],
  },
  {
    key: "fontWeight",
    label: "글자 굵기",
    type: "select",
    default: "normal",
    keyframable: false,
    options: [
      { value: "normal", label: "표준" },
      { value: "bold", label: "굵게" },
    ],
  },
  {
    key: "fontStyle",
    label: "글꼴 스타일",
    type: "select",
    default: "normal",
    keyframable: false,
    options: [
      { value: "normal", label: "표준" },
      { value: "italic", label: "기울임" },
    ],
  },
  {
    key: "textDecoration",
    label: "텍스트 장식",
    type: "select",
    default: "none",
    keyframable: false,
    options: [
      { value: "none", label: "없음" },
      { value: "underline", label: "밑줄" },
      { value: "line-through", label: "취소선" },
    ],
  },
  {
    key: "letterSpacing",
    label: "자간",
    type: "number",
    default: DEFAULTS.text.letterSpacing,
    min: -100,
    step: 0.1,
  },
  {
    key: "lineHeight",
    label: "행간",
    type: "number",
    default: DEFAULTS.text.lineHeight,
    min: 0.1,
    step: 0.1,
  },
  {
    key: "background.enabled",
    label: "배경 사용",
    type: "boolean",
    default: DEFAULTS.text.background.enabled,
    keyframable: false,
  },
  {
    key: "background.color",
    label: "배경색",
    type: "color",
    default: DEFAULTS.text.background.color,
    dependencies: [{ param: "background.enabled", equals: true }],
  },
  {
    key: "background.cornerRadius",
    label: "배경 둥글기",
    type: "number",
    default: DEFAULTS.text.background.cornerRadius,
    min: CORNER_RADIUS_MIN,
    max: CORNER_RADIUS_MAX,
    step: 1,
    dependencies: [{ param: "background.enabled", equals: true }],
  },
  {
    key: "background.paddingX",
    label: "배경 여백 X",
    type: "number",
    default: DEFAULTS.text.background.paddingX,
    min: 0,
    step: 1,
    dependencies: [{ param: "background.enabled", equals: true }],
  },
  {
    key: "background.paddingY",
    label: "배경 여백 Y",
    type: "number",
    default: DEFAULTS.text.background.paddingY,
    min: 0,
    step: 1,
    dependencies: [{ param: "background.enabled", equals: true }],
  },
  {
    key: "background.offsetX",
    label: "배경 오프셋 X",
    type: "number",
    default: DEFAULTS.text.background.offsetX,
    min: -100_000,
    step: 1,
    dependencies: [{ param: "background.enabled", equals: true }],
  },
  {
    key: "background.offsetY",
    label: "배경 오프셋 Y",
    type: "number",
    default: DEFAULTS.text.background.offsetY,
    min: -100_000,
    step: 1,
    dependencies: [{ param: "background.enabled", equals: true }],
  },
];

export const elementParamRegistry = new DefinitionRegistry<
  ElementType,
  readonly ElementParamDefinition[]
>("element params");

elementParamRegistry.register({
  key: "video",
  definition: [...visualElementParams, ...audioElementParams],
});
elementParamRegistry.register({ key: "image", definition: visualElementParams });
elementParamRegistry.register({
  key: "text",
  definition: [...textElementParams, ...visualElementParams],
});
elementParamRegistry.register({
  key: "sticker",
  definition: visualElementParams,
});
elementParamRegistry.register({
  key: "graphic",
  definition: visualElementParams,
});
elementParamRegistry.register({ key: "audio", definition: audioElementParams });
elementParamRegistry.register({ key: "effect", definition: [] });

export function getElementParams({
  element,
}: {
  element: TimelineElement;
}): readonly ElementParamDefinition[] {
  return elementParamRegistry.has(element.type)
    ? elementParamRegistry.get(element.type)
    : [];
}

export function getBuiltInElementParams({
  type,
}: {
  type: ElementType;
}): readonly ElementParamDefinition[] {
  return elementParamRegistry.has(type) ? elementParamRegistry.get(type) : [];
}

export function getElementParam({
  element,
  key,
}: {
  element: TimelineElement;
  key: string;
}): ElementParamDefinition | null {
  return (
    getElementParams({ element }).find((param) => param.key === key) ?? null
  );
}

export function readElementParamValue({
  element,
  param,
}: {
  element: TimelineElement;
  param: ElementParamDefinition;
}): ParamValue | null {
  if (param.read) {
    return param.read({ element });
  }
  if ("params" in element) {
    return element.params[param.key] ?? param.default;
  }
  return null;
}

export function writeElementParamValue({
  element,
  param,
  value,
}: {
  element: TimelineElement;
  param: ElementParamDefinition;
  value: ParamValue;
}): TimelineElement {
  if (param.write) {
    return param.write({ element, value });
  }
  if ("params" in element) {
    return {
      ...element,
      params: {
        ...element.params,
        [param.key]: value,
      },
    };
  }
  return element;
}

export function buildElementParamValues({
  element,
}: {
  element: TimelineElement;
}): ParamValues {
  const values: ParamValues = {};
  for (const param of getElementParams({ element })) {
    const value = readElementParamValue({ element, param });
    if (value !== null) {
      values[param.key] = value;
    }
  }
  return values;
}
