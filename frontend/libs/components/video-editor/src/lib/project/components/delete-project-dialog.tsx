import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";

export function DeleteProjectDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  projectNames,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  projectNames: string[];
}) {
  const count = projectNames.length;
  const isSingle = count === 1;
  const singleName = isSingle ? projectNames[0] : null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          event.stopPropagation();
        }}
      >
        <DialogHeader>
          <DialogTitle>
            {singleName ? (
              <>
                {"'"}
                <span className="inline-block max-w-[300px] truncate align-bottom">
                  {singleName}
                </span>
                {"'을(를) 삭제할까요?"}
              </>
            ) : (
              `프로젝트 ${count}개를 삭제할까요?`
            )}
          </DialogTitle>
        </DialogHeader>
        <DialogBody>
          <Alert variant="destructive">
            <AlertTitle>경고</AlertTitle>
            <AlertDescription>
              {singleName ? `"${singleName}"` : `프로젝트 ${count}개`}와(과) 관련된 모든 파일을{" "}
              영구적으로 삭제합니다.
            </AlertDescription>
          </Alert>
          <div className="flex flex-col gap-3">
            <Label className="text-xs font-semibold text-slate-500">
              확인하려면 "DELETE"를 입력하세요
            </Label>
            <Input
              type="text"
              placeholder="DELETE"
              size="lg"
              variant="destructive"
            />
          </div>
        </DialogBody>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            취소
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            프로젝트 삭제
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
