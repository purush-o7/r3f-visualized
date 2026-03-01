"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  progress: number;
  className?: string;
}

export function ProgressBar({ progress, className }: ProgressBarProps) {
  if (progress === 0) return null;

  return (
    <div
      className={cn(
        "h-1 w-full bg-muted/50 rounded-full overflow-hidden",
        className
      )}
    >
      <div
        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${Math.round(progress * 100)}%` }}
      />
    </div>
  );
}
