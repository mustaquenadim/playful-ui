"use client";

import { Check, ClipboardIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { AddToCursor } from "@/components/registry/add-to-cursor";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value);
}

const mcp = { command: "npx", args: ["shadcn@latest", "mcp"] };

const json = (v: unknown) => JSON.stringify(v, null, 2);

const clients = [
  {
    value: "claude",
    label: "Claude Code",
    file: ".mcp.json",
    config: json({ mcpServers: { shadcn: mcp } }),
  },
  {
    value: "cursor",
    label: "Cursor",
    file: ".cursor/mcp.json",
    config: json({ mcpServers: { shadcn: mcp } }),
  },
  {
    value: "vscode",
    label: "VS Code",
    file: ".vscode/mcp.json",
    config: json({ servers: { shadcn: mcp } }),
  },
  {
    value: "windsurf",
    label: "Windsurf",
    file: "~/.codeium/windsurf/mcp_config.json",
    config: json({ mcpServers: { shadcn: mcp } }),
  },
];

function CodeBlock({
  code,
  children,
}: {
  code: string;
  children?: React.ReactNode;
}) {
  const [hasCopied, setHasCopied] = useState(false);

  useEffect(() => {
    if (!hasCopied) return;
    const t = setTimeout(() => setHasCopied(false), 2000);
    return () => clearTimeout(t);
  }, [hasCopied]);

  return (
    <div className="relative">
      <div className="absolute top-3 right-3 flex gap-2">
        {children}
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            copyToClipboard(code);
            setHasCopied(true);
          }}
          className="shadow-none"
        >
          {hasCopied ? <Check /> : <ClipboardIcon />}
          Copy
        </Button>
      </div>

      <pre className="mt-16 overflow-x-auto rounded-lg border bg-muted p-1 sm:mt-0">
        <code className="relative rounded bg-transparent p-1 font-mono text-muted-foreground text-sm">
          {code}
        </code>
      </pre>
    </div>
  );
}

export function MCPTabs({ rootUrl }: { rootUrl: string }) {
  const [tab, setTab] = useState("claude");

  const registries = json({
    registries: { "@playful": `https://${rootUrl}/r/{name}.json` },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <p className="text-muted-foreground text-sm">
          1. Add the registry to your{" "}
          <code className="inline text-sm tabular-nums">components.json</code>
        </p>
        <CodeBlock code={registries} />
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <p className="mb-2 text-muted-foreground text-sm">
          2. Add the shadcn MCP server to your editor
        </p>
        <TabsList>
          {clients.map((c) => (
            <TabsTrigger key={c.value} value={c.value}>
              {c.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {clients.map((c) => (
          <TabsContent key={c.value} value={c.value} className="space-y-2">
            <p className="text-muted-foreground text-sm">
              {c.value === "cursor" && "Click Add to Cursor or "}
              {c.value === "cursor" ? "copy" : "Copy"} and paste the code into{" "}
              <code className="inline text-sm tabular-nums">{c.file}</code>
            </p>
            <CodeBlock code={c.config}>
              {c.value === "cursor" && <AddToCursor mcp={mcp} />}
            </CodeBlock>
          </TabsContent>
        ))}
      </Tabs>

      <p className="text-muted-foreground text-sm">
        3. Ask your assistant, e.g. &ldquo;Add the accordion from the @playful
        registry&rdquo;.
      </p>
    </div>
  );
}
