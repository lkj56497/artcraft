import { ImagesIcon, UploadIcon } from "lucide-react";
import { Button } from "@storyteller/ui-button";

interface Props {
  onUpload: () => void;
  onLibrary: () => void;
}

// Shared sizing so both CTAs match the webapp create pages' empty-state buttons
// (h-12, pill, semibold). Centralized so the pair stays visually aligned.
const CTA_CLASS = "h-12 px-6 text-base font-semibold rounded-full";

// Editorial empty state — the board's first impression. Doubles as the
// drop / paste affordance (the whole grid accepts drops; this just says so).
export const BoardEmptyState = ({ onUpload, onLibrary }: Props) => {
  return (
    <div className="flex h-full w-full items-center justify-center px-6">
      <div className="flex max-w-md flex-col items-center text-center">
        <span className="mb-5 rounded-full border border-ui-divider px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-base-fg/50">
          무드보드
        </span>
        <h2 className="text-3xl font-semibold tracking-[-0.02em] text-base-fg">
          아이디어 모으기 시작
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-base-fg/55">
          이미지를 끌어오거나, 어디서든 붙여넣거나, 라이브러리에서 가져오세요. 여기 모은 모든 것을 나중에 생성 방향을 잡는 데 쓸 수 있습니다.
        </p>

        <div className="mt-7 flex items-center gap-3">
          <Button
            variant="primary"
            onClick={onUpload}
            icon={UploadIcon}
            className={CTA_CLASS}
          >
            업로드
          </Button>
          <Button
            variant="secondary"
            onClick={onLibrary}
            icon={ImagesIcon}
            className={CTA_CLASS}
          >
            라이브러리에서
          </Button>
        </div>
      </div>
    </div>
  );
};
