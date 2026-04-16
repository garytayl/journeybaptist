/**
 * Member journal for weekly guides — device-only (FXTranscriptor devotions pattern).
 * v2: { prayer, reflection }; v1: plain string → reflection only.
 */

const PREFIX_V2 = "jb_prepare_notes_v2_"
const PREFIX_LEGACY = "jb_prepare_notes_v1_"

export type PrepareJournal = {
  prayer: string
  reflection: string
}

function legacyKey(slug: string): string {
  return `${PREFIX_LEGACY}${slug}`
}

function keyForSlug(slug: string): string {
  return `${PREFIX_V2}${slug}`
}

function parseRaw(raw: string | null): PrepareJournal {
  if (!raw) return { prayer: "", reflection: "" }
  try {
    const j = JSON.parse(raw) as unknown
    if (j && typeof j === "object") {
      const o = j as Record<string, unknown>
      return {
        prayer: typeof o.prayer === "string" ? o.prayer : "",
        reflection: typeof o.reflection === "string" ? o.reflection : "",
      }
    }
  } catch {
    return { prayer: "", reflection: raw }
  }
  return { prayer: "", reflection: "" }
}

export function getJournal(slug: string): PrepareJournal {
  if (typeof window === "undefined") return { prayer: "", reflection: "" }
  try {
    const rawV2 = window.localStorage.getItem(keyForSlug(slug))
    if (rawV2 != null) return parseRaw(rawV2)
    const legacy = window.localStorage.getItem(legacyKey(slug))
    if (legacy != null) {
      const parsed = parseRaw(legacy)
      window.localStorage.setItem(keyForSlug(slug), JSON.stringify(parsed))
      window.localStorage.removeItem(legacyKey(slug))
      return parsed
    }
  } catch {
    // ignore
  }
  return { prayer: "", reflection: "" }
}

export function saveJournal(slug: string, data: PrepareJournal): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(keyForSlug(slug), JSON.stringify(data))
  } catch {
    // ignore quota / private mode
  }
}
