import { useEffect } from "react";
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { SoundManager } from "@storyteller/soundboard";
import { toast } from "@storyteller/ui-toaster";
import { GenerationAction, GenerationModel, GenerationServiceProvider } from "./common";
import { BasicEventWrapper } from "../../common/BasicEventWrapper";

type GenerationFailedEvent = {
  action: GenerationAction,
  service: GenerationServiceProvider,
  model?: GenerationModel | string,
  reason?: string,
};

export const useGenerationFailedEvent = () => {
  useEffect(() => {
    let isUnmounted = false;
    let unlisten: Promise<UnlistenFn>;

    const setup = async () => {
      unlisten = listen<BasicEventWrapper<GenerationFailedEvent>>('generation-failed-event', async (event) => {
        console.log("Generation failed event received:", event);
        await SoundManager.playGenerationFailure();
        const message = makeMessage(event.payload.data);
        toast.error(message);
      });

      if (isUnmounted) {
        unlisten.then(f => f()); // Unsubscribe if unmounted early.
      }
    };

    setup();
    
    return () => {
      isUnmounted = true;
      unlisten.then(f => f());
    };

  }, []);
}

const makeMessage = (event: GenerationFailedEvent) => {
  if (!!event.reason) {
    return event.reason;
  }
  switch (event.action) {
    case GenerationAction.GenerateImage:
      return "이미지 생성 실패!";
    case GenerationAction.GenerateVideo:
      return "영상 생성 실패!";
    case GenerationAction.RemoveBackground:
      return "배경 제거 실패!";
    case GenerationAction.ImageTo3d:
      return "3D 모델 생성 실패!";
    case GenerationAction.GenerateGaussian:
      return "3D 월드 생성 실패!";
    default:
      return "생성 실패!";
  }
}
