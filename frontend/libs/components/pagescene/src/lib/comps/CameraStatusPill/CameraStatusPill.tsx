import { useContext } from "react";
import { MoveIcon, VideoIcon } from "lucide-react";
import { Button } from "@storyteller/ui-button";
import { twMerge } from "tailwind-merge";
import { Tooltip } from "@storyteller/ui-tooltip";
import { EngineContext } from "../../contexts/EngineContext";
import { toggleCameraView } from "../../actions";
import { usePageSceneStore } from "../../PageSceneStore";
import { EditorStates } from "../../enums";
import { TOOLBAR_BUTTON_CLASS_NAME } from "../toolbarStyles";

// Small status pill (top-left) showing which camera the viewport is driving:
// the free "Viewport" camera vs looking through a render camera. Clicking it
// toggles camera view. Hidden in record mode (that mode is self-evident).
export const CameraStatusPill = () => {
  const editor = useContext(EngineContext);
  const editorState = usePageSceneStore((s) => s.editorState);
  const sceneMode = usePageSceneStore((s) => s.sceneMode);
  const cameras = usePageSceneStore((s) => s.cameras);

  if (sceneMode === "record") return null;

  const inCameraView = editorState === EditorStates.CAMERA_VIEW;
  const renderCameraLabel =
    cameras.find((c) => c.id !== "main")?.label ?? "Camera";

  return (
    <Tooltip
      content={inCameraView ? "렌더 카메라로 보는 중" : "자유 뷰포트 카메라"}
      position="bottom"
      delay={300}
    >
      <Button
        type="button"
        variant="secondary"
        icon={inCameraView ? VideoIcon : MoveIcon}
        aria-pressed={inCameraView}
        onClick={() => editor && toggleCameraView(editor)}
        className={twMerge(
          TOOLBAR_BUTTON_CLASS_NAME,
          inCameraView && "border-white/30 bg-white/10",
        )}
      >
        {inCameraView ? renderCameraLabel : "뷰포트"}
      </Button>
    </Tooltip>
  );
};

export default CameraStatusPill;
