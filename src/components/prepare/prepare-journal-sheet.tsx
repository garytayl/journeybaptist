"use client"

import { useCallback, useEffect } from "react"
import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
  useReducedMotion,
  type PanInfo,
} from "framer-motion"
import { PenLine, X, ChevronDown } from "lucide-react"
import type { PrepareJournal } from "@/lib/prepare-notes-storage"
import { PrepareJournalFields } from "@/components/prepare/prepare-journal-fields"
import { cn } from "@/lib/utils"

const DISMISS = 72

export function PrepareJournalDock({
  journal,
  onJournalChange,
  open,
  onOpenChange,
}: {
  journal: PrepareJournal
  onJournalChange: (next: PrepareJournal) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const reduced = useReducedMotion()
  const sheetY = useMotionValue(0)
  const backdropOpacity = useTransform(sheetY, [0, 320], [1, 0])
  const dragControls = useDragControls()

  const onDismiss = useCallback(() => onOpenChange(false), [onOpenChange])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onDismiss()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onDismiss])

  const handleDragEnd = useCallback(
    (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (info.offset.y > DISMISS || info.velocity.y > 420) onDismiss()
    },
    [onDismiss]
  )

  return (
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduced ? 0 : 0.2 }}
            style={{ opacity: backdropOpacity }}
            className="fixed inset-0 z-[60] bg-stone-900/25 backdrop-blur-[2px] lg:hidden"
            onClick={onDismiss}
            aria-hidden
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={
              reduced
                ? { duration: 0.15 }
                : { type: "spring", damping: 32, stiffness: 380 }
            }
            style={{ y: sheetY }}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0 }}
            dragElastic={{ top: 0.04, bottom: 0.85 }}
            onDragEnd={handleDragEnd}
            className={cn(
              "fixed bottom-0 left-0 right-0 z-[61] flex max-h-[88vh] flex-col lg:hidden",
              "rounded-t-2xl border border-stone-200/90 bg-[#faf8f5] shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="journal-sheet-title"
          >
            <div
              className="flex shrink-0 cursor-grab flex-col items-center pt-3 pb-2 active:cursor-grabbing"
              style={{ touchAction: "none" }}
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div className="h-1.5 w-12 rounded-full bg-stone-300" />
            </div>
            <div
              className="flex shrink-0 items-center justify-between gap-3 border-b border-stone-200/80 px-5 pb-3"
              onPointerDown={(e) => dragControls.start(e)}
            >
              <div>
                <p
                  id="journal-sheet-title"
                  className="text-[11px] font-medium uppercase tracking-[0.2em] text-stone-500"
                >
                  Journal
                </p>
                <p className="text-sm text-stone-600">Saved on this device only</p>
              </div>
              <button
                type="button"
                onClick={onDismiss}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-stone-200 bg-white text-stone-600 transition hover:bg-stone-50"
                aria-label="Close journal"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div
              className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-6 pt-4"
              style={{
                WebkitOverflowScrolling: "touch",
                paddingBottom: "max(1.25rem, env(safe-area-inset-bottom))",
              }}
            >
              <PrepareJournalFields
                idPrefix="sheet"
                value={journal}
                onChange={onJournalChange}
                variant="sheet"
              />
            </div>
            <div className="flex shrink-0 items-center justify-center gap-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1 text-stone-400">
              <ChevronDown className="h-3 w-3 opacity-60" aria-hidden />
              <span className="text-[10px] font-medium uppercase tracking-widest">
                Drag down to close
              </span>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        initial={reduced ? false : { y: 16, opacity: 0 }}
        animate={{
          y: 0,
          opacity: open ? 0 : 1,
          pointerEvents: open ? "none" : "auto",
        }}
        transition={
          reduced ? { duration: 0 } : { type: "spring", damping: 22, stiffness: 320 }
        }
        onClick={() => onOpenChange(true)}
        aria-hidden={open}
        tabIndex={open ? -1 : 0}
        className={cn(
          "fixed bottom-5 left-1/2 z-[55] flex -translate-x-1/2 items-center gap-2 lg:hidden",
          "rounded-full border border-stone-200/90 bg-white/95 px-4 py-2.5 shadow-lg backdrop-blur",
          "text-sm font-medium text-stone-800 active:scale-[0.98]"
        )}
        style={{ paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))" }}
      >
        <PenLine className="h-4 w-4 text-amber-900/80" aria-hidden />
        Journal
      </motion.button>
    </>
  )
}
