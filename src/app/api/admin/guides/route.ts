import { writeFileSync } from "fs"
import { join } from "path"
import { NextResponse } from "next/server"
import type { WeeklyGuide } from "@/lib/weekly-guides"

export async function POST(request: Request) {
  const token = process.env.GUIDES_ADMIN_TOKEN
  if (!token) {
    return NextResponse.json(
      { ok: false, error: "GUIDES_ADMIN_TOKEN is not configured." },
      { status: 501 }
    )
  }

  const auth = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "")
  if (auth !== token) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 })
  }

  let body: { guides?: WeeklyGuide[] }
  try {
    body = (await request.json()) as { guides?: WeeklyGuide[] }
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 })
  }

  if (!Array.isArray(body.guides)) {
    return NextResponse.json({ ok: false, error: "guides array required" }, { status: 400 })
  }

  const path = join(process.cwd(), "src", "data", "weekly-guides.json")
  try {
    writeFileSync(path, JSON.stringify({ guides: body.guides }, null, 2) + "\n", "utf8")
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: e instanceof Error ? e.message : "Write failed (read-only deploy?)",
      },
      { status: 500 }
    )
  }

  return NextResponse.json({ ok: true })
}
