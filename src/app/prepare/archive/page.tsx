import Link from "next/link"
import type { Metadata } from "next"
import { getPublishedGuidesSorted } from "@/lib/weekly-guides"

export const metadata: Metadata = {
  title: "Archive · Weekly preparation",
}

export default function PrepareArchivePage() {
  const guides = getPublishedGuidesSorted()

  return (
    <div className="mx-auto max-w-2xl px-5 pb-20 pt-10">
      <h1 className="font-serif text-3xl text-stone-900">Previous weeks</h1>
      <p className="mt-3 text-stone-600 leading-relaxed">
        Browse past Head, Heart, and Hands guides from Journey Baptist. The
        current week is always available from{" "}
        <Link className="text-amber-950 underline-offset-4 hover:underline" href="/prepare">
          This week
        </Link>
        .
      </p>
      <ul className="mt-10 space-y-3">
        {guides.map((g) => (
          <li key={g.id}>
            <Link
              href={`/prepare/${g.slug}`}
              className="group flex flex-col rounded-xl border border-stone-200/90 bg-white/70 px-4 py-4 shadow-sm transition hover:border-stone-300 hover:bg-white"
            >
              <span className="font-serif text-lg text-stone-900 group-hover:text-stone-950">
                {g.title}
              </span>
              <span className="text-sm text-stone-600">
                {g.scripture_reference} · {formatWeek(g.week_start_date)}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      {guides.length === 0 ? (
        <p className="mt-8 text-stone-600">No guides published yet.</p>
      ) : null}
    </div>
  )
}

function formatWeek(iso: string): string {
  const d = new Date(iso + "T12:00:00")
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}
