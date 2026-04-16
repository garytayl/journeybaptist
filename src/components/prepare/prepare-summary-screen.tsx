"use client"

import Link from "next/link"
import type { WeeklyGuide } from "@/lib/weekly-guides"
import { PrepareSummaryContent } from "@/components/prepare/prepare-summary-content"
import { usePrepareHhh } from "@/hooks/use-prepare-hhh"
import { usePrepareJournal } from "@/hooks/use-prepare-journal"

export function PrepareSummaryScreen({ guide }: { guide: WeeklyGuide }) {
  const { data: hhh } = usePrepareHhh(guide.slug)
  const { journal } = usePrepareJournal(guide.slug)

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f6f3ee] text-stone-900">
      <header className="shrink-0 border-b border-stone-200/80 bg-[#faf8f5]/95 px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <Link
            href={`/prepare/${guide.slug}`}
            className="text-sm font-medium text-stone-600 transition hover:text-stone-900"
          >
            ← Guided path
          </Link>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500">
            Summary
          </p>
          <Link
            href="/prepare/archive"
            className="text-sm font-medium text-stone-600 transition hover:text-stone-900"
          >
            Archive
          </Link>
        </div>
      </header>
      <div className="mx-auto w-full max-w-lg flex-1 px-5 py-8 pb-16">
        <PrepareSummaryContent guide={guide} hhh={hhh} journal={journal} />
      </div>
    </div>
  )
}
