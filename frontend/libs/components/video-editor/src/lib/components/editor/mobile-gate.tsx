"use client";

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";

const STORAGE_KEY = "mobile-acknowledged";

interface MobileGateProps {
  children: React.ReactNode;
}

export function MobileGate({ children }: MobileGateProps) {
  const navigate = useNavigate();
  const [show, setShow] = useState<boolean | null>(null);

  useEffect(() => {
    const isMobile = window.innerWidth < 1024;
    const acknowledged = localStorage.getItem(STORAGE_KEY) === "true";
    setShow(isMobile && !acknowledged);
  }, []);

  if (show === null) return null;
  if (!show) return <>{children}</>;

  const handleContinue = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setShow(false);
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="bg-background relative flex h-full w-full flex-col overflow-hidden">
      <Button
        variant="text"
        className="absolute top-6 left-6 flex items-center gap-1 text-muted-foreground"
        onClick={handleGoBack}
      >
        <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
        <span className=" text-sm">돌아가기</span>
      </Button>

      <div className="flex flex-1 flex-col justify-center gap-5 px-7">
        <div className="flex flex-col gap-3">
          <h1 className="text-foreground text-3xl font-bold tracking-tight">
            데스크톱 전용 (현재)
          </h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            이 편집기는 아직 모바일·아이패드에 최적화되지 않았습니다. 기능이 깨지고 레이아웃이 엉망일 수 있으니 데스크톱에서 이용해 주세요.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleContinue}>그래도 둘러보기</Button>
          <Button variant="ghost" asChild>
            <Link to="/roadmap" className="flex items-center gap-1">
              로드맵
              <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
