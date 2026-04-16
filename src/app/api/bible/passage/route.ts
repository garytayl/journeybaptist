import { NextRequest, NextResponse } from "next/server"
import { normalizeBibleApiRef } from "@/lib/bible-normalize-reference"

export const revalidate = 86_400

type ApiVerse = {
  book_id: string
  book_name: string
  chapter: number
  verse: number
  text: string
}

type ApiPayload = {
  reference?: string
  verses?: ApiVerse[]
  text?: string
  translation_name?: string
  translation_id?: string
  error?: string
}

export async function GET(request: NextRequest) {
  const ref = request.nextUrl.searchParams.get("ref")
  if (!ref?.trim()) {
    return NextResponse.json({ error: "Reference is required." }, { status: 400 })
  }

  const normalized = normalizeBibleApiRef(ref)
  if (normalized.length > 180) {
    return NextResponse.json({ error: "Reference too long." }, { status: 400 })
  }

  const path = encodeURIComponent(normalized).replace(/%20/g, "+")
  const url = `https://bible-api.com/${path}`

  try {
    const res = await fetch(url, {
      next: { revalidate: 86_400 },
      headers: { Accept: "application/json" },
    })

    if (!res.ok) {
      return NextResponse.json(
        { error: `Could not load passage (${res.status}).` },
        { status: 502 }
      )
    }

    const data = (await res.json()) as ApiPayload
    if (!data.verses?.length) {
      return NextResponse.json(
        { error: data.error ?? "No verses returned for this reference." },
        { status: 404 }
      )
    }

    const verses = data.verses.map((v) => ({
      chapter: v.chapter,
      verse: v.verse,
      text: v.text ?? "",
    }))

    return NextResponse.json({
      reference: data.reference ?? normalized,
      translationName: data.translation_name ?? "World English Bible",
      translationId: data.translation_id ?? "web",
      verses,
      plainText: data.text?.trim() ?? "",
    })
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unable to load passage."
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
