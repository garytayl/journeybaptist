import Link from "next/link"
import { BookOpen, ArrowRight } from "lucide-react"
import { SiteHeader } from "@/components/site-header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="relative flex flex-1 flex-col">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.06'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-6 py-14">
          <p className="text-xs font-medium uppercase tracking-[0.22em] text-stone-500">
            Journey Baptist
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-[1.12] text-stone-900 sm:text-5xl">
            Scripture preparation
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-stone-700">
            One passage each week—Head, Heart, and Hands—to get ready for Tuesday
            Bible study and Sunday. Calm, text-centered, and shared across the
            church.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/prepare"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-stone-900 px-8 text-sm font-semibold text-white shadow-md transition hover:bg-stone-800"
            >
              <BookOpen className="h-4 w-4 opacity-90" aria-hidden />
              Open this week
              <ArrowRight className="h-4 w-4 opacity-80" aria-hidden />
            </Link>
            <Link
              href="/prepare/archive"
              className="inline-flex h-12 items-center justify-center rounded-full border border-stone-300 bg-white/90 px-8 text-sm font-medium text-stone-800 shadow-sm transition hover:border-stone-400 hover:bg-white"
            >
              Previous weeks
            </Link>
          </div>
          <p className="mt-12 text-sm leading-relaxed text-stone-500">
            Your journal stays on your device. No accounts required for reading and
            reflection—this is a quiet space for the congregation.
          </p>
        </div>
      </main>
      <footer className="relative pb-10 text-center text-xs text-stone-500">
        Journey Baptist · Members resource
      </footer>
    </div>
  )
}
