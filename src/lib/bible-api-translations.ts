/**
 * Translations supported by bible-api.com (used for in-app reading).
 * CSB is not available there — use YouVersion / Bible Gateway links for CSB.
 */
export const BIBLE_API_ALLOWED_TRANSLATIONS = [
  "web",
  "kjv",
  "asv",
  "bbe",
  "darby",
  "dra",
  "oeb-cw",
  "oeb-us",
  "webbe",
] as const

export type BibleApiTranslation = (typeof BIBLE_API_ALLOWED_TRANSLATIONS)[number]

export function coerceBibleApiTranslation(input: string | undefined): BibleApiTranslation {
  const t = (input ?? "web").trim().toLowerCase()
  return (BIBLE_API_ALLOWED_TRANSLATIONS as readonly string[]).includes(t)
    ? (t as BibleApiTranslation)
    : "web"
}
