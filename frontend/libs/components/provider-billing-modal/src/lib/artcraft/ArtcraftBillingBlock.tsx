import { PricingContent } from "@storyteller/ui-pricing-modal";

interface ArtcraftBillingBlockProps {
  isVideoPage?: boolean;
}

export function ArtcraftBillingBlock({
  isVideoPage = false,
}: ArtcraftBillingBlockProps) {
  const title = isVideoPage
    ? "영상 생성은 많은 자원이 필요합니다"
    : "구독하고 크레딧으로 생성하세요";

  const subtitle = isVideoPage
    ? `고품질 영상을 만들려면 많은 컴퓨팅 자원이 필요합니다. 
       더 많이 생성하려면 ArtCraft를 구독하거나 ArtCraft 크레딧을 구매하세요. 
       다른 업체 서비스를 추가해 기존 구독을 사용할 수도 있습니다.
       여러분의 후원은 ArtCraft를 계속 만들고 개선하는 데 큰 힘이 됩니다! 
       평생 소유할 수 있는 이미지·영상 도구를 만들고 있습니다.`
    : `더 많이 생성하려면 ArtCraft를 구독하거나 크레딧을 구매하세요. 
       다른 업체 서비스를 추가해 기존 구독을 사용할 수도 있습니다.
       여러분의 후원은 오픈소스 개발을 지원하고 ArtCraft를 계속 발전시킵니다!
       평생 소유할 수 있는 창작 도구를 만들고 있습니다.`;

  return (
    <div className="w-full">
      <PricingContent title={title} subtitle={subtitle} />
    </div>
  );
}
