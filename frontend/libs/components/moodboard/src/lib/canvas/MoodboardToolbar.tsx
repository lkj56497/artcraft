import { Grid3x3Icon, GripVerticalIcon, GroupIcon, ImagesIcon, MagnetIcon, MousePointerIcon, PenToolIcon, PlusIcon, RotateCcwIcon, RotateCwIcon, TrashIcon, TypeIcon, UngroupIcon, UploadIcon, WorkflowIcon } from "lucide-react";
import { ButtonIconSelect } from "@storyteller/ui-button-icon-select";
import { PopoverMenu } from "@storyteller/ui-popover";
import { Tooltip } from "@storyteller/ui-tooltip";
import {
  FloatingToolbar,
  FloatingToolbarButton,
  FloatingToolbarDivider,
} from "./FloatingToolbar";
import { useMoodboardStore } from "./MoodboardStore";
import { Tool } from "./types";
import { MOD, fmtShortcut } from "./overlays/shortcuts";
import { computeFitToGridPatches } from "./layout/fitToGrid";
import { computeAABB } from "./layout/geometry";
import { computePackPatches } from "./layout/packCollage";
import { clusterByProximity } from "./layout/clusterProximity";

const MODES: Array<{
  value: Tool;
  icon: typeof MousePointerIcon;
  tooltip: string;
}> = [
  { value: "select", icon: MousePointerIcon, tooltip: "선택 (V)" },
  { value: "lasso", icon: PenToolIcon, tooltip: "올가미 (L)" },
  { value: "text", icon: TypeIcon, tooltip: "텍스트 (T)" },
];

interface Props {
  onUploadClick: () => void;
  onGalleryClick: () => void;
}

export const MoodboardToolbar = ({ onUploadClick, onGalleryClick }: Props) => {
  const tool = useMoodboardStore((s) => s.tool);
  const setTool = useMoodboardStore((s) => s.setTool);
  const group = useMoodboardStore((s) => s.group);
  const groupClusters = useMoodboardStore((s) => s.groupClusters);
  const ungroup = useMoodboardStore((s) => s.ungroup);
  const deleteSelected = useMoodboardStore((s) => s.deleteSelected);
  const undo = useMoodboardStore((s) => s.undo);
  const redo = useMoodboardStore((s) => s.redo);
  const applyLayoutPatches = useMoodboardStore((s) => s.applyLayoutPatches);
  const selectedIds = useMoodboardStore((s) => s.selectedIds);
  const nodes = useMoodboardStore((s) => s.nodes);
  const rootOrder = useMoodboardStore((s) => s.rootOrder);
  const gridSpacing = useMoodboardStore((s) => s.gridSpacing);
  const snapEnabled = useMoodboardStore((s) => s.snapEnabled);
  const toggleSnap = useMoodboardStore((s) => s.toggleSnap);

  const handleFitToGrid = () => {
    if (selectedIds.size === 0) return;
    const targetNodes = Array.from(selectedIds)
      .map((id) => nodes[id])
      .filter(Boolean);
    applyLayoutPatches(computeFitToGridPatches(targetNodes, gridSpacing));
  };

  const handlePackCollage = () => {
    const ids = selectedIds.size > 0 ? Array.from(selectedIds) : rootOrder;
    const targetNodes = ids
      .map((id) => nodes[id])
      .filter((n) => n && n.parentId === null);
    if (targetNodes.length < 2) return;
    const aabb = computeAABB(targetNodes);
    if (!aabb) return;
    applyLayoutPatches(computePackPatches(targetNodes, aabb));
  };

  const handleAutoGroup = () => {
    const ids = selectedIds.size > 0 ? Array.from(selectedIds) : rootOrder;
    const targetNodes = ids
      .map((id) => nodes[id])
      .filter((n) => n && n.parentId === null);
    if (targetNodes.length < 2) return;
    const clusters = clusterByProximity(targetNodes);
    const clusterIds = clusters.map((c) => c.map((n) => n.id));
    groupClusters(clusterIds);
  };

  const handleAddAction = (action: string) => {
    if (action === "upload") onUploadClick();
    else if (action === "library") onGalleryClick();
  };

  return (
    <FloatingToolbar>
      <Tooltip
        content="이미지 추가"
        position="bottom"
        delay={300}
        closeOnClick
      >
        <PopoverMenu
          mode="button"
          position="bottom"
          panelTitle="이미지 추가"
          items={[
            {
              label: "이미지 업로드",
              selected: false,
              icon: (
                <UploadIcon
                  
                  className="h-4 w-4" />
              ),
              action: "upload",
            },
            {
              label: "라이브러리에서 선택",
              selected: false,
              icon: <ImagesIcon  className="h-4 w-4" />,
              action: "library",
            },
          ]}
          onPanelAction={handleAddAction}
          showIconsInList
          buttonClassName="h-9 w-9 rounded-[10px] border-transparent bg-primary/90 text-lg text-white hover:bg-primary/70"
          triggerIcon={<PlusIcon  className="text-xl" />}
        />
      </Tooltip>

      <FloatingToolbarDivider />

      <ButtonIconSelect
        options={MODES}
        onOptionChange={(value) => setTool(value as Tool)}
        selectedOption={tool}
      />

      <FloatingToolbarDivider />

      <FloatingToolbarButton
        icon={GroupIcon}
        label={`그룹 (${fmtShortcut([MOD, "G"])})`}
        onClick={() => group()}
        disabled={selectedIds.size < 2}
        tooltipDelay={100}
      />
      <FloatingToolbarButton
        icon={UngroupIcon}
        label={`그룹 해제 (${fmtShortcut([MOD, "Shift", "G"])})`}
        onClick={() => ungroup()}
        disabled={selectedIds.size === 0}
        tooltipDelay={100}
      />

      <FloatingToolbarDivider />

      <FloatingToolbarButton
        icon={Grid3x3Icon}
        label="격자에 맞추기"
        onClick={handleFitToGrid}
        disabled={selectedIds.size === 0}
        tooltipDelay={100}
      />
      <FloatingToolbarButton
        icon={GripVerticalIcon}
        label="콜라주로 정렬"
        onClick={handlePackCollage}
        tooltipDelay={100}
      />
      <FloatingToolbarButton
        icon={WorkflowIcon}
        label="가까운 항목끼리 자동 그룹"
        onClick={handleAutoGroup}
        tooltipDelay={100}
      />
      <FloatingToolbarButton
        icon={MagnetIcon}
        label={snapEnabled ? "스냅 켜짐" : "스냅 꺼짐"}
        active={snapEnabled}
        onClick={toggleSnap}
        tooltipDelay={100}
      />

      <FloatingToolbarDivider />

      <FloatingToolbarButton
        icon={RotateCcwIcon}
        label={`실행 취소 (${fmtShortcut([MOD, "Z"])})`}
        onClick={undo}
        tooltipDelay={100}
      />
      <FloatingToolbarButton
        icon={RotateCwIcon}
        label={`다시 실행 (${fmtShortcut([MOD, "Shift", "Z"])})`}
        onClick={redo}
        tooltipDelay={100}
      />
      <FloatingToolbarButton
        icon={TrashIcon}
        label="삭제 (Del)"
        onClick={deleteSelected}
        disabled={selectedIds.size === 0}
        tooltipDelay={100}
      />
    </FloatingToolbar>
  );
};
