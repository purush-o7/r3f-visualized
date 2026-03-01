"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { trackEvent } from "@/lib/analytics";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return <Button variant="ghost" size="icon" className="size-8" disabled />;

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-8"
      onClick={() => {
        const next = theme === "dark" ? "light" : "dark";
        setTheme(next);
        trackEvent("toggle_theme", "preferences", next);
      }}
    >
      {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}
