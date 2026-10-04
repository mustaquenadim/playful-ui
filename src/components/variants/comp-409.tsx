"use client";

import { Button } from "@/components/ui/button"

export default function Component() {
  return (
    <div className="flex -space-x-3">
      <img
        className="ring-background rounded-full ring-2"
        src="/avatar-80-03.jpg"
        width={40}
        height={40}
        alt="Avatar 01"
      />
      <img
        className="ring-background rounded-full ring-2"
        src="/avatar-80-04.jpg"
        width={40}
        height={40}
        alt="Avatar 02"
      />
      <img
        className="ring-background rounded-full ring-2"
        src="/avatar-80-05.jpg"
        width={40}
        height={40}
        alt="Avatar 03"
      />
      <img
        className="ring-background rounded-full ring-2"
        src="/avatar-80-06.jpg"
        width={40}
        height={40}
        alt="Avatar 04"
      />
      <Button
        variant="secondary"
        className="bg-muted text-muted-foreground ring-background hover:bg-muted shadow-none active:translate-y-0 hover:text-foreground flex size-10 items-center justify-center rounded-full text-xs ring-2"
        size="icon"
      >
        +3
      </Button>
    </div>
  )
}
