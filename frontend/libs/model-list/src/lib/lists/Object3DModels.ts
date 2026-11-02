import { Object3DModel } from "../classes/Object3DModel.js";
import { ModelCreator } from "../classes/metadata/ModelCreator.js";
import { GenerationProvider } from "@storyteller/api-enums";

export const OBJECT_3D_MODELS: Object3DModel[] = [
  new Object3DModel({
    id: "hunyuan_3d_3",
    tauriId: "hunyuan_3d_3",
    fullName: "Hunyuan 3D 3.0",
    category: "3d_object",
    creator: ModelCreator.Tencent,
    selectorName: "Hunyuan 3.0",
    selectorDescription: "최고 품질 3D 메시 생성",
    selectorBadges: ["약 2분"],
    providers: [GenerationProvider.Artcraft],
    progressBarTime: 120000,
  }),
  new Object3DModel({
    id: "hunyuan_3d_2_0",
    tauriId: "hunyuan_3d_2_0",
    fullName: "Hunyuan 3D 2.0",
    category: "3d_object",
    creator: ModelCreator.Tencent,
    selectorName: "Hunyuan 2.0",
    selectorDescription: "더 빠르지만 정밀도 낮은 3D 메시",
    selectorBadges: ["약 45초"],
    providers: [GenerationProvider.Artcraft],
    progressBarTime: 60000,
  }),
];

export const OBJECT_3D_MODELS_BY_ID: Map<string, Object3DModel> = new Map(
  OBJECT_3D_MODELS.map((model) => [model.id, model]),
);

if (OBJECT_3D_MODELS_BY_ID.size !== OBJECT_3D_MODELS.length) {
  throw new Error("All 3D object models must have unique IDs");
}
