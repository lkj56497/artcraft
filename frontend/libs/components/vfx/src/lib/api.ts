import { StorytellerApiHostStore } from "@storyteller/api";

export type SubmitVFXJobRequest = {
  source_video_media_token: string;
  reference_image_media_token: string | null;
  prompt: string | null;
  uuid_idempotency_token: string;
};

export type SubmitVFXJobResponse =
  | { success: true; inference_job_token: string }
  | {
      success: false;
      error_code?: number;
      error_code_str?: string;
      error_message?: string;
    };

export const VFX_NOT_AVAILABLE_ERROR = "vfx_not_yet_available";

const VFX_ENDPOINT = "/v1/generate/video/edit/beeble_switchx";

export async function submitVFXJob(
  req: SubmitVFXJobRequest,
): Promise<SubmitVFXJobResponse> {
  try {
    const url = StorytellerApiHostStore.getInstance().pathToFullUrl(VFX_ENDPOINT);

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(req),
    });

    if (res.status === 404 || res.status === 501) {
      return {
        success: false,
        error_code: res.status,
        error_code_str: VFX_NOT_AVAILABLE_ERROR,
        error_message: "배경 변경 서버가 아직 준비되지 않았습니다.",
      };
    }

    const json = (await res.json().catch(() => null)) as
      | SubmitVFXJobResponse
      | null;
    if (!json) {
      return {
        success: false,
        error_code: res.status,
        error_code_str: "unknown_response",
        error_message: "서버 응답을 해석할 수 없습니다.",
      };
    }
    return json;
  } catch (e) {
    return {
      success: false,
      error_code_str: "network_error",
      error_message: e instanceof Error ? e.message : String(e),
    };
  }
}

export function newIdempotencyToken(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}
