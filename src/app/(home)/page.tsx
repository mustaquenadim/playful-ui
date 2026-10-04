import Link from "next/link";

import { demos } from "@/app/demo/[name]/index";

import { ItemGrid } from "@/components/registry/item-grid";
import { MCPTabs } from "@/components/registry/mcp-tabs";
import { variants } from "@/components/variants";
import {
  WIDE,
  /* getBlocks, getComponents, */ getUIPrimitives,
} from "@/lib/registry";

// Card thumbnail: the primitive's first variant, else its first demo
function preview(name: string) {
  const v = variants[name]?.[0];
  if (v) return <v.C currentPage={1} totalPages={10} />;
  const demo = Object.values(demos[name]?.components ?? {})[0];
  // wide demos size to their container; don't let the centered flex shrink them
  return WIDE.has(name) ? <div className="w-full">{demo}</div> : demo;
}

const pick = ({ name, title }: { name: string; title: string }) => ({
  name,
  title,
  preview: preview(name),
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
            Browse, search and install Playful UI components from your AI editor
            with the shadcn MCP server. Components install with the
            registry&apos;s{" "}
            <Link href="/r/registry.json">
              <code className="inline text-sm tabular-nums underline">
                theme
              </code>
            </Link>{" "}
            tokens and CSS variables.
          </p>

          <MCPTabs
            rootUrl={
              process.env.VERCEL_PROJECT_PRODUCTION_URL ??
              "playful.ui.mustaquenadim.com"
            }
          />
        </div>
      </div>
    </div>
  );
}
