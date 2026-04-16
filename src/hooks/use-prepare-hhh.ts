"use client"

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import {
  getHhhData,
  saveHhhData,
  type PrepareHhhData,
} from "@/lib/prepare-hhh-storage"

export function usePrepareHhh(slug: string) {
  const [data, setData] = useState<PrepareHhhData>(() => ({
    prompts: {},
    sections: { head: "", heart: "", hands: "" },
  }))
  const skipSave = useRef(true)

  useEffect(() => {
    skipSave.current = true
    startTransition(() => {
      setData(getHhhData(slug))
    })
  }, [slug])

  useEffect(() => {
    if (skipSave.current) {
      skipSave.current = false
      return
    }
    const t = window.setTimeout(() => saveHhhData(slug, data), 450)
    return () => window.clearTimeout(t)
  }, [slug, data])

  const setPromptReply = useCallback((stepId: string, text: string) => {
    setData((d) => ({
      ...d,
      prompts: { ...d.prompts, [stepId]: text },
    }))
  }, [])

  const setSection = useCallback(
    (which: "head" | "heart" | "hands", text: string) => {
      setData((d) => ({
        ...d,
        sections: { ...d.sections, [which]: text },
      }))
    },
    []
  )

  return { data, setPromptReply, setSection }
}
