import {
  Button
} from "@storyteller/ui-button"

interface Props {
  title: string;
  onOk: () => void;
}

export const UploadSuccess = ({ title, onOk }: Props) => {
  return (
    <>
      <div className="w-100 text-center opacity-50">{`라이브러리에 ${title} 추가됨`}</div>
      <div className="mt-6 flex justify-end gap-2">
        <Button onClick={onOk} variant="primary">
          확인
        </Button>
      </div>
    </>
  );
};
