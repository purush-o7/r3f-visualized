"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "learn-r3f-visited";

function getVisited(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveVisited(visited: Set<string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...visited]));
  } catch {
    // localStorage may be full or unavailable
  }
}

export function useProgress() {
  const pathname = usePathname();
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setVisited(getVisited());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length >= 2) {
      setVisited((prev) => {
        const next = new Set(prev);
        if (next.has(pathname)) return prev;
        next.add(pathname);
        saveVisited(next);
        return next;
      });
    }
  }, [pathname, mounted]);

  const isVisited = useCallback(
    (href: string) => mounted && visited.has(href),
    [visited, mounted]
  );

  const getSectionProgress = useCallback(
    (topicHrefs: string[]) => {
      if (!mounted || topicHrefs.length === 0) return 0;
      const completedCount = topicHrefs.filter((href) =>
        visited.has(href)
      ).length;
      return completedCount / topicHrefs.length;
    },
    [visited, mounted]
  );

  return { isVisited, getSectionProgress, mounted };
}
