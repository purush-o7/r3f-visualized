"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Rocket, ChevronRight, Lightbulb, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui/button";

interface TryThisChallengeProps {
  challenge: string;
  hint?: string;
  solution: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  className?: string;
}

const DIFFICULTY_STYLES = {
  beginner: { label: "Beginner", color: "emerald" },
  intermediate: { label: "Intermediate", color: "amber" },
  advanced: { label: "Advanced", color: "red" },
} as const;

export function TryThisChallenge({
  challenge,
  hint,
  solution,
  difficulty = "beginner",
  className,
}: TryThisChallengeProps) {
  const [showHint, setShowHint] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const diff = DIFFICULTY_STYLES[difficulty];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className={cn(
        "rounded-xl border-2 border-dashed overflow-hidden",
        `border-${diff.color}-500/30 bg-${diff.color}-500/[0.03]`,
        className
      )}
    >
      <div className="p-5">
        <div className="flex items-center gap-2.5 mb-3">
          <div className={cn(
            "size-8 rounded-lg flex items-center justify-center",
            `bg-${diff.color}-500/10`
          )}>
            <Rocket className={cn("size-4", `text-${diff.color}-500`)} />
          </div>
          <div>
            <p className={cn("text-xs font-semibold", `text-${diff.color}-500`)}>
              Try This!
            </p>
            <p className={cn("text-[10px]", `text-${diff.color}-500/60`)}>
              {diff.label}
            </p>
          </div>
        </div>

        <p className="text-sm font-medium leading-relaxed mb-4">{challenge}</p>

        <div className="flex items-center gap-2">
          {hint && !showHint && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowHint(true);
                trackEvent("try_this_hint", "engagement", challenge.slice(0, 60));
              }}
              className={cn(
                `border-${diff.color}-500/30 hover:bg-${diff.color}-500/10`,
                `text-${diff.color}-500`
              )}
            >
              <Lightbulb className="size-3.5 mr-1.5" />
              Show Hint
            </Button>
          )}
          {!showSolution && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setShowSolution(true);
                trackEvent("try_this_solution", "engagement", challenge.slice(0, 60));
              }}
              className={cn(
                `border-${diff.color}-500/30 hover:bg-${diff.color}-500/10`,
                `text-${diff.color}-500`
              )}
            >
              <Check className="size-3.5 mr-1.5" />
              Show Solution
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showHint && hint && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className={cn(
              "px-5 pb-3 flex items-start gap-2",
            )}>
              <Lightbulb className={cn("size-3.5 mt-0.5 shrink-0", `text-${diff.color}-500/60`)} />
              <p className="text-xs text-muted-foreground italic">{hint}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSolution && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            transition={{
              height: { type: "spring", stiffness: 300, damping: 25 },
              opacity: { duration: 0.2 },
            }}
          >
            <div className={cn(
              "mx-4 mb-4 rounded-lg border p-4",
              `border-${diff.color}-500/20 bg-${diff.color}-500/[0.06]`
            )}>
              <div className="flex items-center gap-1.5 mb-2">
                <ChevronRight className={cn("size-3", `text-${diff.color}-500`)} />
                <span className={cn("text-xs font-semibold", `text-${diff.color}-500`)}>Solution</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed">{solution}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

interface TryThisListProps {
  challenges: TryThisChallengeProps[];
  className?: string;
}

export function TryThisList({ challenges, className }: TryThisListProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <Rocket className="size-5 text-emerald-500" />
        Try These Challenges
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Put what you learned into practice. Try each challenge in the demo above using the Leva controls, then check the solution.
      </p>
      {challenges.map((challenge, i) => (
        <TryThisChallenge key={i} {...challenge} />
      ))}
    </div>
  );
}
