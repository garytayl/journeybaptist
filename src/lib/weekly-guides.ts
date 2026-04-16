import guidesFile from "@/data/weekly-guides.json"

export type GuideStatus = "draft" | "published"

export type WeeklyGuide = {
  id: string
  slug: string
  title: string
  scripture_reference: string
  passage_text: string | null
  theme: string | null
  intro: string | null
  head_prompts: string[]
  heart_prompts: string[]
  hands_prompts: string[]
  prayer: string | null
  week_start_date: string
  status: GuideStatus
  created_at: string
  updated_at: string
}

type GuidesFile = { guides: WeeklyGuide[] }

function loadRaw(): WeeklyGuide[] {
  const data = guidesFile as GuidesFile
  return Array.isArray(data.guides) ? data.guides : []
}

/** All guides (any status)—for admin. */
export function getAllGuides(): WeeklyGuide[] {
  return loadRaw()
}

/** Published guides only, newest week first. */
export function getPublishedGuidesSorted(): WeeklyGuide[] {
  return loadRaw()
    .filter((g) => g.status === "published")
    .sort((a, b) => b.week_start_date.localeCompare(a.week_start_date))
}

export function getGuideBySlug(slug: string): WeeklyGuide | null {
  return loadRaw().find((g) => g.slug === slug) ?? null
}

function startOfDayUtc(d: Date): Date {
  return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
}

/**
 * Current week for members: latest published guide whose week_start_date is on or before today.
 * If none match (empty data), returns null.
 */
export function getCurrentPublishedGuide(now = new Date()): WeeklyGuide | null {
  const published = getPublishedGuidesSorted()
  if (published.length === 0) return null
  const today = startOfDayUtc(now).getTime()
  const eligible = published.filter((g) => {
    const t = Date.parse(g.week_start_date)
    return !Number.isNaN(t) && t <= today
  })
  if (eligible.length > 0) return eligible[0]
  // All guides may be dated in the future (e.g. preview): show the nearest upcoming week.
  return published[0] ?? null
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}
