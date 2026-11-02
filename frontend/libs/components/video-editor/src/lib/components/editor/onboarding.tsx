"use client";

import { ArrowRightIcon } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogBody, DialogContent, DialogTitle } from "../ui/dialog";

// Local-storage hook mirroring opencut-classic's services/storage/use-local-storage.
// Inlined here so the editor lib doesn't drag in a host-only services tree.
function useLocalStorage<T>({
  key,
  defaultValue,
}: {
  key: string;
  defaultValue: T;
}): [
  T,
  ({ value }: { value: T | ((previousValue: T) => T) }) => void,
  boolean,
] {
  const [value, setValue] = useState<T>(defaultValue);
  const [isReady, setIsReady] = useState(false);
  const valueRef = useRef(defaultValue);

  // avoid hydration mismatch by reading after mount
  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(key);
      if (storedValue !== null) {
        const parsedValue = JSON.parse(storedValue) as T;
        valueRef.current = parsedValue;
        setValue(parsedValue);
      }
    } catch {
      // localstorage might be unavailable
    }
    setIsReady(true);
  }, [key]);

  // sync to localstorage after hydration
  useEffect(() => {
    if (!isReady) return;

    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localstorage might be full or disabled
    }
  }, [key, value, isReady]);

  const setValueWithCallback = useCallback(
    ({ value: nextValue }: { value: T | ((previousValue: T) => T) }) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (previousValue: T) => T)(valueRef.current)
          : nextValue;

      valueRef.current = resolvedValue;
      setValue(resolvedValue);
    },
    [],
  );

  return [value, setValueWithCallback, isReady];
}

export function Onboarding() {
  const [step, setStep] = useState(0);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useLocalStorage({
    key: "hasSeenOnboarding",
    defaultValue: false,
  });

  const isOpen = !hasSeenOnboarding;

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleClose = () => {
    setHasSeenOnboarding({ value: true });
  };

  const getStepTitle = () => {
    switch (step) {
      case 0:
        return "편집기에 오신 걸 환영합니다";
      case 1:
        return "초기 미리보기 — 다듬어지지 않은 부분이 있을 수 있습니다";
      case 2:
        return "즐겁게 만들어 보세요!";
      default:
        return "Editor Onboarding";
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-5">
            <div className="space-y-3">
              <Title title="편집기에 오신 걸 환영합니다" />
              <Description description="미디어를 타임라인에 놓고, 재생 헤드를 움직여 미리보고, 오른쪽 패널에서 속성·애니메이션·효과를 조정하세요." />
            </div>
            <NextButton onClick={handleNext}>다음</NextButton>
          </div>
        );
      case 1:
        return (
          <div className="space-y-5">
            <div className="space-y-3">
              <Title title={getStepTitle()} />
              <Description description="이 편집기는 한창 개발 중입니다." />
              <Description description="아직 만드는 중인 기능이 많습니다 — 이상해 보이면 실제로 문제일 수 있으니 자주 저장하세요." />
            </div>
            <NextButton onClick={handleNext}>다음</NextButton>
          </div>
        );
      case 2:
        return (
          <div className="space-y-5">
            <div className="space-y-3">
              <Title title={getStepTitle()} />
              <Description description="단축키는 프로젝트 메뉴의 '단축키' 항목에서 보거나 바꿀 수 있습니다." />
            </div>
            <NextButton onClick={handleClose}>마치기</NextButton>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>
          <span className="sr-only">{getStepTitle()}</span>
        </DialogTitle>
        <DialogBody>{renderStepContent()}</DialogBody>
      </DialogContent>
    </Dialog>
  );
}

function Title({ title }: { title: string }) {
  return <h2 className="text-lg font-bold md:text-xl">{title}</h2>;
}

function Description({ description }: { description: string }) {
  return (
    <div className="text-muted-foreground">
      <p className="mb-0">{description}</p>
    </div>
  );
}

function NextButton({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Button onClick={onClick} variant="default" className="w-full">
      {children}
      <ArrowRightIcon className="size-4" />
    </Button>
  );
}
