import type { ReactNode } from "react"
import type { Metadata } from "next"
import { PrepareChrome } from "./prepare-chrome"

export const metadata: Metadata = {
  title: "Weekly Scripture preparation · Journey Baptist",
  description:
    "Head, Heart, and Hands: prepare for Tuesday night Bible study and Sunday at Journey Baptist.",
}

export default function PrepareLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f6f3ee] text-stone-900">
      <PrepareChrome>{children}</PrepareChrome>
    </div>
  )
}
