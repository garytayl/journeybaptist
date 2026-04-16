"use client"

import type { PrepareJournal } from "@/lib/prepare-notes-storage"

export function PrepareJournalFields({
  value,
  onChange,
  variant = "inline",
  idPrefix = "journal",
}: {
  value: PrepareJournal
  onChange: (next: PrepareJournal) => void
  variant?: "inline" | "sheet"
  /** Keeps labels unique when two instances exist (desktop + sheet). */
  idPrefix?: string
}) {
  const pad = variant === "sheet" ? "space-y-5" : "space-y-6"

  return (
    <div className={pad}>
      <div>
        <label
          htmlFor={`${idPrefix}-prayer`}
          className="block text-sm font-medium text-stone-700"
        >
          Personal prayer
        </label>
        <p className="mt-0.5 text-xs text-stone-500">
          In your own words—or leave blank.
        </p>
        <textarea
          id={`${idPrefix}-prayer`}
          value={value.prayer}
          onChange={(e) =>
            onChange({ ...value, prayer: e.target.value })
          }
          rows={variant === "sheet" ? 4 : 5}
          placeholder="Lord, …"
          className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-white/90 px-4 py-3 text-[0.95rem] leading-relaxed text-stone-800 shadow-sm placeholder:text-stone-400 focus:border-amber-900/30 focus:outline-none focus:ring-2 focus:ring-amber-900/15"
        />
      </div>
      <div>
        <label
          htmlFor={`${idPrefix}-reflection`}
          className="block text-sm font-medium text-stone-700"
        >
          Reflections &amp; questions
        </label>
        <p className="mt-0.5 text-xs text-stone-500">
          Notes for Tuesday discussion, insights, or tensions you notice.
        </p>
        <textarea
          id={`${idPrefix}-reflection`}
          value={value.reflection}
          onChange={(e) =>
            onChange({ ...value, reflection: e.target.value })
          }
          rows={variant === "sheet" ? 5 : 6}
          placeholder="What is the Spirit surfacing as you dwell on this passage?"
          className="mt-2 w-full resize-y rounded-xl border border-stone-200 bg-white/90 px-4 py-3 text-[0.95rem] leading-relaxed text-stone-800 shadow-sm placeholder:text-stone-400 focus:border-amber-900/30 focus:outline-none focus:ring-2 focus:ring-amber-900/15"
        />
      </div>
    </div>
  )
}
