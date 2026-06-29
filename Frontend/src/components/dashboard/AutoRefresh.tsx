"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AutoRefreshProps {
  intervalMs?: number; 
}

export function AutoRefresh({ intervalMs = 90 * 60 * 1000 }: AutoRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    // Set up an interval to refresh the current route (triggering a new server-side fetch)
    const intervalId = setInterval(() => {
      console.log("Auto-refreshing dashboard data...");
      router.refresh();
    }, intervalMs);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [router, intervalMs]);

  return null; // This component doesn't render anything visibly
}
