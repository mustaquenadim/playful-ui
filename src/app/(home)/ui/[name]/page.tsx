import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { demos } from "@/app/demo/[name]/index";
import { CopyCommand } from "@/components/registry/copy-command";
import { variants } from "@/components/variants";
import { getRegistryItems, getUIPrimitives } from "@/lib/registry";
import { cn } from "@/lib/utils";

// ponytail: hand-picked list of demos that need a full row; add names as new wide demos appear
const WIDE = new Set([
  "chart",
  "data-table",
  "menubar",
  "navigation-menu",
  "resizable",
  "sidebar",
  "table",
]);

// Cell width (1 = third, 2 = half, 3 = full row) and alignment, as in Origin UI
const SPAN: Record<number, string> = {
  1: "col-span-12 sm:col-span-6 lg:col-span-4",
  2: "col-span-12 sm:col-span-6",
  3: "col-span-12",
};
const STYLE: Record<number, string> = {
  1: "flex items-center justify-center",
  2: "text-center",
};

type Cell = {
  key: string;
  label?: string;
  node: ReactNode;
  span: number;
  style: number;
};

type Props = { params: Promise<{ name: string }> };

const getPrimitive = (name: string) =>
  getRegistryItems().find((i) => i.name === name && i.type === "registry:ui");

// Primitives whose original demos are hidden on /ui (Origin variants cover them)
const HIDE_DEMOS = new Set(["accordion", "select", "tooltip"]);

function getCells(name: string): Cell[] {
  const own = HIDE_DEMOS.has(name)
    ? []
    : Object.entries(demos[name]?.components ?? {});
  const wide = own.length === 1 || WIDE.has(name);

  return [
    ...own.map(([label, node]) => ({
      key: label,
      label,
      node,
      span: wide ? 3 : 1,
      style: WIDE.has(name) ? 0 : 1,
    })),
    ...(variants[name] ?? []).map(({ C, span, style }, i) => ({
      key: `origin-${i}`,
      node: <C currentPage={1} totalPages={10} />,
      span,
      style,
    })),
  ];
}

export function generateStaticParams() {
  return getUIPrimitives()
    .filter(({ name }) => demos[name] || variants[name])
    .map(({ name }) => ({ name }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const item = getPrimitive((await params).name);
  return item ? { title: `${item.title} - Playful UI` } : {};
}

export default async function UIPrimitivePage({ params }: Props) {
  const { name } = await params;
  const item = getPrimitive(name);
  const cells = getCells(name);

  if (!item || cells.length === 0) {
    notFound();
  }

  const baseUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? "";

  return (
    <>
      <div className="mb-16 text-center">
        <h1 className="mb-3 font-bold text-4xl/[1.1] text-foreground tracking-tight md:text-5xl/[1.1]">
          {item.title}
        </h1>
        <p className="mx-auto mb-6 max-w-3xl text-lg text-muted-foreground">
          {cells.length > 1
            ? `A growing collection of ${cells.length} ${item.title.toLowerCase()} components built with React and Tailwind CSS.`
            : (item.description ??
              `A ${item.title.toLowerCase()} component built with React and Tailwind CSS.`)}
        </p>
        <CopyCommand
          command={`npx shadcn@latest add https://${baseUrl}/r/${name}.json`}
        />
      </div>

      <div className="overflow-hidden">
        <div className="-m-px grid grid-cols-12 *:not-first:-ms-px *:not-first:-mt-px">
          {cells.map(({ key, label, node, span, style }) => (
            <div
              key={key}
              // layout containment keeps fixed-position demos (sidebar) inside the cell
              className={cn(
                "relative min-w-0 border px-1 py-12 [contain:layout] sm:px-8 xl:px-12",
                SPAN[span] ?? SPAN[1],
                STYLE[style],
              )}
            >
              {label && (
                <span className="absolute top-4 left-4 text-muted-foreground text-xs">
                  {label}
                </span>
              )}
              {node}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
