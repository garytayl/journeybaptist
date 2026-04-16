import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  getCurrentPublishedGuide,
  getGuideBySlug,
  getPublishedGuidesSorted,
} from "@/lib/weekly-guides"
import { WeeklyPrepareView } from "@/components/prepare/weekly-prepare-view"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getPublishedGuidesSorted().map((g) => ({
    slug: g.slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide || guide.status !== "published") {
    return { title: "Guide" }
  }
  return {
    title: `Full page · ${guide.title}`,
    description: `${guide.scripture_reference} — full scroll view.`,
  }
}

export default async function PrepareGuideReadPage({ params }: Props) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide || guide.status !== "published") notFound()

  const current = getCurrentPublishedGuide()
  const isCurrentWeek = current?.slug === guide.slug

  return (
    <WeeklyPrepareView
      guide={guide}
      isCurrentWeek={isCurrentWeek}
      flowPath={`/prepare/${slug}`}
    />
  )
}
