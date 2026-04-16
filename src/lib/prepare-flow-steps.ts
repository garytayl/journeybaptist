import type { WeeklyGuide } from "@/lib/weekly-guides"

export type FlowStep =
  | { id: string; kind: "welcome" }
  | { id: string; kind: "intro"; text: string }
  | {
      id: string
      kind: "scripture"
      /** Full passage for reading step, or null to show reference + external link only. */
      passageText: string | null
    }
  | {
      id: string
      kind: "prompt"
      section: "head" | "heart" | "hands"
      sectionIndex: number
      sectionTotal: number
      text: string
    }
  | { id: string; kind: "prayer"; text: string }
  | { id: string; kind: "journal" }
  | { id: string; kind: "complete" }

const sectionLabel: Record<"head" | "heart" | "hands", string> = {
  head: "Head",
  heart: "Heart",
  hands: "Hands",
}

function pushPrompts(
  out: FlowStep[],
  section: "head" | "heart" | "hands",
  prompts: string[]
) {
  const list = prompts.map((p) => p.trim()).filter(Boolean)
  const total = list.length
  list.forEach((text, i) => {
    out.push({
      id: `${section}-${i + 1}`,
      kind: "prompt",
      section,
      sectionIndex: i + 1,
      sectionTotal: total,
      text,
    })
  })
}

export function buildPrepareFlowSteps(guide: WeeklyGuide): FlowStep[] {
  const steps: FlowStep[] = [{ id: "welcome", kind: "welcome" }]

  const intro = guide.intro?.trim()
  if (intro) {
    steps.push({ id: "intro", kind: "intro", text: intro })
  }

  steps.push({
    id: "scripture",
    kind: "scripture",
    passageText: guide.passage_text?.trim() ? guide.passage_text : null,
  })

  pushPrompts(steps, "head", guide.head_prompts)
  pushPrompts(steps, "heart", guide.heart_prompts)
  pushPrompts(steps, "hands", guide.hands_prompts)

  const prayer = guide.prayer?.trim()
  if (prayer) {
    steps.push({ id: "prayer", kind: "prayer", text: prayer })
  }

  steps.push({ id: "journal", kind: "journal" })
  steps.push({ id: "complete", kind: "complete" })

  return steps
}

export function sectionTitle(section: "head" | "heart" | "hands"): string {
  return sectionLabel[section]
}
