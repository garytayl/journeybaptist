/**
 * Head / Heart / Hands written responses — local only, keyed by weekly slug.
 * `prompts` maps flow step ids (e.g. head-1). `sections` backs the full-page scroll view.
 */

export type PrepareHhhData = {
  prompts: Record<string, string>
  sections: { head: string; heart: string; hands: string }
}

const DEFAULT: PrepareHhhData = {
  prompts: {},
  sections: { head: "", heart: "", hands: "" },
}

const PREFIX = "jb_prepare_hhh_v1_"

function keyForSlug(slug: string): string {
  return `${PREFIX}${slug}`
}

function parse(raw: string | null): PrepareHhhData {
  if (!raw) return { ...DEFAULT, prompts: {}, sections: { ...DEFAULT.sections } }
  try {
    const j = JSON.parse(raw) as unknown
    if (!j || typeof j !== "object") return { ...DEFAULT, prompts: {}, sections: { ...DEFAULT.sections } }
    const o = j as Record<string, unknown>
    const prompts =
      o.prompts && typeof o.prompts === "object"
        ? (o.prompts as Record<string, string>)
        : {}
    const sec = o.sections && typeof o.sections === "object" ? (o.sections as Record<string, string>) : {}
    return {
      prompts: { ...prompts },
      sections: {
        head: typeof sec.head === "string" ? sec.head : "",
        heart: typeof sec.heart === "string" ? sec.heart : "",
        hands: typeof sec.hands === "string" ? sec.hands : "",
      },
    }
  } catch {
    return { ...DEFAULT, prompts: {}, sections: { ...DEFAULT.sections } }
  }
}

export function getHhhData(slug: string): PrepareHhhData {
  if (typeof window === "undefined") {
    return { ...DEFAULT, prompts: {}, sections: { ...DEFAULT.sections } }
  }
  try {
    return parse(window.localStorage.getItem(keyForSlug(slug)))
  } catch {
    return { ...DEFAULT, prompts: {}, sections: { ...DEFAULT.sections } }
  }
}

export function saveHhhData(slug: string, data: PrepareHhhData): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(keyForSlug(slug), JSON.stringify(data))
  } catch {
    // ignore
  }
}
