"use client"

import { cn } from "@/lib/utils"

interface NeonFrameProps {
  children: React.ReactNode
  className?: string
}

/**
 * NeonFrame wraps page content in the signature hot-pink fluorescent border
 * that gives VISUAL its "cinema streaming" look.
 *
 * Uses `transform: translateZ(0)` to create a new containing block,
 * so any `position: fixed` children (like the header) stay within the frame bounds.
 */
export function NeonFrame({ children, className }: NeonFrameProps) {
  return (
    <div
      className={cn(
        "neon-frame min-h-screen mx-1 sm:mx-2 md:mx-4 lg:mx-5",
        className,
      )}
      style={{ transform: "translateZ(0)" }}
    >
      {children}
    </div>
  )
}
