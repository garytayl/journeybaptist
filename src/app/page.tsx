import Link from "next/link"
import { BookOpen } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-16">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
          Journey Baptist
        </p>
        <h1 className="mt-4 font-serif text-4xl leading-tight text-stone-900 sm:text-5xl">
          Scripture preparation
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-stone-700">
          Each week we walk through one passage together—Head, Heart, and Hands—to
          prepare for Tuesday night Bible study and Sunday preaching. Quiet,
          focused, and rooted in the text.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href="/prepare"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-stone-900 px-8 text-sm font-semibold text-white shadow-sm transition hover:bg-stone-800"
          >
            <BookOpen className="h-4 w-4 opacity-90" aria-hidden />
            Open this week
          </Link>
          <Link
            href="/prepare/archive"
            className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 bg-white/80 px-8 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-white"
          >
            Browse archive
          </Link>
        </div>
      </main>
      <footer className="pb-8 text-center text-xs text-stone-500">
        Journey Baptist · Members resource
      </footer>
    </div>
  )
}
