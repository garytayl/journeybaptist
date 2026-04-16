import { cn } from "@/lib/utils"

const labels = {
  head: { title: "Head", subtitle: "Observe the text" },
  heart: { title: "Heart", subtitle: "Believe and receive" },
  hands: { title: "Hands", subtitle: "Respond in faith" },
} as const

type Kind = keyof typeof labels

export function PromptBlock({
  kind,
  prompts,
}: {
  kind: Kind
  prompts: string[]
}) {
  const meta = labels[kind]
  if (!prompts.length) return null

  return (
    <section className="scroll-mt-24" aria-labelledby={`section-${kind}`}>
      <div className="mb-4 border-l-2 border-amber-900/25 pl-4">
        <p
          id={`section-${kind}`}
          className="font-serif text-2xl text-stone-900"
        >
          {meta.title}
        </p>
        <p className="text-sm text-stone-500">{meta.subtitle}</p>
      </div>
      <ol className="list-decimal space-y-3 pl-5 text-[1.05rem] leading-relaxed text-stone-800 marker:text-stone-400">
        {prompts.map((p, i) => (
          <li key={i} className={cn("pl-1")}>
            {p}
          </li>
        ))}
      </ol>
    </section>
  )
}
