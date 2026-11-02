import { DraggableItem } from "../../panels/assets/draggable-item";
import { PanelView } from "../../panels/assets/views/base-panel";
import { useEditor } from "../../editor/use-editor";
import { DEFAULTS } from "../../timeline/defaults";
import { buildTextElement } from "../../timeline/element-utils";
import type { MediaTime } from "../../wasm";

export function TextView() {
  const editor = useEditor();

  const handleAddToTimeline = ({ currentTime }: { currentTime: MediaTime }) => {
    const activeScene = editor.scenes.getActiveScene();
    if (!activeScene) return;

    const element = buildTextElement({
      raw: DEFAULTS.text.element,
      startTime: currentTime,
    });

    editor.timeline.insertElement({
      element,
      placement: { mode: "auto" },
    });
  };

  return (
    <PanelView title="텍스트">
      <DraggableItem
        name="기본 텍스트"
        preview={
          <div className="bg-accent flex size-full items-center justify-center rounded-lg">
            <span className="text-xs select-none">기본 텍스트</span>
          </div>
        }
        dragData={{
          id: "temp-text-id",
          type: DEFAULTS.text.element.type,
          name: DEFAULTS.text.element.name,
          content: "기본 텍스트",
        }}
        aspectRatio={1}
        onAddToTimeline={handleAddToTimeline}
        shouldShowLabel={false}
      />
    </PanelView>
  );
}
