import type { WeeklyGuide } from "@/lib/weekly-guides"
import type { PrepareHhhData } from "@/lib/prepare-hhh-storage"

export type SummaryPromptRow = {
  id: string
  prompt: string
  answer: string
}

export type SummarySectionRows = {
  key: "head" | "heart" | "hands"
  title: string
  subtitle: string
  rows: SummaryPromptRow[]
  /** Optional notes from the full-page scroll view (one box per section). */
  scrollNote: string
}

const subtitles: Record<"head" | "heart" | "hands", string> = {
  head: "Observe the text",
  heart: "Believe and receive",
  hands: "Respond in faith",
}

function promptsFor(
  guide: WeeklyGuide,
  section: "head" | "heart" | "hands"
): string[] {
  const raw =
    section === "head"
      ? guide.head_prompts
      : section === "heart"
        ? guide.heart_prompts
        : guide.hands_prompts
  return raw.map((p) => p.trim()).filter(Boolean)
}

export function buildSummarySections(
  guide: WeeklyGuide,
  hhh: PrepareHhhData
): SummarySectionRows[] {
  return (["head", "heart", "hands"] as const).map((key) => {
    const prompts = promptsFor(guide, key)
    const title =
      key === "head" ? "Head" : key === "heart" ? "Heart" : "Hands"
    const rows: SummaryPromptRow[] = prompts.map((prompt, i) => {
      const id = `${key}-${i + 1}`
      return {
        id,
        prompt,
        answer: (hhh.prompts[id] ?? "").trim(),
      }
    })
    const scrollKey = key
    const scrollNote = (hhh.sections[scrollKey] ?? "").trim()
    return {
      key,
      title,
      subtitle: subtitles[key],
      rows,
      scrollNote,
    }
  })
}
