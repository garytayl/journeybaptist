"use client"

import type { ReactNode } from "react"
import { usePathname } from "next/navigation"
import { SiteHeader } from "@/components/site-header"

/**
 * Full-screen guide flow at /prepare/[slug] hides the global header;
 * archive, “read” view, and other routes keep the standard chrome.
 */
function shouldHideSiteHeader(pathname: string | null): boolean {
  if (!pathname) return false
  const parts = pathname.split("/").filter(Boolean)
  if (parts[0] !== "prepare") return false
  if (parts.length === 2 && parts[1] !== "archive") return true
  if (parts.length === 3 && parts[2] === "summary") return true
  return false
}

export function PrepareChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const hide = shouldHideSiteHeader(pathname)

  return (
    <>
      {!hide ? <SiteHeader /> : null}
      {children}
    </>
  )
}
