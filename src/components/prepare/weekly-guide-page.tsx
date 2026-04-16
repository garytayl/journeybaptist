import type { WeeklyGuide } from "@/lib/weekly-guides"
import { PromptBlock } from "@/components/prepare/prompt-block"
import { WeeklyNotes } from "@/components/prepare/weekly-notes"
import { cn } from "@/lib/utils"

export function WeeklyGuidePage({
  guide,
  isCurrentWeek = false,
}: {
  guide: WeeklyGuide
  isCurrentWeek?: boolean
}) {
  const weekLabel = formatWeekLabel(guide.week_start_date)

  return (
    <article className="mx-auto max-w-2xl px-5 pb-20 pt-10">
      <p className="text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
        {isCurrentWeek ? "This week · Journey Baptist" : "Archive · Journey Baptist"}
      </p>
      <h1 className="mt-3 font-serif text-4xl leading-tight text-stone-900 sm:text-[2.75rem]">
        {guide.title}
      </h1>
      {guide.theme ? (
        <p className="mt-2 text-sm text-stone-600">{guide.theme}</p>
      ) : null}
      <p className="mt-6 font-serif text-xl text-amber-950/90">
        {guide.scripture_reference}
      </p>
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

      <div className="mt-14 space-y-14">
        <PromptBlock kind="head" prompts={guide.head_prompts} />
        <PromptBlock kind="heart" prompts={guide.heart_prompts} />
        <PromptBlock kind="hands" prompts={guide.hands_prompts} />
      </div>

      {guide.prayer ? (
        <section className="mt-14 scroll-mt-24" aria-labelledby="prayer-heading">
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

      <div className="mt-14 border-t border-stone-200/80 pt-14">
        <WeeklyNotes key={guide.slug} slug={guide.slug} />
      </div>
    </article>
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
