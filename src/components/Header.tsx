import type { EventInfo } from "../lib/types"

export function Header({ event }: { event: EventInfo }) {
  return (
    <header className="text-center">
      <div className="mb-3 flex items-center justify-center gap-3 text-gold">
        <span className="h-px w-8 bg-gold/60 sm:w-12" />
        <FlourishIcon />
        <span className="h-px w-8 bg-gold/60 sm:w-12" />
      </div>
      <h1 className="pb-3 font-display whitespace-nowrap text-[clamp(1.65rem,8vw,3rem)] font-semibold leading-none text-plum">
        {event.title}
      </h1>
      {event.names ? (
        <p className="mt-1.5 font-script leading-none text-plum-soft text-[clamp(1.4rem,6vw,2rem)]">
          {event.names}
        </p>
      ) : null}
      <p className="mt-4 text-xs font-medium uppercase tracking-[0.18em] text-plum-soft sm:text-sm">
        {event.subtitle}
      </p>
    </header>
  )
}

function FlourishIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g fill="currentColor">
        <ellipse cx="12" cy="6" rx="2.4" ry="4" />
        <ellipse cx="12" cy="18" rx="2.4" ry="4" />
        <ellipse cx="6" cy="12" rx="4" ry="2.4" />
        <ellipse cx="18" cy="12" rx="4" ry="2.4" />
      </g>
      <circle cx="12" cy="12" r="2.4" fill="#5F3248" />
    </svg>
  )
}
