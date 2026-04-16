/**
 * Member notes for weekly guides — stored in this browser only (FXTranscriptor devotions pattern).
 */

const PREFIX = "jb_prepare_notes_v1_"

export function notesKeyForSlug(slug: string): string {
  return `${PREFIX}${slug}`
}

export function getNotes(slug: string): string {
  if (typeof window === "undefined") return ""
  try {
    return window.localStorage.getItem(notesKeyForSlug(slug)) ?? ""
  } catch {
    return ""
  }
}

export function saveNotes(slug: string, text: string): void {
  if (typeof window === "undefined") return
  try {
    window.localStorage.setItem(notesKeyForSlug(slug), text)
  } catch {
    // ignore quota / private mode
  }
}
