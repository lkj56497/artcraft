import { FilterEngineCategories } from "@storyteller/api";
import { Button } from "@storyteller/ui-button";
interface Props {
  onCancel: () => void;
  onRetry: () => void;
  type: FilterEngineCategories | string;
  errorMessage?: string;
}

export const UploadAssetError = ({
  onCancel,
  onRetry,
  type,
  errorMessage,
}: Props) => {
  return (
    <>
      <h3>업로드 오류 {type}</h3>
      <p>{errorMessage ?? "Unknown Error"}</p>
      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={onCancel} variant="secondary">
          취소
        </Button>
        <Button onClick={onRetry} variant="primary">
          다시 시도
        </Button>
      </div>
    </>
  );
};
