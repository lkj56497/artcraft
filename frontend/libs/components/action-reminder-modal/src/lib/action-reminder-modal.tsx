import { Button } from "@storyteller/ui-button";
import { Modal } from "@storyteller/ui-modal";
import { ReactNode } from "react";
import { LogInIcon } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export type ReminderType = "default" | "soraLogin" | "artcraftLogin";

interface ActionReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  reminderType?: ReminderType;
  onPrimaryAction: () => void;
  title?: string;
  hideTitle?: boolean;
  message?: ReactNode;
  children?: ReactNode;
  primaryActionText?: string;
  secondaryActionText?: string;
  onSecondaryAction?: () => void;
  isLoading?: boolean;
  openAiLogo?: string;
  modalClassName?: string;
  primaryActionIcon?: LucideIcon;
  primaryActionBtnClassName?: string;
}

export function ActionReminderModal({
  isOpen,
  onClose,
  reminderType = "default",
  onPrimaryAction,
  title: customTitle,
  hideTitle = false,
  message: customMessage,
  children: customChildren,
  primaryActionText: customPrimaryActionText,
  secondaryActionText: customSecondaryActionText,
  onSecondaryAction,
  isLoading = false,
  modalClassName: customModalClassName = "",
  primaryActionIcon: customPrimaryActionIcon = LogInIcon,
  primaryActionBtnClassName: customPrimaryActionBtnClassName = "",
}: ActionReminderModalProps) {
  let titleText: string | undefined;
  let messageContent: ReactNode;
  let primaryActionBtnText: string;
  let primaryActionIcon = LogInIcon;
  let primaryActionBtnClassName = "";

  if (!hideTitle) {
    switch (reminderType) {
      case "soraLogin":
        titleText = customTitle || "Link Your OpenAI Sora Account";
        break;
      case "artcraftLogin":
        titleText = customTitle || "ArtCraft 로그인";
        break;
      default:
        titleText = customTitle || "Action Required";
        break;
    }
  } else {
    titleText = undefined;
  }

  switch (reminderType) {
    case "soraLogin":
      titleText = customTitle || "Link Your OpenAI Account";
      messageContent = customMessage || (
        <p>
          이 기능을 쓰려면 OpenAI 계정을 연결하세요. 기존 구독을 그대로 활용할 수 있습니다.
        </p>
      );
      primaryActionBtnText = customPrimaryActionText || "OpenAI로 로그인";
      primaryActionIcon = customPrimaryActionIcon || LogInIcon;
      primaryActionBtnClassName = customPrimaryActionBtnClassName || "";
      break;
    case "artcraftLogin":
      messageContent = customMessage || (
        <p className="text-sm text-white/70">
          계속하려면 ArtCraft에 로그인하거나 가입하세요. 작업을 저장하고 모든 기능을 사용할 수 있습니다.
        </p>
      );
      primaryActionBtnText = customPrimaryActionText || "Login / Sign Up";
      primaryActionIcon = customPrimaryActionIcon || LogInIcon;
      primaryActionBtnClassName = customPrimaryActionBtnClassName || "";
      break;
    default:
      messageContent = customMessage || (
        <p className="text-sm text-white/70">
          필요한 작업을 완료해 주세요.
        </p>
      );
      primaryActionBtnText = customPrimaryActionText || "Proceed";
      primaryActionIcon = customPrimaryActionIcon || LogInIcon;
      primaryActionBtnClassName = customPrimaryActionBtnClassName || "";
      break;
  }

  const effectiveSecondaryAction = onSecondaryAction || onClose;
  const effectiveSecondaryActionText = customSecondaryActionText || "Cancel";

  let modalSpecificClasses = "";

  const finalModalClassName =
    `${customModalClassName} ${modalSpecificClasses}`.trim();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={titleText}
      className={finalModalClassName}
    >
      <div>
        {customChildren ? (
          <div className="space-y-4">{customChildren}</div>
        ) : (
          <div className="space-y-4">{messageContent}</div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row-reverse gap-3">
          <Button
            onClick={onPrimaryAction}
            loading={isLoading}
            disabled={isLoading}
            icon={primaryActionIcon}
            className={twMerge("w-full sm:w-auto", primaryActionBtnClassName)}
          >
            {primaryActionBtnText}
          </Button>
          {(onSecondaryAction || customSecondaryActionText) && (
            <Button
              variant="secondary"
              onClick={effectiveSecondaryAction}
              disabled={isLoading}
              className="w-full sm:w-auto"
            >
              {effectiveSecondaryActionText}
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ActionReminderModal;
