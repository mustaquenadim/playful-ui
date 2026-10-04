// Port Origin UI variants into registry-starter/src/components/variants.
// Usage: node scripts/port-origin-variants.mjs <path-to-originui-checkout>
// Skips variants listed in scripts/origin-exclude.txt (they fail to typecheck here).
import fs from "node:fs";
import path from "node:path";

const ORIGIN = process.argv[2] ?? "../originui";
const DEST = process.cwd();
const OUT = path.join(DEST, "src/components/variants");

// Origin category slug -> our primitive name
const MAP = {
  accordion: "accordion", alert: "alert", avatar: "avatar", badge: "badge",
  breadcrumb: "breadcrumb", button: "button", checkbox: "checkbox",
  dialog: "dialog", dropdown: "dropdown-menu", input: "input",
  pagination: "pagination", popover: "popover", radio: "radio-group",
  select: "select", slider: "slider", switch: "switch", table: "table",
  tabs: "tabs", textarea: "textarea", tooltip: "tooltip",
};
const PKGS = new Set([
  "react", "lucide-react", "radix-ui", "date-fns", "react-day-picker",
  "sonner", "input-otp", "cmdk", "@tanstack/react-table",
  "class-variance-authority",
]);
// One-off design fixes for variants that clash with the Playful theme: [find, replace]
const PATCHES = {
  // "+3" chip: secondary is bright blue with a 3D shadow here, Origin meant neutral grey
  "comp-409": [
    [
      "bg-secondary text-muted-foreground ring-background hover:bg-secondary",
      "bg-muted text-muted-foreground ring-background hover:bg-muted shadow-none active:translate-y-0",
    ],
  ],
  // nested filled panels poke out of the rounded last item
  "comp-352": [["relative border outline-none", "relative overflow-hidden border outline-none"]],
  // square switch: fixed radii, since our --radius is 1rem and rounded-sm (12px) makes a pill
  "comp-176": [
    [
      'className="rounded-sm [&_span]:rounded"',
      'className="rounded-[6px] [&_span]:rounded-[4px]"',
    ],
  ],
  // our tooltip always has an arrow and hover-card has none, so drop the showArrow prop
  "comp-356": [[" showArrow={true}", ""]],
  "comp-365": [[" showArrow", ""]],
};

const ourUi = new Set(
  fs.readdirSync(path.join(DEST, "src/components/ui")).map((f) => f.replace(/\.tsx?$/, "")),
);
const ourHooks = new Set(
  fs.readdirSync(path.join(DEST, "src/hooks")).map((f) => f.replace(/\.tsx?$/, "")),
);
const exclude = new Set(
  fs.existsSync("scripts/origin-exclude.txt")
    ? fs.readFileSync("scripts/origin-exclude.txt", "utf8").split(/\s+/).filter(Boolean)
    : [],
);

