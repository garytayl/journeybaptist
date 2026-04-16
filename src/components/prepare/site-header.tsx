import Link from "next/link"
import { BookOpen } from "lucide-react"

export function SiteHeader() {
  return (
    <header className="border-b border-stone-200/80 bg-[#faf8f5]/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-5 py-4">
        <Link href="/" className="group flex items-center gap-2 text-stone-800">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-200 bg-white shadow-sm">
            <BookOpen className="h-4 w-4 text-amber-900/80" aria-hidden />
          </span>
          <span className="font-serif text-lg tracking-tight group-hover:text-stone-950">
            Journey Baptist
          </span>
        </Link>
        <nav className="flex items-center gap-5 text-sm text-stone-600">
          <Link className="hover:text-stone-900" href="/prepare">
            This week
          </Link>
          <Link className="hover:text-stone-900" href="/prepare/archive">
            Archive
          </Link>
        </nav>
      </div>
    </header>
  )
}
