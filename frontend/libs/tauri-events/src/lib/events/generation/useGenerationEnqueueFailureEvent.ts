import { useEffect } from "react";
import { listen, UnlistenFn } from '@tauri-apps/api/event';
import { SoundManager } from "@storyteller/soundboard";
import { toast } from "@storyteller/ui-toaster";
import { GenerationAction, GenerationModel, GenerationServiceProvider } from "./common";
import { BasicEventWrapper } from "../../common/BasicEventWrapper";

type GenerationEnqueueFailureEvent = {
  action: GenerationAction,
  service: GenerationServiceProvider,
  model?: GenerationModel | string,
  reason?: string,
}; 

export const useGenerationEnqueueFailureEvent = () => {
  useEffect(() => {
    let isUnmounted = false;
    let unlisten: Promise<UnlistenFn>;

    const setup = async () => {
      unlisten = listen<BasicEventWrapper<GenerationEnqueueFailureEvent>>('generation-enqueue-failure-event', async (event) => {
        console.log("Generation enqueue failure event received:", event);
        await SoundManager.playEnqueueFailure();
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

const makeMessage = (event: GenerationEnqueueFailureEvent) => {
  if (!!event.reason) {
    return event.reason;
  }
  switch (event.action) {
    case GenerationAction.GenerateImage:
      return "이미지 생성을 대기열에 넣지 못했습니다!";
    case GenerationAction.GenerateVideo:
      return "영상 생성을 대기열에 넣지 못했습니다!";
    case GenerationAction.RemoveBackground:
      return "배경 제거를 대기열에 넣지 못했습니다!";
    case GenerationAction.ImageTo3d:
      return "Couldn't enqueue 3D model generation!";
    case GenerationAction.GenerateGaussian:
      return "Couldn't enqueue 3D world generation!";
    default:
      return "생성을 대기열에 넣지 못했습니다!";
  }
}
