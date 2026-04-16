import type { WeeklyGuide } from "@/lib/weekly-guides"
import { PrepareStepFlow } from "@/components/prepare/prepare-step-flow"

export function WeeklyGuidePage({
  guide,
  isCurrentWeek = false,
  readPath,
}: {
  guide: WeeklyGuide
  isCurrentWeek?: boolean
  readPath: string
}) {
  return (
    <PrepareStepFlow
      guide={guide}
      isCurrentWeek={isCurrentWeek}
      readPath={readPath}
    />
  )
}
