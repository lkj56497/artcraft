import { EIntermediateFile, MediaFilesApi, MediaUploadApi } from "@storyteller/api";
import type { PageSceneAdapter } from "@storyteller/ui-pagescene";
import {
  type GalleryItem,
  galleryModalLightboxImage,
  galleryModalLightboxMediaId,
  galleryModalLightboxNavNext,
  galleryModalLightboxNavPrev,
  galleryModalLightboxVisible,
} from "@storyteller/ui-gallery-modal";

export const sceneOutputAdapter: Pick<
  PageSceneAdapter,
  "uploadMedia" | "openMediaLightbox"
> = {
  async uploadMedia({ kind, blob, fileName, title }) {
    const api = new MediaUploadApi();
    const request = {
      uuid: crypto.randomUUID(),
      blob,
      fileName,
      maybe_title: title ?? fileName,
      // Captures and recordings are library outputs, not temporary inputs.
      is_intermediate_system_file: EIntermediateFile.false,
    };
    const response = kind === "video"
      ? await api.UploadNewVideo(request)
      : await api.UploadImage(request);
    if (!response.success || !response.data) {
      throw new Error(response.errorMessage || "녹화 또는 캡처를 업로드하지 못했습니다.");
    }
    return response.data;
  },

  async openMediaLightbox(token, kind) {
    const response = await new MediaFilesApi().GetMediaFileByToken({
      mediaFileToken: token,
    });
    const file = response.data;
    if (!response.success || !file?.media_links?.cdn_url) {
      throw new Error("업로드는 됐지만 미리보기를 불러오지 못했습니다. 다시 시도해 열어보세요.");
    }
    const item: GalleryItem = {
      id: token,
      label: file.maybe_title || (kind === "video" ? "장면 녹화" : "장면 캡처"),
      thumbnail: null,
      thumbnailUrlTemplate: file.media_links.thumbnail_template,
      fullImage: file.media_links.cdn_url,
      createdAt: file.created_at,
      mediaClass: kind,
      isUpload: true,
    };
    galleryModalLightboxNavPrev.value = null;
    galleryModalLightboxNavNext.value = null;
    galleryModalLightboxMediaId.value = token;
    galleryModalLightboxImage.value = item;
    galleryModalLightboxVisible.value = true;
  },
};
