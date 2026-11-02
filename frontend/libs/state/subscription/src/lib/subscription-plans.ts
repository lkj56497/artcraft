import { SubscriptionPlanDetails } from "./subscription-plan-details.js";

export const FREE_PLAN: SubscriptionPlanDetails = {
  slug: "free",
  name: "Free",
  isPaidPlan: false,
  monthlyPrice: 0,
  yearlyPrice: 0,
  features: [
    { text: "매일 무료 생성", included: true },
    { text: "ArtCraft 도구 제한적 사용", included: true },
    { text: "GPT-Image-1 이미지 약 10장", included: true },
    { text: "Kling 영상 약 1분", included: true },
  ],
  colorScheme: "dark" as const,
};

export const SUBSCRIPTION_PLANS: SubscriptionPlanDetails[] = [
  FREE_PLAN,
  {
    slug: "artcraft_basic",
    name: "Basic",
    isPaidPlan: true,
    monthlyPrice: 8,
    yearlyPrice: 96,
    originalMonthlyPrice: 10,
    originalYearlyPrice: 120,
    features: [
      { text: "월 1,000 크레딧", included: true },
      { text: "Nano Banana 이미지 약 250장", included: true },
      { text: "Nano Banana Pro 이미지 약 67장", included: true },
      { text: "Nano Banana Pro 4K 이미지 약 33장", included: true },
      { text: "GPT-Image-1.5 이미지 약 200장", included: true },
      { text: "Seedance 2.0 영상 약 63초", included: true, seedanceOnly: true },
      { text: "Kling 3.0 Pro 영상 약 45초", included: true },
      { text: "ArtCraft는 영원히 내 것", included: true },
    ],
    colorScheme: "green" as const,
  },
  {
    slug: "artcraft_pro",
    name: "Pro",
    isPaidPlan: true,
    monthlyPrice: 28,
    yearlyPrice: 336,
    originalMonthlyPrice: 35,
    originalYearlyPrice: 420,
    features: [
      { text: "월 3,750 크레딧", included: true },
      { text: "Nano Banana 이미지 약 938장", included: true },
      { text: "Nano Banana Pro 이미지 약 250장", included: true },
      { text: "Nano Banana Pro 4K 이미지 약 125장", included: true },
      { text: "GPT-Image-1.5 이미지 약 750장", included: true },
      { text: "Seedance 2.0 영상 약 234초", included: true, seedanceOnly: true },
      { text: "Kling 3.0 Pro 영상 약 167초", included: true },
      { text: "ArtCraft는 영원히 내 것", included: true },
    ],
    colorScheme: "purple" as const,
  },
  {
    slug: "artcraft_max",
    name: "Max",
    isPaidPlan: true,
    monthlyPrice: 48,
    yearlyPrice: 576,
    originalMonthlyPrice: 60,
    originalYearlyPrice: 720,
    features: [
      { text: "월 6,600 크레딧", included: true },
      { text: "Nano Banana 이미지 약 1,650장", included: true },
      { text: "Nano Banana Pro 이미지 약 440장", included: true },
      { text: "Nano Banana Pro 4K 이미지 약 220장", included: true },
      { text: "GPT-Image-1.5 이미지 약 1,320장", included: true },
      { text: "Seedance 2.0 영상 약 413초", included: true, seedanceOnly: true },
      { text: "Kling 3.0 Pro 영상 약 295초", included: true },
      { text: "ArtCraft는 영원히 내 것", included: true },
    ],
    colorScheme: "orange" as const,
  },
];

export const SUBSCRIPTION_PLANS_BY_SLUG: Map<string, SubscriptionPlanDetails> =
  new Map(SUBSCRIPTION_PLANS.map((plan) => [plan.slug, plan]));
