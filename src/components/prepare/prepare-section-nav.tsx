"use client"

import { cn } from "@/lib/utils"

export type SectionLink = { id: string; label: string }

export function PrepareSectionNav({
  sections,
}: {
  sections: SectionLink[]
}) {
  if (sections.length === 0) return null

  return (
    <nav
      className="sticky top-14 z-40 border-b border-stone-200/70 bg-[#f6f3ee]/95 py-2 backdrop-blur-sm supports-[backdrop-filter]:bg-[#f6f3ee]/90"
      aria-label="On this page"
    >
      <div className="mx-auto flex max-w-2xl items-center gap-1 overflow-x-auto px-5 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={cn(
              "shrink-0 rounded-full border border-transparent px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-stone-600",
              "transition hover:border-stone-200 hover:bg-white/80 hover:text-stone-900",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-900/25"
            )}
          >
            {s.label}
          </a>
        ))}
      </div>
    </nav>
  )
}
