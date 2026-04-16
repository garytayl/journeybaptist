"use client"

import { useCallback, useMemo, useState } from "react"
import Link from "next/link"
import { Plus, Trash2, Download, Loader2 } from "lucide-react"
import type { GuideStatus, WeeklyGuide } from "@/lib/weekly-guides"
import { slugifyTitle } from "@/lib/weekly-guides"
import { cn } from "@/lib/utils"

function emptyGuide(): WeeklyGuide {
  const now = new Date().toISOString()
  const week = new Date().toISOString().slice(0, 10)
  return {
    id: `guide-${crypto.randomUUID()}`,
    slug: "",
    title: "",
    scripture_reference: "",
    passage_text: null,
    theme: null,
    intro: null,
    head_prompts: [""],
    heart_prompts: [""],
    hands_prompts: [""],
    prayer: null,
    week_start_date: week,
    status: "draft",
    created_at: now,
    updated_at: now,
  }
}

export function AdminPrepareClient({
  initialGuides,
}: {
  initialGuides: WeeklyGuide[]
}) {
  const [guides, setGuides] = useState<WeeklyGuide[]>(initialGuides)
  const [selectedId, setSelectedId] = useState<string | null>(
    initialGuides[0]?.id ?? null
  )
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const selected = useMemo(
    () => guides.find((g) => g.id === selectedId) ?? null,
    [guides, selectedId]
  )

  const updateSelected = useCallback(
    (patch: Partial<WeeklyGuide>) => {
      if (!selectedId) return
      setGuides((prev) =>
        prev.map((g) =>
          g.id === selectedId
            ? { ...g, ...patch, updated_at: new Date().toISOString() }
            : g
        )
      )
    },
    [selectedId]
  )

  const setPrompts = useCallback(
    (field: "head_prompts" | "heart_prompts" | "hands_prompts", lines: string[]) => {
      updateSelected({ [field]: lines } as Partial<WeeklyGuide>)
    },
    [updateSelected]
  )

  const exportJson = useCallback(() => {
    const blob = new Blob([JSON.stringify({ guides }, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "weekly-guides.json"
    a.click()
    URL.revokeObjectURL(url)
    setMessage("Download started—replace src/data/weekly-guides.json and deploy.")
  }, [guides])

  const saveToServer = useCallback(async () => {
    const token = window.prompt("Admin token (from GUIDES_ADMIN_TOKEN env):")?.trim()
    if (!token) return
    setSaving(true)
    setMessage(null)
    try {
      const res = await fetch("/api/admin/guides", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ guides }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean
        error?: string
      }
      if (!res.ok) throw new Error(data.error || res.statusText)
      setMessage("Saved to src/data/weekly-guides.json (local dev only).")
    } catch (e) {
      setMessage(
        e instanceof Error ? e.message : "Save failed. Use Export JSON for production."
      )
    } finally {
      setSaving(false)
    }
  }, [guides])

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <p className="text-sm text-stone-600">
        <Link href="/prepare" className="text-amber-950 underline-offset-4 hover:underline">
          ← Public site
        </Link>
      </p>
      <h1 className="mt-4 font-serif text-3xl text-stone-900">
        Weekly guides (admin)
      </h1>
      <p className="mt-2 max-w-2xl text-stone-600 leading-relaxed">
        Journey Baptist content for Head, Heart, and Hands. Export JSON and commit{" "}
        <code className="rounded bg-stone-200/80 px-1.5 py-0.5 text-sm">src/data/weekly-guides.json</code>{" "}
        for production. Server save works only in local dev when{" "}
        <code className="rounded bg-stone-200/80 px-1.5 py-0.5 text-sm">GUIDES_ADMIN_TOKEN</code> is set.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm font-medium text-stone-800 shadow-sm hover:bg-stone-50"
          onClick={exportJson}
        >
          <Download className="h-4 w-4" aria-hidden />
          Export JSON
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-stone-300 bg-stone-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-stone-800 disabled:opacity-60"
          onClick={saveToServer}
          disabled={saving}
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          ) : null}
          Save to repo (local)
        </button>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-dashed border-stone-400 px-4 py-2 text-sm font-medium text-stone-800 hover:bg-white/80"
          onClick={() => {
            const g = emptyGuide()
            setGuides((prev) => [...prev, g])
            setSelectedId(g.id)
          }}
        >
          <Plus className="h-4 w-4" aria-hidden />
          New guide
        </button>
      </div>
      {message ? (
        <p className="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-950">
          {message}
        </p>
      ) : null}

      <div className="mt-10 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-stone-500">
            Guides
          </p>
          <ul className="space-y-1">
            {guides.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(g.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm transition",
                    g.id === selectedId
                      ? "bg-white shadow-sm ring-1 ring-stone-200"
                      : "hover:bg-white/60"
                  )}
                >
                  <span className="block truncate font-medium text-stone-900">
                    {g.title || "Untitled"}
                  </span>
                  <span className="block truncate text-xs text-stone-500">
                    {g.week_start_date} · {g.status}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {selected ? (
          <div className="space-y-5 rounded-xl border border-stone-200 bg-white/80 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex items-center gap-2 text-sm text-stone-700">
                Status
                <select
                  className="rounded-md border border-stone-300 bg-white px-2 py-1.5 text-sm"
                  value={selected.status}
                  onChange={(e) =>
                    updateSelected({ status: e.target.value as GuideStatus })
                  }
                >
                  <option value="draft">draft</option>
                  <option value="published">published</option>
                </select>
              </label>
              <button
                type="button"
                className="inline-flex items-center gap-1 text-sm text-red-700 hover:underline"
                onClick={() => {
                  if (!confirm("Delete this guide?")) return
                  setGuides((prev) => prev.filter((g) => g.id !== selected.id))
                  setSelectedId(null)
                }}
              >
                <Trash2 className="h-4 w-4" aria-hidden />
                Delete
              </button>
            </div>

            <Field
              label="Title"
              value={selected.title}
              onChange={(title) => {
                const next = { title }
                if (!selected.slug || selected.slug === slugifyTitle(selected.title)) {
                  Object.assign(next, { slug: `${selected.week_start_date}-${slugifyTitle(title)}` })
                }
                updateSelected(next)
              }}
            />
            <Field
              label="Slug (URL)"
              value={selected.slug}
              onChange={(slug) => updateSelected({ slug })}
            />
            <Field
              label="Scripture reference"
              value={selected.scripture_reference}
              onChange={(scripture_reference) => updateSelected({ scripture_reference })}
            />
            <Field
              label="Theme (optional)"
              value={selected.theme ?? ""}
              onChange={(theme) => updateSelected({ theme: theme || null })}
            />
            <Field
              label="Week start (YYYY-MM-DD)"
              value={selected.week_start_date}
              onChange={(week_start_date) => updateSelected({ week_start_date })}
            />

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Intro
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
                rows={4}
                value={selected.intro ?? ""}
                onChange={(e) => updateSelected({ intro: e.target.value || null })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Passage text (optional)
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
                rows={8}
                value={selected.passage_text ?? ""}
                onChange={(e) =>
                  updateSelected({ passage_text: e.target.value || null })
                }
              />
            </div>

            <PromptEditor
              label="Head prompts"
              lines={selected.head_prompts}
              onChange={(lines) => setPrompts("head_prompts", lines)}
            />
            <PromptEditor
              label="Heart prompts"
              lines={selected.heart_prompts}
              onChange={(lines) => setPrompts("heart_prompts", lines)}
            />
            <PromptEditor
              label="Hands prompts"
              lines={selected.hands_prompts}
              onChange={(lines) => setPrompts("hands_prompts", lines)}
            />

            <div>
              <label className="block text-sm font-medium text-stone-700">
                Prayer (optional)
              </label>
              <textarea
                className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
                rows={5}
                value={selected.prayer ?? ""}
                onChange={(e) => updateSelected({ prayer: e.target.value || null })}
              />
            </div>
          </div>
        ) : (
          <p className="text-stone-600">Select or create a guide.</p>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      <input
        className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

function PromptEditor({
  label,
  lines,
  onChange,
}: {
  label: string
  lines: string[]
  onChange: (lines: string[]) => void
}) {
  const text = lines.join("\n")
  return (
    <div>
      <label className="block text-sm font-medium text-stone-700">{label}</label>
      <p className="text-xs text-stone-500">One prompt per line</p>
      <textarea
        className="mt-1 w-full rounded-md border border-stone-300 px-3 py-2 text-sm"
        rows={Math.max(4, lines.length + 2)}
        value={text}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
          )
        }
      />
    </div>
  )
}
