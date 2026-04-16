import type { WeeklyGuide } from "@/lib/weekly-guides"
import { WeeklyPrepareView } from "@/components/prepare/weekly-prepare-view"

export function WeeklyGuidePage({
  guide,
  isCurrentWeek = false,
}: {
  guide: WeeklyGuide
  isCurrentWeek?: boolean
}) {
  return <WeeklyPrepareView guide={guide} isCurrentWeek={isCurrentWeek} />
}
