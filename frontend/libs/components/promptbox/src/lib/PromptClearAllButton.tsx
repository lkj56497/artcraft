import { useState } from "react";
import { Tooltip } from "@storyteller/ui-tooltip";
import { Modal } from "@storyteller/ui-modal";
import { Button, NEUTRAL_BUTTON_HOVER_CLASSES } from "@storyteller/ui-button";
import { EraserIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

// Toolbar "clear everything" icon button shared by all promptbox variants:
// wipes the prompt text and every attached reference in one click. Callers
// keep it mounted and pass `disabled` when the box is empty so the toolbar
// doesn't reflow as the user types. Pass `confirmClear` when references are
// attached so a confirmation dialog protects the user's uploads; a text-only
// prompt clears immediately.

// Shared look for quiet icon-only toolbar controls. Also passed as
// `buttonClassName` to PopoverMenu triggers (e.g. the generation count
// picker) so they match this button.
export const PROMPT_TOOLBAR_ICON_BUTTON_CLASSES =
  `flex h-9 w-9 items-center justify-center rounded-[3px] border border-transparent bg-transparent px-0 text-base-fg/50 shadow-none transition-colors ${NEUTRAL_BUTTON_HOVER_CLASSES} hover:text-base-fg/90`;

interface PromptClearAllButtonProps {
  onClick: () => void;
  disabled?: boolean;
  confirmClear?: boolean;
  className?: string;
}

export const PromptClearAllButton = ({
  onClick,
  disabled,
  confirmClear,
  className,
}: PromptClearAllButtonProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleClick = () => {
    if (confirmClear) {
      setIsConfirmOpen(true);
    } else {
      onClick();
    }
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    onClick();
  };

  return (
    <>
      <Tooltip content="모두 지우기" position="top" className="z-50" delay={200}>
        <button
          type="button"
          aria-label="프롬프트와 첨부한 참조 지우기"
          onClick={handleClick}
          disabled={disabled}
          className={twMerge(
            PROMPT_TOOLBAR_ICON_BUTTON_CLASSES,
            "focus:outline-none disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-base-fg/50",
            className,
          )}
        >
          <EraserIcon  className="h-4 w-4" />
        </button>
      </Tooltip>
      {/* Separates the destructive clear control from the generate side of
          the toolbar (count picker / credits / generate). */}
      <div aria-hidden className="h-5 w-px shrink-0 bg-base-fg/15" />
      <Modal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        title="모두 지울까요?"
        className="max-w-md"
        showClose={false}
      >
        <div className="text-sm text-base-fg">
          프롬프트를 지우고 첨부한 참조도 제거합니다.
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setIsConfirmOpen(false)}>
            취소
          </Button>
          <Button variant="destructive" onClick={handleConfirm}>
            모두 지우기
          </Button>
        </div>
      </Modal>
    </>
  );
};
