export type GuideEventName =
  | "guide:projectCount"
  | "guide:selectedFramework"
  | "guide:customizedWidget"
  | "guide:copiedPopup"
  | "guide:copiedInline"
  | "guide:viewedProject"
  | "guide:hasSubscribers";

export function publishGuideEvent<T = any>(name: GuideEventName, detail?: T) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(name, { detail }));
}
