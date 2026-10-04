import Link from "next/link";

import { ItemGrid } from "@/components/registry/item-grid";
import { MCPTabs } from "@/components/registry/mcp-tabs";
import {
  /* getBlocks, getComponents, */ getUIPrimitives,
} from "@/lib/registry";

const pick = ({ name, title }: { name: string; title: string }) => ({
  name,
  title,
});

const sections = [
  // { title: "Blocks", label: "Block", basePath: "/registry", items: getBlocks().map(pick) },
  // { title: "Components", label: "Component", basePath: "/registry", items: getComponents().map(pick) },
  {
    title: "UI Primitives",
    label: "Primitive",
    basePath: "/ui",
    items: getUIPrimitives().map(pick),
  },
];

export default function Home() {
  return (
    <div>
      <div className="max-w-3xl max-sm:text-center">
        <h1 className="mb-4 font-bold text-4xl/[1.1] text-foreground tracking-tight md:text-5xl/[1.1]">
          Playful UI components built with Tailwind CSS and React.
        </h1>
        <p className="mb-8 text-lg text-muted-foreground">
          An open-source collection of copy-and-paste components, blocks, and
          design tokens for quickly building delightful app UIs.
        </p>
      </div>

      <ItemGrid sections={sections} />

      <div className="rounded-xl border bg-background p-6">
        <div className="flex flex-col gap-2">
          <h2 className="font-bold text-xl tracking-tight">MCP</h2>
          <p className="mb-4 text-muted-foreground">
            Integrate this registry with AI IDEs using Model Context Protocol
            (MCP). This uses the registry&apos;s theme tokens and CSS variables
            with the Shadcn CLI. Make sure the{" "}
            <Link href="/r/registry.json">
              <code className="inline text-sm tabular-nums underline">
                style:theme
              </code>
            </Link>{" "}
            contains the same colors as your{" "}
            <code className="inline text-sm tabular-nums">tokens.css</code>.
          </p>

          <MCPTabs rootUrl={process.env.VERCEL_PROJECT_PRODUCTION_URL ?? ""} />
        </div>
      </div>
    </div>
  );
}