const cfg = fs.readFileSync(path.join(ORIGIN, "config/components.ts"), "utf8");
const re = /slug: "([^"]+)"[\s\S]*?components: \[([\s\S]*?)\]/g;
const HOMEPAGE = JSON.parse(fs.readFileSync(path.join(DEST, "registry.json"), "utf8")).homepage;
const items = [];
const result = {};
const seen = new Set();
let m;
while ((m = re.exec(cfg))) {
  const prim = MAP[m[1]];
  if (!prim) continue;
  for (const [, name] of m[2].matchAll(/name: "([^"]+)"/g)) {
    if (exclude.has(name) || seen.has(name)) continue;
    const src = path.join(ORIGIN, "registry/default/components", `${name}.tsx`);
    if (!fs.existsSync(src)) continue;
    let code = fs.readFileSync(src, "utf8");
    const ok = [...code.matchAll(/from "([^"]+)"/g)].every(([, s]) => {
      if (s === "@/registry/default/lib/utils") return true;
      const ui = s.match(/^@\/registry\/default\/ui\/(.+)$/);
      if (ui) return ourUi.has(ui[1]);
      const hook = s.match(/^@\/registry\/default\/hooks\/(.+)$/);
      if (hook) return ourHooks.has(hook[1]);
      return PKGS.has(s);
    });
    if (!ok) continue;
    code = code
      .replaceAll("@/registry/default/ui/", "@/components/ui/")
      .replaceAll("@/registry/default/hooks/", "@/hooks/")
      .replaceAll("@/registry/default/lib/utils", "@/lib/utils")
      .replace(/(["'])(?:\.\/)?([\w-]+\.(?:jpg|png))/g, "$1/$2")
      // Origin's accent is a subtle grey; ours is bright yellow, so use the neutral tokens
      .replace(/\b(text|border)-accent-foreground\b/g, "$1-foreground")
      .replace(/\b(bg|border|ring)-accent\b(?!-)/g, "$1-muted")
      // our ghost button adds dark:hover:bg-input/50, which plain hover:bg-transparent doesn't override
      .replace(/(?<![\w:-])hover:bg-transparent\b/g, "hover:bg-transparent dark:hover:bg-transparent");
    for (const [from, to] of PATCHES[name] ?? []) code = code.replace(from, to);
    if (!/^["']use client["']/.test(code)) code = `"use client";\n\n${code}`;
    fs.mkdirSync(OUT, { recursive: true });
    fs.writeFileSync(path.join(OUT, `${name}.tsx`), code);
    seen.add(name);
    (result[prim] ??= []).push(name);

    // registry item so each variant gets its own /r/<name>.json (registry URL, CLI, v0, code)
    const imports = [...code.matchAll(/from "([^"]+)"/g)].map(([, s]) => s);
    const hooks = imports.flatMap((s) => s.match(/^@\/hooks\/(.+)$/)?.[1] ?? []);
    const deps = imports.filter((s) => PKGS.has(s) && s !== "react");
    items.push({
      name,
      type: "registry:component",
      title: `${prim} ${name}`,
      ...(deps.length && { dependencies: [...new Set(deps)] }),
      registryDependencies: [
        ...new Set(
          imports.flatMap((s) => s.match(/^@\/components\/ui\/(.+)$/)?.[1] ?? []),
        ),
      ].map((ui) => `${HOMEPAGE}/r/${ui}.json`),
      files: [
        { path: `src/components/variants/${name}.tsx`, type: "registry:component" },
        ...hooks.map((h) => ({
          path: `src/hooks/${fs.readdirSync(path.join(DEST, "src/hooks")).find((f) => f.startsWith(`${h}.`))}`,
          type: "registry:hook",
        })),
      ],
    });
  }
}

// drop excluded files left over from a previous run
for (const f of fs.readdirSync(OUT)) {
  const n = f.replace(/\.tsx$/, "");
  if (f !== "index.ts" && !seen.has(n)) fs.rmSync(path.join(OUT, f));
}

const id = (n) => n.replace(/-(\w)/g, (_, c) => c.toUpperCase()).replace(/^\w/, (c) => c.toUpperCase());
const meta = Object.fromEntries(
  JSON.parse(fs.readFileSync(path.join(ORIGIN, "registry.json"), "utf8")).items.map(
    (i) => [i.name, i.meta ?? {}],
  ),
);
const entry = (n) => {
  const { colSpan = 1, style = 0 } = meta[n] ?? {};
  return `{ name: "${n}", C: ${id(n)}, span: ${colSpan}, style: ${style} }`;
};
const names = Object.values(result).flat();
const index = [
  "// Variants ported from Origin UI (MIT) - https://github.com/origin-space/originui",
  "// Generated; regenerate instead of editing by hand.",
  'import type { ComponentType } from "react";',
  "",
  ...names.map((n) => `import ${id(n)} from "./${n}";`),
  "",
  "export type Variant = {",
  "  name: string; // registry item name, served at /r/<name>.json",
  "  // Pagination variants need currentPage/totalPages; others ignore them",
  "  C: ComponentType<{ currentPage: number; totalPages: number }>;",
  "  span: number; // 1 = third, 2 = half, 3 = full row",
  "  style: number; // 1 = centered, 2 = text-center",
  "};",
  "",
  "export const variants: Record<string, Variant[]> = {",
  ...Object.entries(result).map(
    ([p, ns]) => `  "${p}": [\n${ns.map((n) => `    ${entry(n)},`).join("\n")}\n  ],`,
  ),
  "};",
  "",
].join("\n");
fs.writeFileSync(path.join(OUT, "index.ts"), index);

// Separate registry so the main registry.json (and the sidebar built from it) stays clean;
// built into public/r by the registry:build script
fs.writeFileSync(
  path.join(DEST, "registry-variants.json"),
  `${JSON.stringify(
    {
      $schema: "https://ui.shadcn.com/schema/registry.json",
      name: "Playful UI variants",
      homepage: HOMEPAGE,
      items,
    },
    null,
    2,
  )}\n`,
);
console.log(Object.entries(result).map(([p, ns]) => `${p}:${ns.length}`).join(" "), "total", names.length);
