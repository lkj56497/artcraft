"use client";

import {
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
} from "../../components/ui/context-menu";
import { usePreviewViewport } from "./preview-viewport";
import { useEditor } from "../../editor/use-editor";
import type { PreviewOverlayControl } from "../overlays";
import { useEditorAdapters } from "../../EditorProvider";

export function PreviewContextMenu({
  onToggleFullscreen,
  container,
  overlayControls,
  onOverlayVisibilityChange,
}: {
  onToggleFullscreen: () => void;
  container: HTMLElement | null;
  overlayControls: PreviewOverlayControl[];
  onOverlayVisibilityChange: (params: {
    overlayId: string;
    isVisible: boolean;
  }) => void;
}) {
  const editor = useEditor();
  const viewport = usePreviewViewport();
  const { toast } = useEditorAdapters();

  const handleCopySnapshot = async () => {
    const result = await editor.renderer.copySnapshot();

    if (!result.success) {
      toast.error("스냅샷 복사 실패", {
        description: result.error ?? "다시 시도해 주세요",
      });
      return;
    }
  };

  const handleSaveSnapshot = async () => {
    const result = await editor.renderer.saveSnapshot();

    if (!result.success) {
      toast.error("스냅샷 저장 실패", {
        description: result.error ?? "다시 시도해 주세요",
      });
      return;
    }
  };

  return (
    <ContextMenuContent className="w-56" container={container}>
      <ContextMenuItem onClick={viewport.fitToScreen} inset>
        화면에 맞추기
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={onToggleFullscreen} inset>
        전체 화면
      </ContextMenuItem>
      <ContextMenuItem onClick={handleSaveSnapshot} inset>
        스냅샷 저장
      </ContextMenuItem>
      <ContextMenuItem onClick={handleCopySnapshot} inset>
        스냅샷 복사
      </ContextMenuItem>
      {overlayControls.length > 0 ? <ContextMenuSeparator /> : null}
      {overlayControls.map((overlayControl) => (
        <ContextMenuCheckboxItem
          key={overlayControl.id}
          checked={overlayControl.isVisible}
          onCheckedChange={(checked) =>
            onOverlayVisibilityChange({
              overlayId: overlayControl.id,
              isVisible: !!checked,
            })
          }
        >
          {overlayControl.label}
        </ContextMenuCheckboxItem>
      ))}
    </ContextMenuContent>
  );
}
