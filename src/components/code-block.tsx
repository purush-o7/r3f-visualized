"use client";

import { useState, useEffect } from "react";
import { Check, Copy, FileCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type HighlighterInstance = {
  codeToHtml: (code: string, options: { lang: string; theme: string }) => string;
};

let highlighterPromise: Promise<HighlighterInstance> | null = null;

function getHighlighter() {
  if (!highlighterPromise) {
    highlighterPromise = import("shiki").then((shiki) =>
      shiki.createHighlighter({
        themes: ["vitesse-dark"],
        langs: [
          "javascript",
          "typescript",
          "jsx",
          "tsx",
          "css",
          "html",
          "json",
          "bash",
          "shell",
          "glsl",
        ],
      })
    );
  }
  return highlighterPromise;
}

function detectLang(filename?: string): string {
  if (!filename) return "javascript";
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const map: Record<string, string> = {
    js: "javascript",
    jsx: "jsx",
    ts: "typescript",
    tsx: "tsx",
    css: "css",
    html: "html",
    json: "json",
    sh: "bash",
    bash: "bash",
    glsl: "glsl",
    vert: "glsl",
    frag: "glsl",
  };
  return map[ext] ?? "javascript";
}

function getLangLabel(filename?: string, lang?: string): string {
  if (lang) return lang.toUpperCase();
  const detected = detectLang(filename);
  const labels: Record<string, string> = {
    javascript: "JS",
    typescript: "TS",
    jsx: "JSX",
    tsx: "TSX",
    css: "CSS",
    html: "HTML",
    json: "JSON",
    bash: "BASH",
    shell: "SHELL",
    glsl: "GLSL",
  };
  return labels[detected] ?? detected.toUpperCase();
}

function applyHighlightLines(htmlStr: string, lines: number[]): string {
  if (lines.length === 0) return htmlStr;
  const lineSet = new Set(lines);
  let lineIndex = 0;
  return htmlStr.replace(/<span class="line/g, (match) => {
    lineIndex++;
    if (lineSet.has(lineIndex)) {
      return '<span class="line highlighted';
    }
    return match;
  });
}

export function CodeBlock({
  code,
  filename,
  showLineNumbers = false,
  highlightLines = [],
  lang,
}: {
  code: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  lang?: string;
}) {
  const [copied, setCopied] = useState(false);
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getHighlighter().then((highlighter) => {
      if (cancelled) return;
      const language = lang ?? detectLang(filename);
      let result = highlighter.codeToHtml(code.trim(), {
        lang: language,
        theme: "vitesse-dark",
      });
      result = applyHighlightLines(result, highlightLines);
      setHtml(result);
    });
    return () => {
      cancelled = true;
    };
  }, [code, filename, lang, highlightLines]);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const langLabel = getLangLabel(filename, lang);

  return (
    <div className="group/code relative rounded-xl border border-border/40 overflow-hidden my-4 bg-code-bg shadow-sm">
      {filename && (
        <div className="flex items-center justify-between border-b border-white/[0.06] bg-white/[0.03] px-4 py-2">
          <div className="flex items-center gap-2">
            <FileCode className="size-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-400 font-mono">{filename}</span>
            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-500/10 px-1.5 py-0.5 rounded">
              {langLabel}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-7 text-zinc-500 hover:text-zinc-300 opacity-0 group-hover/code:opacity-100 transition-opacity"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="size-3.5 text-emerald-400" />
            ) : (
              <Copy className="size-3.5" />
            )}
          </Button>
        </div>
      )}
      {!filename && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 size-7 text-zinc-500 hover:text-zinc-300 opacity-0 group-hover/code:opacity-100 transition-opacity z-10"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-400" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      )}
      {html ? (
        <div
          className={cn(
            "overflow-x-auto p-4 text-[13px] leading-relaxed [&_pre]:!bg-transparent [&_pre]:!m-0 [&_pre]:!p-0 [&_code]:!bg-transparent",
            showLineNumbers && "code-line-numbers"
          )}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed font-mono text-zinc-300">
          <code>{code}</code>
        </pre>
      )}
    </div>
  );
}
