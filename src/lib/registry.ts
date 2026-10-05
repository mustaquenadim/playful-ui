import registry from "@/registry";

export interface Component {
  name: string;
  type: string;
  title: string;
  description?: string;
  files?: { path: string; type: string; target: string }[];
}

export function getRegistryItems(): Component[] {
  // exclude style item as it's not relevant to show in the ui
  const components = registry.items.filter(
    (item) => item.type !== "registry:style",
  );

  return components as Component[];
}

export function getRegistryItem(name: string): Component {
  const components = getRegistryItems();

  const component = components.find(
    (item: { name: string }) => item.name === name,
  );

  if (component == null) {
    throw new Error(`Component "${name}" not found`);
  }

  return component;
}

export function getBlocks() {
  return getRegistryItems()
    .filter((component) => component.type === "registry:block")
    .sort((a, b) => a.title.localeCompare(b.title));
}

// Host used in install commands and registry URLs (no protocol)
export const BASE_URL =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || "playful.ui.mustaquenadim.com";

// ponytail: hand-picked list of demos that need a full row; add names as new wide demos appear
export const WIDE = new Set([
  "chart",
  "data-table",
  "menubar",
  "navigation-menu",
  "resizable",
  "sidebar",
  "table",
]);

// Primitives whose original demos are hidden on /ui (Origin variants cover them)
export const HIDE_DEMOS = new Set([
  "accordion",
  "pagination",
  "select",
  "switch",
  "tooltip",
]);

export function getUIPrimitives() {
  return getRegistryItems()
    .filter((component) => component.type === "registry:ui")
    .sort((a, b) => a.title.localeCompare(b.title));
}

export function getComponents() {
  return getRegistryItems()
    .filter((component) => component.type === "registry:component")
    .sort((a, b) => a.title.localeCompare(b.title));
}
