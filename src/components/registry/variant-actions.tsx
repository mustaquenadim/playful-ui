"use client";

import { Check, CodeIcon, Copy, Link2 } from "lucide-react";
import { type ReactNode, useState } from "react";

import { copyToClipboard } from "@/components/registry/mcp-tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Hidden until the cell (group/item) is hovered or focused on large screens, as in Origin UI
const iconButton =
  "inline-flex size-9 items-center justify-center rounded-md text-muted-foreground/80 outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50 lg:opacity-0 lg:group-focus-within/item:opacity-100 lg:group-hover/item:opacity-100";

function useCopied() {
  const [copied, setCopied] = useState(false);
  return {
    copied,
    copy: async (text: string) => {
      await copyToClipboard(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    },
  };
}

function WithTooltip({ label, children }: { label: string; children: ReactNode }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent className="px-2 py-1 text-xs">{label}</TooltipContent>
    </Tooltip>
  );
}

function CopyIconButton({ text, label }: { text: string; label: string }) {
  const { copied, copy } = useCopied();
  return (
    <WithTooltip label={copied ? "Copied!" : label}>
      <button
        type="button"
        aria-label={label}
        className={iconButton}
        onClick={() => copy(text)}
      >
        {copied ? <Check className="size-4 text-primary" /> : <Link2 className="size-4" />}
      </button>
    </WithTooltip>
  );
}

const MANAGERS = {
  pnpm: "pnpm dlx shadcn@latest add",
  npm: "npx shadcn@latest add",
  yarn: "npx shadcn@latest add",
  bun: "bunx --bun shadcn@latest add",
};

function DarkCopy({ text }: { text: string }) {
  const { copied, copy } = useCopied();
  return (
    <button
      type="button"
      aria-label="Copy"
      onClick={() => copy(text)}
      className="absolute top-2 right-2 inline-flex size-8 items-center justify-center rounded-md text-zinc-400 hover:text-zinc-100"
    >
      {copied ? <Check className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
    </button>
  );
}

function CodeDialog({ name, registryUrl }: { name: string; registryUrl: string }) {
  const [pm, setPm] = useState<keyof typeof MANAGERS>("pnpm");
  const [code, setCode] = useState<string | null>(null);
  const [html, setHtml] = useState<string | null>(null);
  const command = `${MANAGERS[pm]} ${registryUrl}`;

  // Load source and highlight only when the dialog opens; shiki is lazy-loaded
  async function load() {
    if (code !== null) return;
    try {
      const res = await fetch(`/r/${name}.json`);
      const data = await res.json();
      const source: string = data.files?.[0]?.content ?? "";
      setCode(source);
      const { codeToHtml } = await import("shiki/bundle/web");
      setHtml(await codeToHtml(source, { lang: "tsx", theme: "github-dark" }));
    } catch {
      setCode("");
    }
  }

  return (
    <Dialog onOpenChange={(open) => open && load()}>
      <WithTooltip label="View code">
        <DialogTrigger asChild>
          <button type="button" aria-label="View code" className={iconButton}>
            <CodeIcon className="size-4" />
          </button>
        </DialogTrigger>
      </WithTooltip>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-left">Installation</DialogTitle>
          <DialogDescription className="sr-only">
            Use the CLI to add this component to your project
          </DialogDescription>
        </DialogHeader>
        <div className="min-w-0 space-y-5">
          <div className="relative rounded-md bg-zinc-950 dark:bg-zinc-900">
            <div className="flex gap-4 border-zinc-800 border-b px-4">
              {(Object.keys(MANAGERS) as (keyof typeof MANAGERS)[]).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPm(key)}
                  className={cn(
                    "relative py-3 text-sm text-zinc-400 after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 hover:text-zinc-100",
                    pm === key && "text-zinc-100 after:bg-primary",
                  )}
                >
                  {key}
                </button>
              ))}
            </div>
            <pre className="overflow-auto p-4 font-mono text-[12.8px] text-zinc-100">
              {command}
            </pre>
            <DarkCopy text={command} />
          </div>

          <div className="space-y-4">
            <p className="font-semibold text-lg tracking-tight">Code</p>
            <div className="relative">
              {code === "" ? (
                <p className="text-muted-foreground text-sm">No code available.</p>
              ) : html ? (
                <div
                  className="[&_code]:font-mono [&_code]:text-[13px] [&_pre]:max-h-[450px] [&_pre]:overflow-auto [&_pre]:rounded-md [&_pre]:bg-zinc-950! [&_pre]:p-4 [&_pre]:leading-snug dark:[&_pre]:bg-zinc-900!"
                  // shiki output: our own registry source, HTML-escaped by shiki
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted highlighter output
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              ) : (
                <pre className="rounded-md bg-zinc-950 p-4 text-sm text-zinc-400 dark:bg-zinc-900">
                  Loading...
                </pre>
              )}
              {code ? <DarkCopy text={code} /> : null}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export function VariantActions({ name, baseUrl }: { name: string; baseUrl: string }) {
  const registryUrl = `https://${baseUrl}/r/${name}.json`;

  return (
    <TooltipProvider delayDuration={0}>
      <div className="absolute top-2 right-2 flex gap-1">
        <CopyIconButton text={registryUrl} label="Copy Registry URL" />
        <WithTooltip label="Open in v0">
          <a
            href={`https://v0.dev/chat/api/open?url=${encodeURIComponent(registryUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Open in v0"
            className={iconButton}
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
              <path
                fill="currentColor"
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.50321 5.5H13.2532C13.3123 5.5 13.3704 5.5041 13.4273 5.51203L9.51242 9.42692C9.50424 9.36912 9.5 9.31006 9.5 9.25L9.5 5.5L8 5.5L8 9.25C8 10.7688 9.23122 12 10.75 12H14.5V10.5L10.75 10.5C10.6899 10.5 10.6309 10.4958 10.5731 10.4876L14.4904 6.57028C14.4988 6.62897 14.5032 6.68897 14.5032 6.75V10.5H16.0032V6.75C16.0032 5.23122 14.772 4 13.2532 4H9.50321V5.5ZM0 5V5.00405L5.12525 11.5307C5.74119 12.3151 7.00106 11.8795 7.00106 10.8822V5H5.50106V9.58056L1.90404 5H0Z"
              />
            </svg>
          </a>
        </WithTooltip>
        <CodeDialog name={name} registryUrl={registryUrl} />
      </div>
    </TooltipProvider>
  );
}
