"use client"

import type { WeeklyGuide } from "@/lib/weekly-guides"
import type { PrepareHhhData } from "@/lib/prepare-hhh-storage"
import type { PrepareJournal } from "@/lib/prepare-notes-storage"
import { buildSummarySections } from "@/lib/prepare-summary-sections"
import { cn } from "@/lib/utils"

export function PrepareSummaryContent({
  guide,
  hhh,
  journal,
  className,
}: {
  guide: WeeklyGuide
  hhh: PrepareHhhData
  journal: PrepareJournal
  className?: string
}) {
  const sections = buildSummarySections(guide, hhh)
  const hasJournal = journal.prayer.trim() || journal.reflection.trim()

  return (
    <div className={cn("space-y-10", className)}>
      <header className="space-y-1 border-b border-stone-200/90 pb-6">
        <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-stone-500">
          Compiled
        </p>
        <h2 className="font-serif text-2xl text-stone-900 sm:text-3xl">{guide.title}</h2>
        <p className="font-serif text-lg text-amber-950/90">{guide.scripture_reference}</p>
        {guide.theme ? (
          <p className="text-sm text-stone-600">{guide.theme}</p>
        ) : null}
      </header>

      {sections.map((sec) => {
        const hasFlow = sec.rows.some((r) => r.answer.length > 0)
        const hasScroll = sec.scrollNote.length > 0
        if (!hasFlow && !hasScroll) {
          return (
            <section key={sec.key} aria-labelledby={`sum-${sec.key}`}>
              <h3
                id={`sum-${sec.key}`}
                className="font-serif text-xl text-stone-900"
              >
                {sec.title}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                {sec.subtitle}
              </p>
              <p className="mt-4 rounded-xl border border-dashed border-stone-200 bg-stone-100/40 px-4 py-3 text-sm text-stone-500">
                Nothing written here yet.
              </p>
            </section>
          )
        }

        return (
          <section key={sec.key} aria-labelledby={`sum-${sec.key}`} className="space-y-4">
            <div>
              <h3
                id={`sum-${sec.key}`}
                className="font-serif text-xl text-stone-900"
              >
                {sec.title}
              </h3>
              <p className="mt-1 text-xs uppercase tracking-wider text-stone-500">
                {sec.subtitle}
              </p>
            </div>
            {sec.rows.map((row) =>
              row.answer ? (
                <div
                  key={row.id}
                  className="rounded-xl border border-stone-200/90 bg-white/75 px-4 py-4 shadow-sm"
                >
                  <p className="text-sm font-medium text-stone-700">{row.prompt}</p>
                  <p className="mt-3 whitespace-pre-wrap text-[1.02rem] leading-relaxed text-stone-800">
                    {row.answer}
                  </p>
                </div>
              ) : null
            )}
            {hasScroll ? (
              <div className="rounded-xl border border-amber-900/15 bg-amber-50/50 px-4 py-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-amber-950/70">
                  From full-page notes
                </p>
                <p className="mt-2 whitespace-pre-wrap text-[1.02rem] leading-relaxed text-stone-800">
                  {sec.scrollNote}
                </p>
              </div>
            ) : null}
          </section>
        )
      })}

      {hasJournal ? (
        <section aria-labelledby="sum-journal" className="space-y-4">
          <h3 id="sum-journal" className="font-serif text-xl text-stone-900">
            Prayer &amp; reflection
          </h3>
          {journal.prayer.trim() ? (
            <div className="rounded-xl border border-stone-200/90 bg-white/75 px-4 py-4 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                Personal prayer
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[1.02rem] leading-relaxed text-stone-800">
                {journal.prayer.trim()}
              </p>
            </div>
          ) : null}
          {journal.reflection.trim() ? (
            <div className="rounded-xl border border-stone-200/90 bg-white/75 px-4 py-4 shadow-sm">
              <p className="text-[11px] font-medium uppercase tracking-wider text-stone-500">
                Reflections &amp; questions
              </p>
              <p className="mt-2 whitespace-pre-wrap text-[1.02rem] leading-relaxed text-stone-800">
                {journal.reflection.trim()}
              </p>
            </div>
          ) : null}
        </section>
      ) : (
        <section aria-labelledby="sum-journal-empty">
          <h3
            id="sum-journal-empty"
            className="font-serif text-xl text-stone-900"
          >
            Prayer &amp; reflection
          </h3>
          <p className="mt-4 rounded-xl border border-dashed border-stone-200 bg-stone-100/40 px-4 py-3 text-sm text-stone-500">
            No journal entries yet.
          </p>
        </section>
      )}
    </div>
  )
}
