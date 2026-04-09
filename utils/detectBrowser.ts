// utils/detectBrowser.ts
export function detectBrowser(): string {
  if (typeof window === "undefined") return "other"; // SSR guard

  const ua = navigator.userAgent;
  if (/Edg\//i.test(ua))                              return "edge";
  if (/OPR\/|Opera\//i.test(ua))                      return "opera";
  if (/Firefox\/|FxiOS\//i.test(ua))                  return "firefox"; // FxiOS = Firefox trên iOS
  if (/CriOS\//i.test(ua))                            return "chrome";  // Chrome trên iOS
  if (/Chrome\//.test(ua) && !/Chromium\//.test(ua))  return "chrome";
  if (/Safari\//.test(ua) && !/Chrome\//.test(ua))    return "safari";
  if (/Chromium\//i.test(ua))                         return "chrome";

  return "other";
}