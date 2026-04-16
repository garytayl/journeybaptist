"use client"

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  getJournal,
  saveJournal,
  type PrepareJournal,
} from "@/lib/prepare-notes-storage"

export function usePrepareJournal(slug: string) {
  const [journal, setJournal] = useState<PrepareJournal>({
    prayer: "",
    reflection: "",
  })
  const skipSave = useRef(true)

  useEffect(() => {
    skipSave.current = true
    startTransition(() => {
      setJournal(getJournal(slug))
    })
  }, [slug])

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false
      return
    }
    const t = window.setTimeout(() => saveJournal(slug, journal), 450)
    return () => window.clearTimeout(t)
  }, [slug, journal])

  const setJournalSafe = useCallback((next: PrepareJournal) => {
    setJournal(next)
  }, [])

  return { journal, setJournal: setJournalSafe }
}
