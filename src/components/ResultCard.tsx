import { motion } from "framer-motion"
import type { Guest, LookupStatus } from "../lib/types"
import { firstName } from "../lib/search"

interface ResultCardProps {
  status: Extract<LookupStatus, "found" | "multiple" | "notfound">
  guest: Guest | null
  candidates: Guest[]
  onSelect: (guest: Guest) => void
  onReset: () => void
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function TableBadge({ guest, className = "" }: { guest: Guest; className?: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full bg-plum/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-plum ${className}`}
    >
      Table {guest.table}
    </span>
  )
}

function SearchAgainButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-8 inline-flex items-center gap-2 rounded-full border border-gold/50 bg-ivory px-6 py-2.5 text-sm font-semibold text-plum transition hover:border-gold hover:bg-gold/10 active:scale-[0.98]"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M3 12a9 9 0 1 0 2.6-6.3M3 4v4h4"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Search again
    </button>
  )
}

export function ResultCard({ status, guest, candidates, onSelect, onReset }: ResultCardProps) {
  if (status === "found" && guest) {
    return (
      <motion.div
        key="found"
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="text-center"
      >
        {/* Decorative floral accent */}
        <motion.svg
          width="56"
          height="56"
          viewBox="0 0 64 64"
          className="mx-auto mb-4 text-rose"
          aria-hidden="true"
          initial={{ rotate: -12, scale: 0.6, opacity: 0 }}
          animate={{ rotate: 0, scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
        >
          <g fill="currentColor" opacity="0.85">
            {[0, 60, 120, 180, 240, 300].map((a) => (
              <ellipse
                key={a}
                cx="32"
                cy="18"
                rx="7"
                ry="13"
                transform={`rotate(${a} 32 32)`}
              />
            ))}
          </g>
          <circle cx="32" cy="32" r="7" fill="#C9A961" />
        </motion.svg>

        <p className="font-display text-2xl italic text-plum-soft">Welcome,</p>
        <h2 className="mt-1 font-display text-4xl font-semibold leading-tight text-plum-deep sm:text-5xl">
          {firstName(guest.name)}.
        </h2>

        <div className="mx-auto my-6 flex items-center justify-center gap-3 text-gold">
          <span className="h-px w-12 bg-gold/60" />
          <span className="text-xs uppercase tracking-[0.3em]">Your table</span>
          <span className="h-px w-12 bg-gold/60" />
        </div>

        <p className="font-numeral text-6xl text-plum sm:text-7xl">
          {guest.table}
        </p>

        <SearchAgainButton onClick={onReset} />
      </motion.div>
    )
  }

  if (status === "multiple") {
    return (
      <motion.div
        key="multiple"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="text-center"
      >
        <h2 className="font-display text-3xl font-semibold text-plum-deep">
          Which one is you?
        </h2>
        <p className="mt-2 text-sm text-plum-soft">
          Several guests share that name. Choose your seat below.
        </p>

        <ul className="mt-6 space-y-2 text-left">
          {candidates.map((candidate) => (
            <li key={`${candidate.name}-${candidate.table}`}>
              <button
                type="button"
                onClick={() => onSelect(candidate)}
                className="flex w-full items-center justify-between gap-3 rounded-2xl border border-gold/30 bg-ivory/80 px-5 py-4 text-left transition hover:border-gold hover:bg-gold/10 active:scale-[0.99]"
              >
                <span className="font-display text-xl text-plum-deep">
                  {candidate.name}
                </span>
                <TableBadge guest={candidate} />
              </button>
            </li>
          ))}
        </ul>

        <SearchAgainButton onClick={onReset} />
      </motion.div>
    )
  }

  // notfound
  return (
    <motion.div
      key="notfound"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="text-center"
    >
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose/15 text-rose">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 8v5M12 16.5v.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </div>
      <h2 className="font-display text-3xl font-semibold text-plum-deep">
        We couldn&apos;t find that name
      </h2>
      <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-plum-soft">
        Please check the spelling and try again, or ask an usher at the entrance
        and they&apos;ll be happy to help you to your seat.
      </p>
      <SearchAgainButton onClick={onReset} />
    </motion.div>
  )
}
