import { ImagesIcon, MaximizeIcon, PencilIcon } from "lucide-react";
import { downloadFileFromUrl } from "@storyteller/tauri-api";
import { GalleryModal, GalleryItem } from "@storyteller/ui-gallery-modal";
import { useState } from "react";
import toast from "react-hot-toast";
import { uploadImage } from "~/components/reusable/UploadModalMedia/uploadImage";
import { UploaderStates } from "~/enums";
import { MediaFilesApi } from "@storyteller/api";
import { HelpMenuButton } from "@storyteller/ui-help-menu";
import { CostCalculatorButton } from "@storyteller/ui-pricing-modal";
import { ModelPage } from "@storyteller/ui-model-selector";
import { UploadEntryCard } from "~/components/media/UploadEntryCard";
import { BlankCanvasModal, type BaseSelectorImage } from "@storyteller/ui-pagedraw";

const MAX_GALLERY_SELECTIONS = 1;

type BaseImageSelectorProps = {
  onImageSelect: (image: BaseSelectorImage) => void;
  showLoading?: boolean;
};

export const BaseImageSelector = ({
  onImageSelect,
  showLoading = false,
}: BaseImageSelectorProps) => {
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isBlankCanvasModalOpen, setIsBlankCanvasModalOpen] = useState(false);

  const handleGalleryClick = () => setIsGalleryModalOpen(true);

  const handleGalleryClose = () => {
    setIsGalleryModalOpen(false);
    setSelectedGalleryImages([]);
  };

  const handleImageSelect = (mediaToken: string) => {
    setSelectedGalleryImages((prev) => {
      if (prev.includes(mediaToken)) return prev.filter((x) => x !== mediaToken);
      if (prev.length >= MAX_GALLERY_SELECTIONS) {
        return MAX_GALLERY_SELECTIONS === 1 ? [mediaToken] : prev;
      }
      return [...prev, mediaToken];
    });
  };

  const handleUseGalleryImages = (selectedItems: GalleryItem[]) => {
    const item = selectedItems[0];
    if (!item || !item.fullImage) {
      toast.error("선택된 이미지가 없습니다");
      return;
    }
    const referenceImage: BaseSelectorImage = {
      url: item.fullImage,
      mediaToken: item.id,
      thumbnailUrlTemplate: item.thumbnailUrlTemplate,
    };
    handleGalleryClose();
    onImageSelect(referenceImage);
  };

  const handleBlankCanvasConfirm = (width: number, height: number) => {
    setIsBlankCanvasModalOpen(false);
    const blankImage: BaseSelectorImage = {
      url: "",
      mediaToken: `blank_canvas_${width}x${height}_${Math.random().toString(36).substring(2, 8)}`,
      isBlankCanvas: true,
      blankCanvasWidth: width,
      blankCanvasHeight: height,
    };
    onImageSelect(blankImage);
  };

  const handleFileUpload = (files: FileList) => {
    setIsLoading(true);

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        uploadImage({
          title: `reference-image-${Math.random().toString(36).substring(2, 15)}`,
          assetFile: file,
          progressCallback: (newState) => {
            if (newState.status === UploaderStates.success && newState.data) {
              const mediaToken = newState.data || "";
              (async () => {
                let finalUrl = reader.result as string;
                let thumbnailUrlTemplate = undefined;
                try {
                  const api = new MediaFilesApi();
                  const result = await api.GetMediaFileByToken({ mediaFileToken: mediaToken });
                  if (result.success && result.data) {
                    finalUrl =
                      result.data.media_links?.cdn_url ||
                      result.data.public_bucket_url ||
                      finalUrl;
                    const mediaLinks = result.data.media_links as
                      | { thumbnail_template?: string; maybe_thumbnail_template?: string }
                      | undefined;
                    thumbnailUrlTemplate =
                      mediaLinks?.thumbnail_template || mediaLinks?.maybe_thumbnail_template;
                  }
                } catch (e) {
                  console.warn("Falling back to data URL for uploaded image", e);
                }
                const referenceImage: BaseSelectorImage = {
                  mediaToken,
                  url: finalUrl,
                  fullImageUrl: finalUrl,
                  thumbnailUrlTemplate,
                };
                toast.success("이미지 업로드 완료!");
                onImageSelect(referenceImage);
                setIsLoading(false);
              })();
            } else if (
              newState.status === UploaderStates.assetError ||
              newState.status === UploaderStates.imageCreateError
            ) {
              toast.error("업로드에 실패했습니다. 다시 시도해 주세요.");
              setIsLoading(false);
            }
          },
        });
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <>
      <div className="flex h-full w-full items-center justify-center overflow-hidden bg-ui-panel text-base-fg">
        <div className="aspect-video w-full max-w-5xl bg-ui-background">
          <UploadEntryCard
            icon={PencilIcon}
            title="이미지 편집"
            description="클릭해서 업로드하거나 편집할 이미지를 여기로 끌어다 놓으세요"
            accentBackgroundClass="bg-blue-500/40"
            accentBorderClass="border-blue-400/30"
            accept="image/*"
            multiple
            onFilesSelected={handleFileUpload}
            primaryLabel="이미지 선택"
            secondaryLabel="라이브러리에서 선택"
            secondaryIcon={ImagesIcon}
            onSecondaryClick={handleGalleryClick}
            tertiaryLabel="빈 캔버스"
            tertiaryIcon={MaximizeIcon}
            onTertiaryClick={() => setIsBlankCanvasModalOpen(true)}
            disabled={isLoading || showLoading}
          />
        </div>
      </div>
      <div className="fixed bottom-6 right-6 z-20 flex items-center gap-2">
        <CostCalculatorButton modelPage={ModelPage.ImageEditor} />
        <HelpMenuButton />
      </div>
      <GalleryModal
        isOpen={!!isGalleryModalOpen}
        onClose={handleGalleryClose}
        mode="select"
        selectedItemIds={selectedGalleryImages}
        onSelectItem={handleImageSelect}
        maxSelections={MAX_GALLERY_SELECTIONS}
        onUseSelected={handleUseGalleryImages}
        onDownloadClicked={downloadFileFromUrl}
        forceFilter="image"
      />
      <BlankCanvasModal
        isOpen={isBlankCanvasModalOpen}
        onClose={() => setIsBlankCanvasModalOpen(false)}
        onConfirm={handleBlankCanvasConfirm}
      />
    </>
  );
};
