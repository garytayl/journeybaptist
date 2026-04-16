import type { Metadata } from "next"
import { getAllGuides } from "@/lib/weekly-guides"
import { AdminPrepareClient } from "./admin-prepare-client"

export const metadata: Metadata = {
  title: "Admin · Weekly guides",
  robots: { index: false, follow: false },
}

export default function AdminPreparePage() {
  const guides = getAllGuides()
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-stone-900">
      <AdminPrepareClient initialGuides={guides} />
    </div>
  )
}
