import { Label } from "@storyteller/ui-label";
import { Switch } from "@storyteller/ui-switch";
import { useEnterToGenerateStore } from "@storyteller/ui-promptbox";
import { useModelPickerStyleStore } from "@storyteller/ui-popover";
import { useKeybindsStore } from "@storyteller/keybinds";

interface MiscSettingsPaneProps {}

export const MiscSettingsPane = (args: MiscSettingsPaneProps) => {
  const enterToGenerate = useEnterToGenerateStore((s) => s.enabled);
  const setEnterToGenerate = useEnterToGenerateStore((s) => s.setEnabled);

  const modelPickerStyle = useModelPickerStyleStore((s) => s.style);
  const setModelPickerStyle = useModelPickerStyleStore((s) => s.setStyle);

  const cheatsheetSticky = useKeybindsStore((s) => s.cheatsheetSticky);
  const setCheatsheetSticky = useKeybindsStore((s) => s.setCheatsheetSticky);

  return (
    <div className="space-y-4 text-base-fg">
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="enter-to-generate">Enter로 생성</Label>
          <p className="text-xs opacity-70">
            켜면 Enter로 프롬프트를 제출하고 Shift+Enter로 줄을 바꿉니다. 끄면(기본값) Enter와 Shift+Enter 모두 줄바꿈이며, 제출은 버튼으로만 합니다.
          </p>
        </div>
        <Switch enabled={enterToGenerate} setEnabled={setEnterToGenerate} />
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="group-models-by-family">모델을 계열별로 묶기</Label>
          <p className="text-xs opacity-70">
            켜면(기본값) 모델 선택기에서 Seedance, Veo처럼 계열별 하위 메뉴로 묶어 보여줍니다. 끄면 모든 모델을 한 목록에 표시합니다.
          </p>
        </div>
        <Switch
          enabled={modelPickerStyle === "grouped"}
          setEnabled={(on) => setModelPickerStyle(on ? "grouped" : "flat")}
        />
      </div>
      <div className="flex flex-col gap-2 pt-3">
        <div className="flex flex-col gap-0.5">
          <Label htmlFor="cheatsheet-sticky">
            단축키 안내 계속 표시
          </Label>
          <p className="text-xs opacity-70">
            편집기에서 Ctrl(Mac은 ⌘)만 몇 초 누르고 있으면 단축키 안내가 나타납니다. 켜면 키를 떼도 Esc를 누르거나 바깥을 클릭할 때까지 남아 있습니다. 끄면(기본값) 키를 떼는 즉시 사라집니다.
          </p>
        </div>
        <Switch enabled={cheatsheetSticky} setEnabled={setCheatsheetSticky} />
      </div>
    </div>
  );
};
