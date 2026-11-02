// Manual fallbacks so we can show a tagline (and a longer info blurb) even when
// the API doesn't return one yet for a given model. The API value always wins.
const MODEL_DESCRIPTIONS: Record<string, string> = {
  // ── Image models ──
  flux_1_dev: "디테일이 풍부한 오픈 웨이트 모델",
  flux_1_schnell: "빠른 시안용 가장 빠른 FLUX",
  flux_pro_1p1: "프로급 품질과 프롬프트 정확도",
  flux_pro_1p1_ultra: "초고해상도 FLUX 결과물",
  gpt_image_1: "OpenAI의 원조 이미지 모델",
  gpt_image_1p5: "글자 표현이 안정적인 OpenAI 이미지",
  gpt_image_2: "선명한 글자 표현의 4K 이미지",
  gpt_image_2p5_flare: "피사체를 유지하는 빠르고 정밀한 편집",
  gpt_image_2p5_sunburst: "고급 디테일과 충실도, 느린 편",
  midjourney_7: "특유의 예술적·스타일화된 이미지",
  midjourney_7_niji: "애니메이션·일러스트 스타일",
  midjourney_8: "Midjourney 최신 대표 모델",
  nano_banana: "빠르고 다재다능한 편집·생성",
  nano_banana_2: "Flash 속도로 Pro 품질",
  nano_banana_pro: "구글 대표 이미지 모델",
  seedream_4: "고품질 사실적 이미지 생성",
  seedream_4p5: "ByteDance's next-gen 4K model",
  seedream_5_lite: "가볍고 빠른 시각 추론",
  seedream_5p0_pro: "Seedream 대표 이미지 품질",
  seedream_5p0_pro_u: "Seedream 최고 품질 등급",
  // ── Video models ── (seedance_2p0 intentionally omitted)
  flux_3: "Black Forest Labs의 영상 생성",
  grok_video: "xAI의 스타일화된 영상 생성",
  grok_imagine_video: "xAI의 다양한 영상 스타일",
  grok_imagine_video_1p5: "xAI의 이미지→영상 스타일",
  kling_1p6_pro: "Smooth, coherent motion",
  kling_2p1_pro: "더 선명한 사실감과 디테일",
  kling_2p1_master: "최고 품질의 영화 같은 움직임",
  kling_2p5_turbo_pro: "Fast, high-quality generation",
  kling_2p6_pro: "정교한 움직임과 프롬프트 제어",
  kling_3p0_standard: "차세대 프레임 간 일관성",
  kling_3p0_pro: "Kling 대표 영화풍 영상",
  minimax_h3: "멀티미디어 참조를 쓰는 2K 영상",
  seedance_1p0_lite: "빠르고 가벼운 영상 클립",
  seedance_1p5_pro: "오디오가 동기화된 키프레임",
  happy_horse_1p0: "한 프레임에서 표현력 있는 움직임",
  sora_2: "오디오가 동기화된 사실적 영상",
  sora_2_pro: "Sora's highest-fidelity tier",
  veo_2: "Coherent, high-quality motion",
  veo_3: "자체 오디오가 포함된 사실적 영상",
  veo_3_fast: "Faster Veo 3 with audio",
  veo_3p1: "더 세밀하게 제어하는 최신 Veo",
  veo_3p1_fast: "Speed-tuned Veo 3.1",
  veo_3p1_lite: "Light, low-cost Veo 3.1",
  vidu_q3: "참조 기반 영상 생성",
  vidu_q3_turbo: "Speed-optimized Vidu Q3",
  // ── Edit / VFX ──
  switch_x: "배경 교체 또는 조명 변경",
  // ── 3D mesh models ──
  hunyuan_3d_2p0: "안정적인 이미지→3D 메시",
  hunyuan_3d_2p1: "개선된 디테일과 토폴로지",
  hunyuan_3d_3: "High-detail 3D generation",
  hunyuan_3d_3_sketch: "스케치로 3D 메시 생성",
  hunyuan_3d_3p1_pro: "Hunyuan's flagship 3D quality",
  tripo3d_h3p1: "Fast, clean 3D meshes",
  meshy_v6: "Production-ready 3D assets",
  // ── World / splat models ──
  marble_1p0: "Explorable 3D worlds",
  marble_1p0_draft: "빠른 시안용 월드 생성",
  marble_1p1: "더 선명하고 일관된 월드",
  marble_1p1_plus: "Marble's highest-quality worlds",
  // ── Audio models ──
  suno_music: "텍스트 프롬프트로 노래 한 곡",
  suno_remix: "기존 트랙 리믹스",
  suno_sounds: "박자 조절이 되는 효과음",
  suno_sample: "샘플로 노래 만들기",
  seed_audio_1p0: "세밀하게 조정하는 소리 생성",
};

const MODEL_INFOS: Record<string, string> = {
  // Longer blurbs surfaced behind the (i) info icon. Optional per model.
  // nano_banana_pro:
  //   "Google's flagship image model. Generates up to 4K, supports image references for editing, and batches up to 4 images at once.",
  // gpt_image_2:
  //   "OpenAI's image model with industry-leading text rendering. Emulated resolutions up to 4K and quality presets (High / Medium / Low).",
};

/** Short tagline shown under the model name.
 *
 *  Precedence: the API value always wins; the manual map is only a fallback for
 *  when the API hasn't returned a value (field absent / null / empty). Exactly
 *  one source is ever used, never both. Because this is derived from the model
 *  object (which only exists after the single atomic models fetch resolves), a
 *  row never renders with the manual value and then swaps to the API one, so
 *  there's no flicker, including before the API has returned. */
export function getModelDescription(
  modelId: string,
  apiDescription?: string | null,
): string {
  if (apiDescription) return apiDescription;
  return MODEL_DESCRIPTIONS[modelId] ?? "";
}

/** Longer info blurb for the (i) icon. Same precedence/no-flicker contract as
 *  getModelDescription: API value wins, manual map is the fallback, only one is
 *  ever used. Empty string means "no info icon for this model". */
export function getModelInfo(modelId: string, apiInfo?: string | null): string {
  if (apiInfo) return apiInfo;
  return MODEL_INFOS[modelId] ?? "";
}
