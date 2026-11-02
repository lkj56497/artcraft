import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { Label } from "../../components/ui/label";

export function RenameProjectDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  projectName,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (newName: string) => void;
  projectName: string;
}) {
  const [name, setName] = useState(projectName);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setName(projectName);
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>프로젝트 이름 변경</DialogTitle>
        </DialogHeader>

        <DialogBody className="gap-3">
          <Label>새 이름</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onConfirm(name);
              }
            }}
            placeholder="새 이름 입력"
          />
        </DialogBody>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onOpenChange(false);
            }}
          >
            취소
          </Button>
          <Button onClick={() => onConfirm(name)}>이름 변경</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
