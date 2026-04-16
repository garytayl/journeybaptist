"use client"

import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react"
import type { WeeklyGuide } from "@/lib/weekly-guides"
import { bibleGatewayReadUrl } from "@/lib/bible-external-link"
import {
  buildPrepareFlowSteps,
  type FlowStep,
  sectionTitle,
} from "@/lib/prepare-flow-steps"
import { PrepareJournalFields } from "@/components/prepare/prepare-journal-fields"
import { usePrepareHhh } from "@/hooks/use-prepare-hhh"
import { usePrepareJournal } from "@/hooks/use-prepare-journal"
import { cn } from "@/lib/utils"

function formatWeekLabel(iso: string): string {
  const d = new Date(iso + "T12:00:00")
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export function PrepareStepFlow({
  guide,
  isCurrentWeek,
  readPath,
}: {
  guide: WeeklyGuide
  isCurrentWeek: boolean
  /** e.g. /prepare/slug/read — full scroll view */
  readPath: string
}) {
  const reduced = useReducedMotion()
  const steps = useMemo(() => buildPrepareFlowSteps(guide), [guide])
  const [index, setIndex] = useState(0)
  const { journal, setJournal } = usePrepareJournal(guide.slug)
  const { data: hhh, setPromptReply } = usePrepareHhh(guide.slug)
  const readUrl = bibleGatewayReadUrl(guide.scripture_reference)
  const weekLabel = formatWeekLabel(guide.week_start_date)
  const step = steps[index]!
  const total = steps.length
  const progress = total > 0 ? (index + 1) / total : 1

  const go = useCallback(
    (dir: -1 | 1) => {
      setIndex((i) => Math.min(Math.max(0, i + dir), total - 1))
    },
    [total]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (
        el?.closest("textarea") ||
        el?.closest("input") ||
        el?.getAttribute?.("contenteditable") === "true"
      ) {
        return
      }
      if (e.key === "ArrowRight" || e.key === "Enter") {
        if (index < total - 1) go(1)
      }
      if (e.key === "ArrowLeft") {
        if (index > 0) go(-1)
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [go, index, total])

  return (
    <div className="flex min-h-[100dvh] flex-col bg-[#f6f3ee] text-stone-900">
      <header className="shrink-0 border-b border-stone-200/80 bg-[#faf8f5]/95 px-4 pb-3 pt-[max(0.75rem,env(safe-area-inset-top))] backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <Link
            href="/prepare/archive"
            className="text-sm font-medium text-stone-600 transition hover:text-stone-900"
          >
            Close
          </Link>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500">
            {isCurrentWeek ? "This week" : "Archive"}
          </p>
          <span className="w-12 text-right text-xs tabular-nums text-stone-500">
            {index + 1}/{total}
          </span>
        </div>
        <div
          className="mx-auto mt-3 h-1 max-w-lg overflow-hidden rounded-full bg-stone-200/90"
          role="progressbar"
          aria-valuenow={index + 1}
          aria-valuemin={1}
          aria-valuemax={total}
        >
          <div
            className="h-full rounded-full bg-amber-900/70 transition-[width] duration-300 ease-out"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col px-5 pb-[max(5.5rem,env(safe-area-inset-bottom))] pt-6">
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={step.id}
            initial={reduced ? false : { opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduced ? undefined : { opacity: 0, x: -12 }}
            transition={{ duration: reduced ? 0 : 0.22 }}
            className="mx-auto flex w-full max-w-lg flex-1 flex-col"
          >
            <StepBody
              guide={guide}
              step={step}
              weekLabel={weekLabel}
              readUrl={readUrl}
              readPath={readPath}
              journal={journal}
              setJournal={setJournal}
              promptReplies={hhh.prompts}
              setPromptReply={setPromptReply}
            />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 z-20 border-t border-stone-200/90 bg-[#faf8f5]/95 px-4 py-3 backdrop-blur-md supports-[backdrop-filter]:bg-[#faf8f5]/90">
        <div className="mx-auto flex max-w-lg items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => go(-1)}
            disabled={index <= 0}
            className={cn(
              "inline-flex h-11 min-w-[5.5rem] items-center justify-center gap-1 rounded-full border border-stone-200 bg-white px-4 text-sm font-medium text-stone-800 shadow-sm transition",
              index <= 0 && "pointer-events-none opacity-35"
            )}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
          {step.kind === "complete" ? (
            <Link
              href="/prepare/archive"
              className="inline-flex h-11 min-w-[5.5rem] items-center justify-center gap-1 rounded-full bg-stone-900 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800"
            >
              Finish
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => go(1)}
              disabled={index >= total - 1}
              className={cn(
                "inline-flex h-11 min-w-[5.5rem] items-center justify-center gap-1 rounded-full bg-stone-900 px-5 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800",
                index >= total - 1 && "pointer-events-none opacity-35"
              )}
            >
              Next
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          )}
        </div>
      </footer>
    </div>
  )
}

function StepBody({
  guide,
  step,
  weekLabel,
  readUrl,
  readPath,
  journal,
  setJournal,
  promptReplies,
  setPromptReply,
}: {
  guide: WeeklyGuide
  step: FlowStep
  weekLabel: string
  readUrl: string
  readPath: string
  journal: { prayer: string; reflection: string }
  setJournal: (next: { prayer: string; reflection: string }) => void
  promptReplies: Record<string, string>
  setPromptReply: (stepId: string, text: string) => void
}) {
  switch (step.kind) {
    case "welcome":
      return (
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
            Journey Baptist
          </p>
          <h1 className="mt-4 font-serif text-3xl leading-tight text-stone-900 sm:text-4xl">
            {guide.title}
          </h1>
          {guide.theme ? (
            <p className="mt-3 text-sm text-stone-600">{guide.theme}</p>
          ) : null}
          <p className="mt-8 font-serif text-2xl text-amber-950/90">
            {guide.scripture_reference}
          </p>
          <p className="mt-1 text-sm text-stone-500">{weekLabel}</p>
          <p className="mt-10 text-lg leading-relaxed text-stone-800">
            A calm walk through one passage—so you can show up to{" "}
            <span className="font-semibold text-stone-900">Tuesday night Bible study</span>{" "}
            ready to listen, discuss, and pray.
          </p>
          <p className="mt-6 text-sm leading-relaxed text-stone-600">
            You will write your <span className="font-medium text-stone-800">Head</span>,{" "}
            <span className="font-medium text-stone-800">Heart</span>, and{" "}
            <span className="font-medium text-stone-800">Hands</span> as you go—one
            screen at a time. Tap <span className="font-medium text-stone-800">Next</span>{" "}
            when you are ready.
          </p>
        </div>
      )
    case "intro":
      return (
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
            This week
          </p>
          <h2 className="mt-4 font-serif text-2xl text-stone-900">Framing</h2>
          <p className="mt-6 text-[1.08rem] leading-relaxed text-stone-800">{step.text}</p>
        </div>
      )
    case "scripture":
      return (
        <div className="flex min-h-0 flex-1 flex-col">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
            Scripture
          </p>
          <h2 className="mt-4 font-serif text-2xl text-stone-900">
            {guide.scripture_reference}
          </h2>
          <a
            href={readUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-wider text-stone-800 shadow-sm transition hover:border-stone-300"
          >
            Open in Bible Gateway
            <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
          </a>
          {step.passageText ? (
            <div className="mt-8 min-h-0 flex-1 overflow-hidden rounded-2xl border border-stone-200/90 bg-white/70 shadow-inner">
              <div className="max-h-[min(52dvh,28rem)] overflow-y-auto px-4 py-5 text-[1.05rem] leading-[1.75] text-stone-800">
                {step.passageText}
              </div>
            </div>
          ) : (
            <p className="mt-8 text-sm leading-relaxed text-stone-600">
              Read the passage in your own Bible or tap the link above. When you
              have read slowly, continue.
            </p>
          )}
        </div>
      )
    case "prompt": {
      const reply = promptReplies[step.id] ?? ""
      const writeLabel =
        step.section === "head"
          ? "Write your Head (observe the text)"
          : step.section === "heart"
            ? "Write your Heart (believe and receive)"
            : "Write your Hands (respond in faith)"
      return (
        <div className="flex min-h-0 flex-1 flex-col">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-900/80">
            {sectionTitle(step.section)}
            {step.sectionTotal > 1
              ? ` · ${step.sectionIndex} of ${step.sectionTotal}`
              : null}
          </p>
          <h2 className="mt-4 font-serif text-2xl leading-snug text-stone-900">
            {step.text}
          </h2>
          <label
            htmlFor={`hhh-flow-${step.id}`}
            className="mt-8 text-sm font-medium text-stone-800"
          >
            {writeLabel}
          </label>
          <p className="mt-1 text-xs text-stone-500">
            Nothing is uploaded—only stored on this device.
          </p>
          <textarea
            id={`hhh-flow-${step.id}`}
            value={reply}
            onChange={(e) => setPromptReply(step.id, e.target.value)}
            rows={8}
            placeholder="Put it in your own words. Rough notes are fine."
            className="mt-3 min-h-[10rem] w-full flex-1 resize-y rounded-xl border border-stone-200 bg-white/90 px-4 py-3 text-[1.02rem] leading-relaxed text-stone-800 placeholder:text-stone-400 focus:border-amber-900/30 focus:outline-none focus:ring-2 focus:ring-amber-900/15"
          />
        </div>
      )
    }
    case "prayer":
      return (
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
            Prayer
          </p>
          <div className="mt-6 max-h-[min(58dvh,32rem)] overflow-y-auto rounded-2xl border border-stone-200/90 bg-white/75 px-5 py-6 shadow-sm">
            <p className="whitespace-pre-wrap text-[1.05rem] leading-relaxed text-stone-800">
              {step.text}
            </p>
          </div>
        </div>
      )
    case "journal":
      return (
        <div className="flex min-h-0 flex-1 flex-col pb-2">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
            Journal
          </p>
          <h2 className="mt-4 font-serif text-2xl text-stone-900">
            Prayer &amp; personal notes
          </h2>
          <p className="mt-2 text-sm text-stone-600">
            You have already written Head, Heart, and Hands. Add a short prayer
            and anything else you want to carry into Tuesday—saved only on this
            device.
          </p>
          <div className="mt-6 min-h-0 flex-1 overflow-y-auto">
            <PrepareJournalFields
              idPrefix="flow"
              value={journal}
              onChange={setJournal}
              variant="inline"
            />
          </div>
        </div>
      )
    case "complete":
      return (
        <div className="flex flex-1 flex-col justify-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
            All set
          </p>
          <h2 className="mt-4 font-serif text-3xl text-stone-900">
            Ready for Tuesday
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-stone-800">
            Bring your questions, your honesty, and what God has stirred in you
            from {guide.scripture_reference}.
          </p>
          <div className="mt-10 flex flex-col gap-3 text-sm">
            <Link
              href="/prepare"
              className="font-medium text-amber-950 underline-offset-4 hover:underline"
            >
              Go to this week
            </Link>
            <Link
              href="/prepare/archive"
              className="text-stone-600 underline-offset-4 hover:underline"
            >
              Browse archive
            </Link>
            <Link
              href={readPath}
              className="text-stone-600 underline-offset-4 hover:underline"
            >
              View everything on one page
            </Link>
          </div>
        </div>
      )
    default:
      return null
  }
}
