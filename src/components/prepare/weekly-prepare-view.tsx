"use client"

import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { useState } from "react"
import type { WeeklyGuide } from "@/lib/weekly-guides"
import { bibleGatewayReadUrl } from "@/lib/bible-external-link"
import { PromptBlock } from "@/components/prepare/prompt-block"
import {
  PrepareSectionNav,
  type SectionLink,
} from "@/components/prepare/prepare-section-nav"
import { PrepareJournalFields } from "@/components/prepare/prepare-journal-fields"
import { PrepareJournalDock } from "@/components/prepare/prepare-journal-sheet"
import { usePrepareJournal } from "@/hooks/use-prepare-journal"
import { cn } from "@/lib/utils"

export function WeeklyPrepareView({
  guide,
  isCurrentWeek = false,
  flowPath,
}: {
  guide: WeeklyGuide
  isCurrentWeek?: boolean
  /** Link back to the guided step flow (e.g. `/prepare/[slug]`). */
  flowPath?: string
}) {
  const weekLabel = formatWeekLabel(guide.week_start_date)
  const readUrl = bibleGatewayReadUrl(guide.scripture_reference)
  const [journalOpen, setJournalOpen] = useState(false)
  const { journal, setJournal: setJournalSafe } = usePrepareJournal(guide.slug)

  const navSections: SectionLink[] = [
    { id: "prepare-passage", label: "Passage" },
    { id: "prepare-head", label: "Head" },
    { id: "prepare-heart", label: "Heart" },
    { id: "prepare-hands", label: "Hands" },
    ...(guide.prayer?.trim()
      ? [{ id: "prepare-prayer", label: "Prayer" } as const]
      : []),
    { id: "prepare-journal", label: "Journal" },
  ]

  return (
    <>
      <PrepareSectionNav sections={navSections} />

      {flowPath ? (
        <div className="mx-auto max-w-2xl px-5 pt-4">
          <Link
            href={flowPath}
            className="inline-flex text-sm font-medium text-amber-950 underline-offset-4 hover:underline"
          >
            ← Guided path (one step at a time)
          </Link>
        </div>
      ) : null}

      <article
        className={cn(
          "relative mx-auto max-w-2xl px-5 pb-28 pt-8 lg:pb-20",
          flowPath && "pt-6"
        )}
      >
        <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
          {isCurrentWeek ? "This week · Journey Baptist" : "Archive · Journey Baptist"}
        </p>
        <h1 className="mt-3 font-serif text-4xl leading-tight text-stone-900 sm:text-[2.75rem]">
          {guide.title}
        </h1>
        {guide.theme ? (
          <p className="mt-2 text-sm text-stone-600">{guide.theme}</p>
        ) : null}

        <div
          id="prepare-passage"
          className="scroll-mt-32 sm:scroll-mt-36"
        >
          <div className="mt-6 flex flex-wrap items-baseline justify-between gap-3">
            <p className="font-serif text-xl text-amber-950/90">
              {guide.scripture_reference}
            </p>
            <a
              href={readUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white/90 px-3 py-1.5 text-xs font-medium uppercase tracking-wider text-stone-700 shadow-sm transition hover:border-stone-300 hover:text-stone-900"
            >
              Read online
              <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
            </a>
          </div>
          <p className="mt-1 text-sm text-stone-500">{weekLabel}</p>

          {guide.intro ? (
            <p className="mt-8 text-[1.08rem] leading-relaxed text-stone-800">
              {guide.intro}
            </p>
          ) : null}

          {guide.passage_text ? (
            <blockquote
              className={cn(
                "mt-10 border-l-2 border-amber-900/20 pl-5",
                "text-[1.02rem] leading-[1.75] text-stone-800"
              )}
            >
              {guide.passage_text}
            </blockquote>
          ) : null}
        </div>

        <div className="mt-14 space-y-14">
          <PromptBlock
            anchorId="prepare-head"
            kind="head"
            prompts={guide.head_prompts}
          />
          <PromptBlock
            anchorId="prepare-heart"
            kind="heart"
            prompts={guide.heart_prompts}
          />
          <PromptBlock
            anchorId="prepare-hands"
            kind="hands"
            prompts={guide.hands_prompts}
          />
        </div>

        {guide.prayer ? (
          <section
            id="prepare-prayer"
            className="mt-14 scroll-mt-32 sm:scroll-mt-36"
            aria-labelledby="prayer-heading"
          >
            <h2
              id="prayer-heading"
              className="font-serif text-2xl text-stone-900"
            >
              Prayer
            </h2>
            <p className="mt-4 whitespace-pre-wrap text-[1.05rem] leading-relaxed text-stone-800">
              {guide.prayer}
            </p>
          </section>
        ) : null}

        <section
          id="prepare-journal"
          className="mt-14 scroll-mt-32 border-t border-stone-200/80 pt-14 sm:scroll-mt-36"
          aria-labelledby="journal-heading"
        >
          <h2
            id="journal-heading"
            className="font-serif text-2xl text-stone-900"
          >
            Journal
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Prayer and reflections stay on this device—nothing is uploaded.
          </p>
          <p className="mt-2 hidden text-sm text-stone-600 lg:block">
            Write in the space below. Your work is saved automatically in this
            browser.
          </p>
          <p className="mt-2 text-sm text-stone-600 lg:hidden">
            Tap the floating{" "}
            <span className="font-medium text-stone-800">Journal</span> button to
            write on your phone.
          </p>

          <div className="mt-8 hidden lg:block">
            <PrepareJournalFields
              idPrefix="desktop"
              value={journal}
              onChange={setJournalSafe}
              variant="inline"
            />
          </div>
        </section>

        {!isCurrentWeek ? (
          <p className="mt-12 text-center text-sm text-stone-600">
            <Link
              href="/prepare"
              className="font-medium text-amber-950 underline-offset-4 hover:underline"
            >
              Go to this week
            </Link>
            <span className="mx-2 text-stone-300">·</span>
            <Link
              href="/prepare/archive"
              className="text-stone-600 underline-offset-4 hover:underline"
            >
              Archive
            </Link>
          </p>
        ) : null}
      </article>

      <PrepareJournalDock
        journal={journal}
        onJournalChange={setJournalSafe}
        open={journalOpen}
        onOpenChange={setJournalOpen}
      />
    </>
  )
}

function formatWeekLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00")
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}
