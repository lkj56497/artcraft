import type { ToastAdapter } from "../adapters/toast";

// Upload toast — host-routed. The OpenCut original called sonner's
// `toast.promise` directly which gives a single dynamic toast that
// transitions loading → success/error. The ToastAdapter doesn't have
// `.promise`, so we approximate with: loading toast → swap to
// success/error on settle. Hosts with richer toast surfaces can shadow
// this helper if they want the original behavior.

export interface MediaUploadToastResult {
  uploadedCount: number;
  assetNames?: string[];
}

function getAssetLabel({ count }: { count: number }): string {
  return count === 1 ? "media asset" : "media assets";
}

function waitForNextPaint(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve());
    });
  });
}

export async function showMediaUploadToast<T extends MediaUploadToastResult>({
  filesCount,
  toast,
  promise,
}: {
  filesCount: number;
  toast: ToastAdapter;
  promise: Promise<T> | (() => Promise<T>);
}): Promise<T> {
  const run = typeof promise === "function" ? promise : () => promise;
  toast.info(`${getAssetLabel({ count: filesCount })} 업로드 중...`);
  await waitForNextPaint();

  try {
    const result = await run();
    const { uploadedCount, assetNames } = result;
    if (uploadedCount === 1) {
      const assetName = assetNames?.[0];
      toast.success(
        assetName
          ? `${assetName} 업로드 완료`
          : "미디어 에셋 1개 업로드 완료",
      );
    } else if (uploadedCount > 1) {
      toast.success(`미디어 에셋 ${uploadedCount}개 업로드 완료`);
    } else {
      toast.warning("업로드된 미디어 에셋이 없습니다");
    }
    return result;
  } catch (error) {
    toast.error(`${getAssetLabel({ count: filesCount })} 업로드 실패`, {
      description: error instanceof Error ? error.message : undefined,
    });
    throw error;
  }
}
