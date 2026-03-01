"use client";

import { useState, useRef, useCallback } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SceneContainerProps {
  children: React.ReactNode;
  className?: string;
  caption?: string;
  hideLabel?: boolean;
}

export function SceneContainer({
  children,
  className,
  caption,
  hideLabel = false,
}: SceneContainerProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    } else {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    }
  }, []);

  return (
    <div className="my-6 space-y-2">
      <div className="rounded-xl bg-gradient-to-b from-white/[0.08] to-transparent p-px">
        <div
          ref={containerRef}
          className={cn(
            "relative w-full rounded-[11px] overflow-hidden bg-scene-bg",
            "aspect-[16/9] sm:aspect-[2/1]",
            className
          )}
        >
          {children}

          {/* Corner markers */}
          <div className="absolute top-2.5 left-2.5 w-3 h-3 border-t-2 border-l-2 border-white/20 rounded-tl-sm pointer-events-none" />
          <div className="absolute top-2.5 right-2.5 w-3 h-3 border-t-2 border-r-2 border-white/20 rounded-tr-sm pointer-events-none" />
          <div className="absolute bottom-2.5 left-2.5 w-3 h-3 border-b-2 border-l-2 border-white/20 rounded-bl-sm pointer-events-none" />
          <div className="absolute bottom-2.5 right-2.5 w-3 h-3 border-b-2 border-r-2 border-white/20 rounded-br-sm pointer-events-none" />

          {/* Interactive badge */}
          {!hideLabel && (
            <div className="absolute top-3 left-3 z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10 px-2.5 py-1 text-[10px] font-medium text-white/70">
                <span className="size-1.5 rounded-full bg-green-400 animate-pulse" />
                Interactive
              </span>
            </div>
          )}

          {/* Fullscreen toggle */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-3 right-3 z-10 size-7 rounded-md bg-white/10 backdrop-blur-sm border border-white/10 flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer"
          >
            {isFullscreen ? (
              <Minimize2 className="size-3.5 text-white/70" />
            ) : (
              <Maximize2 className="size-3.5 text-white/70" />
            )}
          </button>
        </div>
      </div>
      {caption && (
        <p className="text-xs text-center text-muted-foreground/60 italic">
          {caption}
        </p>
      )}
    </div>
  );
}
