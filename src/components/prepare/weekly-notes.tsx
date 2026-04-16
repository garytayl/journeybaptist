"use client"

import { startTransition, useEffect, useRef, useState } from "react"
import { getNotes, saveNotes } from "@/lib/prepare-notes-storage"

export function WeeklyNotes({ slug }: { slug: string }) {
  const [value, setValue] = useState("")
  const skipNextSave = useRef(true)

  useEffect(() => {
    startTransition(() => {
      setValue(getNotes(slug))
    })
  }, [slug])

  useEffect(() => {
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    const t = window.setTimeout(() => saveNotes(slug, value), 400)
    return () => window.clearTimeout(t)
  }, [slug, value])

  return (
    <section className="scroll-mt-24" aria-labelledby="notes-heading">
      <h2
        id="notes-heading"
        className="font-serif text-2xl text-stone-900"
      >
        Notes
      </h2>
      <p className="mt-1 text-sm text-stone-500">
        Your reflections stay on this device—they are not uploaded.
      </p>
      <label htmlFor="weekly-notes" className="sr-only">
        Notes and reflection
      </label>
      <textarea
        id="weekly-notes"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        rows={8}
        placeholder="Prayers, insights, questions for Tuesday night…"
        className="mt-4 w-full resize-y rounded-xl border border-stone-200 bg-white/80 px-4 py-3 text-[1.05rem] leading-relaxed text-stone-800 shadow-sm placeholder:text-stone-400 focus:border-amber-900/30 focus:outline-none focus:ring-2 focus:ring-amber-900/15"
      />
    </section>
  )
}
