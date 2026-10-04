"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

type Section = {
  title: string;
  label: string;
  basePath: string;
  items: { name: string; title: string }[];
};

export function ItemGrid({ sections }: { sections: Section[] }) {
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();

  const visible = sections
    .map((s) => ({
      ...s,
      items: s.items.filter((i) => i.title.toLowerCase().includes(q)),
    }))
    .filter((s) => s.items.length > 0);

  return (
    <>
      <label className="inline-flex h-10 w-full min-w-72 items-center gap-2 rounded-full border bg-background px-4 text-sm focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50 sm:w-fit">
        <Search className="-ms-1 size-5 text-muted-foreground" aria-hidden />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Quick search..."
          aria-label="Search components"
          className="grow bg-transparent outline-none placeholder:text-muted-foreground/70"
        />
      </label>

      <div className="my-16 space-y-16">
        {visible.length === 0 && (
          <p className="text-center text-muted-foreground">
            No results for &ldquo;{query}&rdquo;
          </p>
        )}
        {visible.map((section) => (
          <section key={section.title}>
            <h2 className="mb-6 font-bold text-xl tracking-tight">
              {section.title}
            </h2>
            <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {section.items.map((item) => (
                <ItemCard
                  key={item.name}
                  {...item}
                  label={section.label}
                  href={`${section.basePath}/${item.name}`}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}

function ItemCard({
  title,
  label,
  href,
}: {
  title: string;
  label: string;
  href: string;
}) {
  return (
    <div className="space-y-3 text-center">
      {/* ponytail: text cover instead of screenshot thumbs; add /public/thumbs/<name>.png when you have them */}
      <Link
        href={href}
        tabIndex={-1}
        className="peer flex aspect-[268/198] items-center justify-center overflow-hidden rounded-xl border bg-background bg-[radial-gradient(var(--color-border)_1px,transparent_1px)] bg-size-[16px_16px] p-6 transition-colors hover:border-ring"
      >
        <span className="font-bold text-2xl text-foreground/80 tracking-tight">
          {title}
        </span>
      </Link>
      <div className="peer-hover:[&_a]:underline">
        <h3>
          <Link href={href} className="font-medium text-sm hover:underline">
            {title}
          </Link>
        </h3>
        <p className="text-[13px] text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
