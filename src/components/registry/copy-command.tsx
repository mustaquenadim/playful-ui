"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { copyToClipboard } from "@/components/registry/mcp-tabs";

export function CopyCommand({ command }: { command: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <div className="inline-flex max-w-full items-center gap-2 rounded-full border bg-background py-1 ps-4 pe-1 font-mono text-sm">
      <span className="truncate text-muted-foreground">{command}</span>
      <button
        type="button"
        aria-label="Copy install command"
        className="inline-flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        onClick={async () => {
          await copyToClipboard(command);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }}
      >
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
      </button>
    </div>
  );
}
