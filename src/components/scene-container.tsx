"use client";

import { cn } from "@/lib/utils";

interface SceneContainerProps {
  children: React.ReactNode;
  className?: string;
  caption?: string;
}

export function SceneContainer({ children, className, caption }: SceneContainerProps) {
  return (
    <div className="my-6 space-y-2">
      <div
        className={cn(
          "relative w-full rounded-xl border border-border/40 overflow-hidden bg-[#0a0a0a]",
          "aspect-[16/9] sm:aspect-[2/1]",
          className
        )}
      >
        {children}
      </div>
      {caption && (
        <p className="text-xs text-center text-muted-foreground/60 italic">
          {caption}
        </p>
      )}
    </div>
  );
}
