"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";

interface BeforeAfterProps {
  before: string;
  after: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

export function BeforeAfter({
  before,
  after,
  beforeLabel = "Before",
  afterLabel = "After",
  className,
}: BeforeAfterProps) {
  const [isAfter, setIsAfter] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn("rounded-xl border-2 overflow-hidden", className)}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
        <div className="flex items-center gap-2">
          <div className={cn(
            "size-2 rounded-full transition-colors",
            isAfter ? "bg-emerald-500" : "bg-red-500"
          )} />
          <span className="text-sm font-medium">
            {isAfter ? afterLabel : beforeLabel}
          </span>
        </div>
        <button
          onClick={() => setIsAfter(!isAfter)}
          className={cn(
            "relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer",
            isAfter ? "bg-emerald-500" : "bg-muted-foreground/30"
          )}
        >
          <span
            className={cn(
              "inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform",
              isAfter ? "translate-x-6" : "translate-x-1"
            )}
          />
        </button>
      </div>
      <div className="p-4 space-y-1">
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isAfter ? after : before}
        </p>
      </div>
    </motion.div>
  );
}

interface BeforeAfterCodeProps {
  beforeCode: string;
  afterCode: string;
  beforeLabel?: string;
  afterLabel?: string;
  filename?: string;
  description?: { before: string; after: string };
  className?: string;
}

export function BeforeAfterCode({
  beforeCode,
  afterCode,
  beforeLabel = "Without",
  afterLabel = "With",
  filename,
  description,
  className,
}: BeforeAfterCodeProps) {
  const [isAfter, setIsAfter] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn("rounded-xl border-2 overflow-hidden", className)}
    >
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b">
        <div className="flex items-center gap-3">
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full transition-colors",
            !isAfter ? "bg-red-500/15 text-red-500" : "bg-muted text-muted-foreground"
          )}>
            {beforeLabel}
          </span>
          <button
            onClick={() => setIsAfter(!isAfter)}
            className={cn(
              "relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer",
              isAfter ? "bg-emerald-500" : "bg-muted-foreground/30"
            )}
          >
            <span
              className={cn(
                "inline-block size-4 transform rounded-full bg-white shadow-sm transition-transform",
                isAfter ? "translate-x-6" : "translate-x-1"
              )}
            />
          </button>
          <span className={cn(
            "text-xs font-medium px-2 py-0.5 rounded-full transition-colors",
            isAfter ? "bg-emerald-500/15 text-emerald-500" : "bg-muted text-muted-foreground"
          )}>
            {afterLabel}
          </span>
        </div>
        {filename && (
          <span className="text-xs text-muted-foreground font-mono">{filename}</span>
        )}
      </div>
      <div className="bg-code-bg overflow-x-auto">
        <pre className="p-4 text-[13px] leading-relaxed font-mono text-zinc-300">
          <code>{isAfter ? afterCode : beforeCode}</code>
        </pre>
      </div>
      {description && (
        <div className="px-4 py-3 border-t bg-muted/20">
          <p className="text-xs text-muted-foreground">
            {isAfter ? description.after : description.before}
          </p>
        </div>
      )}
    </motion.div>
  );
}
