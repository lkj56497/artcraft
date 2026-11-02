import { ReactNode } from "react";
import { Modal } from "@storyteller/ui-modal";
import { Button } from "@storyteller/ui-button";
import { CoinsIcon, CreditCardIcon, TagIcon } from "lucide-react";
import { invoke } from "@tauri-apps/api/core";
import { OpenUrl } from "@storyteller/tauri-api";
import { useSubscriptionState } from "@storyteller/subscription";
import {
  BillingCadence,
  PricingSectionLabel,
  PricingTable,
  PROMO_PCT,
} from "@storyteller/ui-pricing-table";
import { usePricingModalStore } from "./pricing-modal-store";
import { useCreditsModalStore } from "./credits-modal-store";

const pricingConfig = {
  header: {
    title: "요금제 선택",
    subtitle:
      "넉넉한 생성량을 받고, 평생 소유하는 도구에 투자하세요. 여러분의 구독이 ArtCraft를 모두에게 무료·오픈소스로 유지하는 힘이 됩니다.",
  },
};

const SECONDARY_BUTTON_CLASSES =
  "gap-2 rounded-none border border-white/15 bg-white/5 px-3.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-white shadow-none hover:bg-white/10";

interface PricingContentProps {
  title?: string;
  subtitle?: string;
}

export function PricingContent({ title, subtitle }: PricingContentProps) {
  const subscriptionStore = useSubscriptionState();
  const hasActiveSub = subscriptionStore.hasPaidPlan();
  const activePlanSlug = hasActiveSub
    ? (subscriptionStore.subscriptionInfo?.productSlug ?? null)
    : null;

  const handleManageSubscription = async () => {
    await invoke("storyteller_open_customer_portal_manage_plan_command");
  };

  const handleUpdatePaymentMethod = async () => {
    await invoke(
      "storyteller_open_customer_portal_update_payment_method_command",
    );
  };

  const handleSetPlan = async (planSlug: string, cadence: BillingCadence) => {
    if (hasActiveSub) {
      await invoke("storyteller_open_customer_portal_switch_plan_command", {
        request: {
          plan: planSlug,
          cadence: cadence,
        },
      });
    } else {
      await invoke("storyteller_open_subscription_purchase_command", {
        request: {
          plan: planSlug,
          cadence: cadence,
        },
      });
    }
  };

  const handleBuyCredits = () => {
    usePricingModalStore.getState().closeModal();
    useCreditsModalStore.getState().openModal();
  };

  return (
    <div className="min-h-0 flex-1 bg-[#101014] text-white">
      <div className="bg-primary text-white">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 py-2.5 pl-6 pr-14 md:pl-10">
          <p className="pricing-hud flex items-center gap-2 font-bold">
            <TagIcon aria-hidden className="h-3.5 w-3.5" />
            기간 한정 혜택
          </p>
          <p className="text-sm">
            모든 요금제 {PROMO_PCT}% 할인 (월간·연간) — 오늘 최저가로 확정하세요.
          </p>
        </div>
      </div>

      <PricingSection>
        <PricingSectionLabel
          index="01"
          label="요금"
          annotation="무료 & 오픈소스 · 구독은 선택†"
        />
        <div className="px-6 py-12 md:px-10 md:py-16">
          <h1 className="max-w-3xl font-display text-4xl font-medium leading-[1.02] tracking-[-0.035em] text-white sm:text-5xl md:text-6xl">
            {title || pricingConfig.header.title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/55">
            {subtitle || pricingConfig.header.subtitle}
          </p>
          {hasActiveSub && (
            <div className="mt-6 flex flex-wrap gap-3">
              <Button
                variant="secondary"
                className={SECONDARY_BUTTON_CLASSES}
                onClick={handleBuyCredits}
              >
                <CoinsIcon aria-hidden className="h-4 w-4" />
                크레딧 추가 구매
              </Button>
              <Button
                variant="secondary"
                className={SECONDARY_BUTTON_CLASSES}
                onClick={handleUpdatePaymentMethod}
              >
                <CreditCardIcon aria-hidden className="h-4 w-4" />
                결제 수단 변경
              </Button>
            </div>
          )}
        </div>
      </PricingSection>

      <PricingSection>
        <PricingSectionLabel
          index="02"
          label="요금제 선택"
          annotation="모든 유료 요금제에 영상 크레딧 포함"
        />
        <PricingTable
          activePlanSlug={activePlanSlug}
          showSeedanceFeatures
          showEnterprise
          onChoosePlan={handleSetPlan}
          onManagePlan={handleManageSubscription}
          onContact={(mailtoUrl) => OpenUrl(mailtoUrl)}
        />
      </PricingSection>

      <PricingSection>
        <div className="grid md:grid-cols-2">
          <div className="p-6 md:p-10">
            <p className="pricing-hud text-white/40">크레딧이 더 필요하신가요?</p>
            <h2 className="mt-4 font-display text-2xl font-medium tracking-[-0.02em] text-white">
              1회성 크레딧 팩
            </h2>
            <p className="mt-2 max-w-md leading-relaxed text-white/55">
              요금제 변경 없이 충전하세요. 크레딧 팩은 만료되지 않습니다.
            </p>
            <Button
              variant="secondary"
              className={`mt-6 ${SECONDARY_BUTTON_CLASSES}`}
              onClick={handleBuyCredits}
            >
              <CoinsIcon aria-hidden className="h-4 w-4 text-primary" />
              크레딧 구매
            </Button>
          </div>
          <div className="border-t border-white/15 p-6 md:border-l md:border-t-0 md:p-10">
            <p className="pricing-hud text-white/40">† 참고</p>
            <p className="mt-4 max-w-md leading-relaxed text-white/55">
              ArtCraft는 구독 없이도 사용할 수 있습니다. 자신의 API 키와 다른 서비스 구독을 연결해 쓸 수 있습니다. 다만 구독해 주시면 개발 속도를 높이는 데 큰 도움이 됩니다.
            </p>
          </div>
        </div>
      </PricingSection>
    </div>
  );
}

function PricingSection({ children }: { children: ReactNode }) {
  return <section className="border-t border-white/15">{children}</section>;
}

interface PricingModalProps {}

export function PricingModal({}: PricingModalProps = {}) {
  const { isOpen, closeModal, title, subtitle } = usePricingModalStore();

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeModal}
      className="flex max-h-[90vh] max-w-screen-xl flex-col overflow-y-auto rounded-none border border-white/15 bg-[#101014]"
      allowBackgroundInteraction={false}
      showClose={true}
      closeOnOutsideClick={true}
      resizable={false}
      childPadding={false}
      backdropClassName="bg-black/80"
    >
      <PricingContent title={title} subtitle={subtitle} />
    </Modal>
  );
}

// Additional interfaces for Stripe integration
export interface SubscriptionData {
  currentPlanId: string;
  hasActiveSubscription: boolean;
  customerId?: string;
  subscriptionId?: string;
  billingCycle?: "monthly" | "yearly";
  nextBillingDate?: Date;
}

export default PricingModal;
