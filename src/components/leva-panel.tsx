"use client";

import { Leva } from "leva";

interface LevaPanelProps {
  title?: string;
}

export function LevaPanel({ title = "Controls" }: LevaPanelProps) {
  return (
    <div className="absolute bottom-2 right-2 z-10" style={{ width: 280 }}>
      <Leva
        fill
        flat
        collapsed
        titleBar={{ title }}
        hideCopyButton
      />
    </div>
  );
}
