import {
  showActionReminder,
  isActionReminderOpen,
} from "@storyteller/ui-action-reminder-modal";

export interface FolderDropPromptOptions {
  count: number;
  targetFolderName?: string;
  onMove: () => void | Promise<void>;
  onAdd: () => void | Promise<void>;
}

/**
 * Ask whether to move items into a folder or add a copy. Used when the items
 * come from another folder (folder → folder). "Move here" removes them from the
 * source; "Add a copy" keeps them in both; the X / backdrop cancels.
 */
export function promptFolderDrop({
  count,
  targetFolderName,
  onMove,
  onAdd,
}: FolderDropPromptOptions): void {
  const plural = count === 1 ? "" : "s";
  const dest = targetFolderName ? ` to "${targetFolderName}"` : "";
  showActionReminder({
    reminderType: "default",
    title: `항목 ${count}개를 이동하거나 복사할까요?`,
    message: (
      <p className="text-sm text-white/70">
        '이동'{dest}하면 현재 폴더에서 빠집니다. '복사본 추가'는 양쪽에 모두 둡니다.
      </p>
    ),
    primaryActionText: "여기로 이동",
    onPrimaryAction: async () => {
      try {
        await onMove();
      } finally {
        isActionReminderOpen.value = false;
      }
    },
    secondaryActionText: "복사본 추가",
    onSecondaryAction: async () => {
      try {
        await onAdd();
      } finally {
        isActionReminderOpen.value = false;
      }
    },
  });
}
