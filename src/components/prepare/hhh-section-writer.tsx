"use client"

import { cn } from "@/lib/utils"

export function HhhSectionWriter({
  label,
  hint,
  value,
  onChange,
  id,
}: {
  label: string
  hint: string
  value: string
  onChange: (next: string) => void
  id: string
}) {
  return (
    <div
      className={cn(
        "mt-8 rounded-2xl border border-stone-200/90 bg-white/70 p-4 shadow-sm",
        "scroll-mt-28 sm:scroll-mt-32"
      )}
    >
      <label htmlFor={id} className="text-sm font-medium text-stone-800">
        {label}
      </label>
      <p className="mt-1 text-xs text-stone-500">{hint}</p>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={5}
        placeholder="Write freely—rough notes are fine."
        className="mt-3 w-full resize-y rounded-xl border border-stone-200 bg-white/90 px-3 py-3 text-[1.02rem] leading-relaxed text-stone-800 placeholder:text-stone-400 focus:border-amber-900/30 focus:outline-none focus:ring-2 focus:ring-amber-900/15"
      />
    </div>
  )
}
