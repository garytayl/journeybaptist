"use client"

import {
  startTransition,
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
} from "react"
import { ExternalLink, Loader2, Minus, Plus } from "lucide-react"
import { bibleGatewayReadUrl } from "@/lib/bible-external-link"
import { cn } from "@/lib/utils"

type Verse = { chapter: number; verse: number; text: string }

type PassageResponse = {
  reference: string
  translationName: string
  translationId: string
  verses: Verse[]
  plainText: string
}

const FONT_KEY = "jb_reader_font"
type FontScale = "sm" | "md" | "lg"

const fontSteps: Record<FontScale, string> = {
  sm: "1.02rem",
  md: "1.125rem",
  lg: "1.22rem",
}

function readFontScale(): FontScale {
  if (typeof window === "undefined") return "md"
  const v = window.localStorage.getItem(FONT_KEY)
  if (v === "sm" || v === "md" || v === "lg") return v
  return "md"
}

function cleanVerseText(t: string): string {
  return t.replace(/^\n+/, "").trimEnd()
}

export function ScriptureReader({
  reference,
  fallbackText,
  className,
}: {
  reference: string
  fallbackText?: string | null
  className?: string
}) {
  const [scale, setScale] = useState<FontScale>("md")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<PassageResponse | null>(null)

  useEffect(() => {
    startTransition(() => {
      setScale(readFontScale())
    })
  }, [])

  useEffect(() => {
    let cancelled = false
    const ref = reference.trim()
    if (!ref) {
      startTransition(() => {
        setLoading(false)
        setError("Missing reference.")
        setData(null)
      })
      return
    }

    startTransition(() => {
      setLoading(true)
      setError(null)
      setData(null)
    })

    fetch(`/api/bible/passage?ref=${encodeURIComponent(ref)}`)
      .then(async (res) => {
        const json = (await res.json()) as PassageResponse & { error?: string }
        if (!res.ok) throw new Error(json.error || "Could not load passage.")
        return json
      })
      .then((json) => {
        if (cancelled) return
        setData(json)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Could not load passage.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [reference])

  const setScaleSafe = useCallback((next: FontScale) => {
    setScale(next)
    try {
      window.localStorage.setItem(FONT_KEY, next)
    } catch {
      // ignore
    }
  }, [])

  const bump = useCallback(
    (dir: -1 | 1) => {
      const order: FontScale[] = ["sm", "md", "lg"]
      const i = order.indexOf(scale)
      const n = Math.min(Math.max(0, i + dir), order.length - 1)
      setScaleSafe(order[n]!)
    },
    [scale, setScaleSafe]
  )

  const externalUrl = bibleGatewayReadUrl(reference)
  const sizeVar = fontSteps[scale]

  const showFallback =
    !loading && (error || !data?.verses.length) && fallbackText?.trim()

  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-stone-200/90 bg-gradient-to-b from-white via-[#fdfcfa] to-[#f8f5f0] shadow-[0_1px_0_rgba(255,255,255,0.9)_inset,0_12px_40px_-12px_rgba(28,25,23,0.15)]",
        className
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-200/70 bg-white/50 px-4 py-3 sm:px-5">
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-stone-400">
            Scripture
          </p>
          <p className="truncate font-serif text-lg text-stone-900 sm:text-xl">
            {data?.reference ?? reference}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {data ? (
            <span className="rounded-full border border-stone-200/90 bg-white/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-stone-500">
              {data.translationId === "web" ? "WEB" : data.translationName}
            </span>
          ) : null}
          <div
            className="flex items-center rounded-full border border-stone-200/90 bg-white/90 p-0.5"
            role="group"
            aria-label="Text size"
          >
            <button
              type="button"
              onClick={() => bump(-1)}
              disabled={scale === "sm"}
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 disabled:opacity-30"
              aria-label="Smaller text"
            >
              <Minus className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => bump(1)}
              disabled={scale === "lg"}
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-600 transition hover:bg-stone-100 disabled:opacity-30"
              aria-label="Larger text"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-sm transition hover:border-stone-300 hover:text-stone-900"
          >
            Bible Gateway
            <ExternalLink className="h-3.5 w-3.5 opacity-70" aria-hidden />
          </a>
        </div>
      </div>

      <div
        className="max-h-[min(62dvh,34rem)] overflow-y-auto px-5 py-6 sm:px-8 sm:py-8"
        style={
          {
            "--reader-size": sizeVar,
          } as CSSProperties
        }
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-stone-500">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
            <span className="text-sm">Loading passage…</span>
          </div>
        ) : null}

        {!loading && data?.verses.length ? (
          <article className="space-y-5" aria-label="Bible passage">
            {data.verses.map((v) => (
              <p
                key={`${v.chapter}-${v.verse}`}
                className="font-serif leading-[1.88] text-stone-800 [font-size:var(--reader-size)]"
              >
                <span
                  className="mr-2 inline-block min-w-[1.75rem] align-top font-sans text-[0.65em] font-semibold tabular-nums text-amber-900/55"
                  aria-hidden
                >
                  {v.verse}
                </span>
                <span className="whitespace-pre-line text-stone-800">
                  {cleanVerseText(v.text)}
                </span>
              </p>
            ))}
          </article>
        ) : null}

        {showFallback ? (
          <article
            className="font-serif leading-[1.88] text-stone-800 [font-size:var(--reader-size)]"
            aria-label="Passage text"
          >
            <p className="whitespace-pre-line">{fallbackText!.trim()}</p>
            {error ? (
              <p className="mt-6 border-t border-stone-200/80 pt-4 font-sans text-sm text-stone-500">
                {error} Showing text from this week&apos;s guide instead.
              </p>
            ) : null}
          </article>
        ) : null}

        {!loading && error && !showFallback ? (
          <p className="py-10 text-center font-sans text-sm leading-relaxed text-stone-600">
            {error}{" "}
            <a
              href={externalUrl}
              className="font-medium text-amber-950 underline-offset-2 hover:underline"
            >
              Open in Bible Gateway
            </a>
            .
          </p>
        ) : null}
      </div>

      <p className="border-t border-stone-200/70 bg-white/40 px-4 py-2.5 text-center font-sans text-[10px] leading-snug text-stone-400">
        {data?.translationName === "World English Bible" || !data ? (
          <>
            World English Bible (WEB) when loaded from the API —{" "}
            <span className="text-stone-500">public domain</span>.
          </>
        ) : (
          <>{data.translationName}. </>
        )}{" "}
        Church-provided text may appear when the API cannot match the reference.
      </p>
    </div>
  )
}
