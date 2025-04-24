"use client";

import { trackEvent } from "@/utils/tea";

export const trackPageClick = (
  event: string,
  params?: Record<string, unknown>,
) => {
  if (typeof window === "undefined") return;
  trackEvent(event, params);
};
