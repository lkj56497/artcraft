import { useEffect } from "react";
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { SoundManager } from "@storyteller/soundboard";
import { toast } from "@storyteller/ui-toaster";
import { GenerationAction, GenerationModel, GenerationServiceProvider } from "./common";
import { BasicEventWrapper } from "../../common/BasicEventWrapper";

type GenerationCompleteEvent = {
  action?: GenerationAction,
  service: GenerationServiceProvider,
  model?: GenerationModel | string,
};

export const useGenerationCompleteEvent = () => {
  useEffect(() => {
    let isUnmounted = false;
    let unlisten: Promise<UnlistenFn>;

    const setup = async () => {
      unlisten = listen<BasicEventWrapper<GenerationCompleteEvent>>('generation-complete-event', async (event) => {
        console.log("Generation complete event received:", event);
        await SoundManager.playGenerationSuccess();
        const message = makeMessage(event.payload.data);
        toast.success(message);
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

const makeMessage = (event: GenerationCompleteEvent) => {
  if (!event.action) {
    return "생성 완료!";
  }
  switch (event.action) {
    case GenerationAction.GenerateImage:
      return "이미지 생성 완료!";
    case GenerationAction.GenerateVideo:
      return "영상 생성 완료!";
    case GenerationAction.RemoveBackground:
      return "배경 제거 완료!";
    case GenerationAction.ImageTo3d:
      return "3D 모델 생성 완료!";
    case GenerationAction.GenerateGaussian:
      return "3D 월드 생성 완료!";
    default:
      return "생성 완료!";
  }
}
