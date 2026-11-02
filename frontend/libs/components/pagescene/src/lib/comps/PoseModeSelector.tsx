import React from "react";
import { useShallow } from "zustand/shallow";
import { Tooltip } from "@storyteller/ui-tooltip";
import { Button } from "@storyteller/ui-button";
import { CheckIcon, FilmIcon, FootprintsIcon } from "lucide-react";
import { usePageSceneStore } from "../PageSceneStore";
import { getActiveEditor } from "../contexts/EngineContext/EngineContext";
import { openAnimationsModal } from "../actions";

interface PoseModeSelectorProps {}

export const PoseModeSelector: React.FC<PoseModeSelectorProps> = () => {
  const { poseMode, showPoseControls, setPoseMode } = usePageSceneStore(
    useShallow((s) => ({
      poseMode: s.poseMode,
      showPoseControls: s.showPoseControls,
      setPoseMode: s.setPoseMode,
    })),
  );

  const handleModeChange = () => {
    setPoseMode(poseMode === "select" ? "pose" : "select");
    getActiveEditor()?.mouse_controls?.toggleFKMode();
  };

  if (!showPoseControls) {
    return null;
  }

  return (
    <div
      className="fixed left-1/2 top-32 flex -translate-x-1/2 transform items-center justify-center gap-2"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <Tooltip
        content={"포즈 모드 전환 (K)"}
        position={"bottom"}
        delay={300}
        closeOnClick={true}
      >
        <>
          {poseMode === "select" ? (
            <Button
              icon={FootprintsIcon}
              onClick={handleModeChange}
              className="rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
            >
              포즈 모드 시작
            </Button>
          ) : (
            <Button
              icon={CheckIcon}
              onClick={handleModeChange}
              className="rounded-[3px] outline-none  focus-visible:outline-none"
            >
              완료
            </Button>
          )}
        </>
      </Tooltip>
      {/* Animations-only library for the selected character. Hidden while
          posing so the row stays a single "Done" affordance. */}
      {poseMode === "select" && (
        <Tooltip
          content={"이 캐릭터에 애니메이션 추가"}
          position={"bottom"}
          delay={300}
          closeOnClick={true}
        >
          <Button
            icon={FilmIcon}
            onClick={() => openAnimationsModal()}
            className="rounded-[3px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-300"
          >
            애니메이션 추가
          </Button>
        </Tooltip>
      )}
    </div>
  );
};
