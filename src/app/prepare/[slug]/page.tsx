import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Link from "next/link"
import {
  getCurrentPublishedGuide,
  getGuideBySlug,
  getPublishedGuidesSorted,
} from "@/lib/weekly-guides"
import { WeeklyGuidePage } from "@/components/prepare/weekly-guide-page"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getPublishedGuidesSorted().map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide || guide.status !== "published") {
    return { title: "Guide" }
  }
  return {
    title: `${guide.title} · Journey Baptist`,
    description: guide.intro ?? `${guide.scripture_reference} — Head, Heart, and Hands.`,
  }
}

export default async function PrepareGuidePage({ params }: Props) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide || guide.status !== "published") notFound()

  const current = getCurrentPublishedGuide()
  const isCurrentWeek = current?.slug === guide.slug

  return (
    <>
      {!isCurrentWeek ? (
        <div className="mx-auto max-w-2xl px-5 pt-6">
          <p className="text-sm text-stone-600">
            <Link
              href="/prepare"
              className="font-medium text-amber-950 underline-offset-4 hover:underline"
            >
              ← This week
            </Link>
            <span className="mx-2 text-stone-300">·</span>
            <Link
              href="/prepare/archive"
              className="text-stone-600 underline-offset-4 hover:underline"
            >
              Archive
            </Link>
          </p>
        </div>
      ) : null}
      <WeeklyGuidePage guide={guide} isCurrentWeek={isCurrentWeek} />
    </>
  )
}
