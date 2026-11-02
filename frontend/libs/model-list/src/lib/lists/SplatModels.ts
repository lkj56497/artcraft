import { SplatModel } from "../classes/SplatModel.js";
import { ModelCreator } from "../classes/metadata/ModelCreator.js";
import { GenerationProvider } from "@storyteller/api-enums";

// TODO: Some of the model configs, such as generation counts, are authoritatively controlled in `legacy/Models.ts`

export const SPLAT_MODELS : SplatModel [] = [
  new SplatModel({
    id: "marble_0p1_mini",
    tauriId: "marble_0p1_mini",
    fullName: "Marble 0.1 Mini",
    category: "gaussian",
    creator: ModelCreator.WorldLabs,
    selectorName: "Marble Mini",
    selectorDescription: "빠른 생성, 시안 작업에 적합",
    selectorBadges: ["약 30초"],
    providers: [GenerationProvider.Artcraft],
    progressBarTime: 45000,
  }),
  new SplatModel({
    id: "marble_0p1_plus",
    tauriId: "marble_0p1_plus",
    fullName: "Marble 0.1 Plus",
    category: "gaussian",
    creator: ModelCreator.WorldLabs,
    selectorName: "Marble Plus",
    selectorDescription: "고품질, 최종 결과물에 적합",
    selectorBadges: ["약 5분"],
    providers: [GenerationProvider.Artcraft],
    progressBarTime: 300000,
  }),
];

export const SPLAT_MODELS_BY_ID: Map<string, SplatModel> = new Map(
  SPLAT_MODELS.map((model) => [model.id, model]),
);

if (SPLAT_MODELS_BY_ID.size !== SPLAT_MODELS.length) {
  throw new Error("All splat models must have unique IDs");
}
