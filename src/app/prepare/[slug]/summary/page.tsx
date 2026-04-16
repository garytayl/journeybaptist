import { notFound } from "next/navigation"
import type { Metadata } from "next"
import {
  getGuideBySlug,
  getPublishedGuidesSorted,
} from "@/lib/weekly-guides"
import { PrepareSummaryScreen } from "@/components/prepare/prepare-summary-screen"

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return getPublishedGuidesSorted().map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide || guide.status !== "published") {
    return { title: "Summary" }
  }
  return {
    title: `Summary · ${guide.title}`,
    description: `Compiled Head, Heart, Hands, and journal for ${guide.scripture_reference}.`,
  }
}

export default async function PrepareSummaryPage({ params }: Props) {
  const { slug } = await params
  const guide = getGuideBySlug(slug)
  if (!guide || guide.status !== "published") notFound()

  return <PrepareSummaryScreen guide={guide} />
}
