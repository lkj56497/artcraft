import { useState, useRef, useEffect } from "react";
import { DropletIcon, ImagesIcon, RotateCwIcon } from "lucide-react";
import { Button } from "@storyteller/ui-button";
import { GalleryItem, GalleryModal } from "@storyteller/ui-gallery-modal";
import { downloadFileFromUrl } from "@storyteller/tauri-api";
import { UploadEntryCard } from "../../components/media/UploadEntryCard";
import toast from "react-hot-toast";

export const ImageWatermarkRemover = () => {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [selectedGalleryImages, setSelectedGalleryImages] = useState<string[]>(
    [],
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoadingFromGallery, setIsLoadingFromGallery] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{
    width: number;
    height: number;
  } | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    return () => {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);

  const handleLocalImageSelect = (files: FileList) => {
    const file = files[0];
    if (file && file.type.startsWith("image/")) {
      if (imageUrl && imageUrl.startsWith("blob:")) {
        URL.revokeObjectURL(imageUrl);
      }

      const url = URL.createObjectURL(file);
      setImageUrl(url);
      setImageDimensions(null);
    }
  };

  const handleImageSelect = (id: string) => {
    setSelectedGalleryImages((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      const maxSelections = 1;
      if (prev.length >= maxSelections) {
        return maxSelections === 1 ? [id] : prev;
      }
      return [...prev, id];
    });
  };

  const handleGallerySelect = async (selectedItems: GalleryItem[]) => {
    const item = selectedItems[0];
    if (!item || !item.fullImage) {
      toast.error("선택된 이미지가 없습니다");
      return;
    }

    if (isLoadingFromGallery) {
      return;
    }

    setIsLoadingFromGallery(true);

    if (imageUrl && imageUrl.startsWith("blob:")) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageUrl(item.fullImage);
    setImageDimensions(null);

    setIsGalleryModalOpen(false);
    setSelectedGalleryImages([]);
    setIsLoadingFromGallery(false);
  };

  const handleRemoveWatermark = async () => {
    if (!imageUrl) {
      toast.error("먼저 이미지를 선택하세요");
      return;
    }

    setIsProcessing(true);
    toast.loading("워터마크 제거 처리 중...", {
      id: "watermark-removal",
    });

    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("워터마크 제거 완료!", {
        id: "watermark-removal",
      });
    } catch (error) {
      toast.error("워터마크 제거 실패", { id: "watermark-removal" });
      console.error("Error removing watermark:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="flex h-[calc(100vh-56px)] w-full overflow-hidden bg-ui-background text-base-fg">
        <div className="flex-1 overflow-y-auto">
          <main
            className={
              !imageUrl
                ? "flex min-h-full w-full items-center justify-center p-8"
                : "flex w-full justify-center px-8 py-6"
            }
          >
            {!imageUrl ? (
              <div className="w-full max-w-5xl">
                <div className="aspect-video overflow-hidden border border-ui-panel-border bg-ui-panel">
                  <UploadEntryCard
                    icon={DropletIcon}
                    title="이미지 워터마크 제거"
                    description="이미지의 워터마크를 자연스럽게 지웁니다. 이미지를 업로드하면 워터마크 없는 깔끔한 결과를 받을 수 있습니다."
                    accentBackgroundClass="bg-indigo-500/40"
                    accentBorderClass="border-indigo-400/30"
                    accept="image/*"
                    onFilesSelected={handleLocalImageSelect}
                    primaryLabel="이미지 선택"
                    secondaryLabel="라이브러리에서 선택"
                    secondaryIcon={ImagesIcon}
                    onSecondaryClick={() => setIsGalleryModalOpen(true)}
                  />
                </div>
              </div>
            ) : (
              <div className="flex w-full max-w-5xl flex-col gap-5">
                <div className="w-full overflow-hidden border border-ui-panel-border bg-ui-panel">
                  <div className="relative w-full bg-black">
                    <Button
                      icon={RotateCwIcon}
                      variant="action"
                      onClick={() => {
                        setImageUrl("");
                        setImageDimensions(null);
                      }}
                      className="absolute right-3 top-3 z-10 border border-red/50 px-3 py-1.5 text-sm hover:border-red/80 hover:bg-red/80"
                    >
                      이미지 바꾸기
                    </Button>
                    <div className="flex min-h-[400px] items-center justify-center p-6">
                      <img
                        ref={imageRef}
                        src={imageUrl}
                        alt="선택한 사진"
                        className="max-h-[70vh] max-w-full object-contain"
                        onLoad={(e) => {
                          const img = e.currentTarget;
                          setImageDimensions({
                            width: img.naturalWidth,
                            height: img.naturalHeight,
                          });
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="primary"
                    icon={isProcessing ? undefined : DropletIcon}
                    loading={isProcessing}
                    onClick={handleRemoveWatermark}
                    className="px-12 py-3 text-lg font-semibold"
                    disabled={isProcessing}
                  >
                    {isProcessing ? "처리 중..." : "워터마크 제거"}
                  </Button>
                </div>

                <div className="border border-ui-panel-border bg-ui-panel p-6">
                  <div>
                    <div className="mb-4 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-base-fg/60">
                      <ImagesIcon
                        
                        className="text-ui-accent-ink" />
                      이미지 정보
                    </div>
                    {imageDimensions ? (
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between border-b border-ui-divider py-2">
                          <span className="font-medium text-base-fg/70">
                            해상도
                          </span>
                          <span className="font-mono text-lg font-semibold tabular-nums text-base-fg">
                            {imageDimensions.width} × {imageDimensions.height}
                          </span>
                        </div>
                        <div className="flex items-center justify-between py-2">
                          <span className="font-medium text-base-fg/70">
                            화면 비율
                          </span>
                          <span className="font-mono text-lg font-semibold tabular-nums text-base-fg">
                            {(
                              imageDimensions.width / imageDimensions.height
                            ).toFixed(2)}
                            :1
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-base-fg/50">불러오는 중...</div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      <GalleryModal
        isOpen={!!isGalleryModalOpen}
        onClose={() => {
          if (!isLoadingFromGallery) {
            setIsGalleryModalOpen(false);
            setSelectedGalleryImages([]);
          }
        }}
        mode="select"
        selectedItemIds={selectedGalleryImages}
        onSelectItem={handleImageSelect}
        maxSelections={1}
        onUseSelected={handleGallerySelect}
        onDownloadClicked={downloadFileFromUrl}
        forceFilter="image"
      />
    </>
  );
};
