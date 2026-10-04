import Link from "next/link";
import type { ReactNode } from "react";

import { RegistryLogo } from "@/components/registry/registry-logo";
import { ModeToggle } from "@/components/registry/theme-toggle";
import { Toaster } from "@/components/ui/sonner";

const GITHUB_URL = "https://github.com/mustaquenadim/playful-ui";

// Fading hairline used for the header/footer rules and the side guides
const fadeX =
  "bg-[linear-gradient(to_right,transparent,var(--color-border)_200px,var(--color-border)_calc(100%-200px),transparent)]";
const fadeY =
  "bg-[linear-gradient(to_bottom,transparent,var(--color-border)_200px,var(--color-border)_calc(100%-200px),transparent)]";

export default function HomeLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="w-full overflow-clip bg-muted/40 px-4 sm:px-6">
      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col">
        <div
          aria-hidden="true"
          className={`absolute inset-y-0 -left-12 w-px ${fadeY}`}
        />
        <div
          aria-hidden="true"
          className={`absolute inset-y-0 -right-12 w-px ${fadeY}`}
        />

        <header className="relative mb-14">
          <div
            aria-hidden="true"
            className={`absolute -inset-x-32 bottom-0 h-px ${fadeX}`}
          />
          <div className="flex h-[72px] items-center justify-between gap-3">
            <Link href="/" className="flex items-center gap-2">
              <RegistryLogo />
            </Link>
            <div className="flex items-center gap-4 md:gap-8">
              <Link href="/tokens" className="text-sm hover:underline">
                Design Tokens
              </Link>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm hover:underline"
              >
                GitHub
              </a>
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="grow">{children}</main>

        <footer className="relative mt-16 py-8 md:mt-20">
          <div
            aria-hidden="true"
            className={`absolute -inset-x-32 top-0 h-px ${fadeX}`}
          />
          <p className="text-muted-foreground text-sm max-sm:text-center">
            &copy; {new Date().getFullYear()} Playful UI
          </p>
        </footer>
      </div>
      <Toaster />
    </div>
  );
}
