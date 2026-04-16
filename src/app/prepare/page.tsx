import { redirect } from "next/navigation"
import { getCurrentPublishedGuide } from "@/lib/weekly-guides"

export default function PrepareIndexPage() {
  const guide = getCurrentPublishedGuide()
  if (!guide) redirect("/prepare/archive")
  redirect(`/prepare/${guide.slug}`)
}
