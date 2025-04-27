"use client";

export const trackEvent = (event: string, params?: Record<string, unknown>) => {
  if (typeof window === "undefined") return;

  try {
    window.Tea?.event(event, params);
  } catch (error) {
    console.error("trackEvent error", error);
  }
};
