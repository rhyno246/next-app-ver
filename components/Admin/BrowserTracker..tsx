// components/BrowserTracker.tsx
"use client";
import { useEffect } from "react";
import { useMutation } from "@apollo/client/react";
import { detectBrowser } from "@/utils/detectBrowser";
import { TRACK_BROWSER } from "@/graphql/queries";

export default function BrowserTracker() {
  const [trackBrowser] = useMutation(TRACK_BROWSER);

  useEffect(() => {
    if (sessionStorage.getItem("browser_tracked")) return;

    const browser = detectBrowser();

    trackBrowser({ variables: { browser } })
      .then(() => sessionStorage.setItem("browser_tracked", "1"))
      .catch(console.error);
  }, []);

  return null; // không render gì cả
}
