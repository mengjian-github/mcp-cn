"use client";

import { trackEvent } from "@/utils/track";

export const trackPageClick = (
  event: string,
  params?: Record<string, unknown>,
) => {
  if (typeof window === "undefined") return;
  trackEvent(event, params);
};
