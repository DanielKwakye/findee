"use client";

import { useQuery } from "@tanstack/react-query";
import { getCheckoutPlans } from "@/features/checkout/server/get.checkout.plans.action";

/** Loads the sticker plans shared by pricing and checkout. */
export function usePricing() {
  return useQuery({ queryKey: ["checkout", "plans"], queryFn: getCheckoutPlans });
}
