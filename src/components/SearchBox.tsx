import { useEffect, useId, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { Guest } from "../lib/types"
import { firstName } from "../lib/search"

interface SearchBoxProps {
  query: string
  matches: Guest[]
  onQueryChange: (value: string) => void
  onSelect: (guest: Guest) => void
  onSubmit: () => void
}

export function SearchBox({
  query,
  matches,
  onQueryChange,
  onSelect,
  onSubmit,
}: SearchBoxProps) {
  const listboxId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [focused, setFocused] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const open = focused && matches.length > 0

  // Autofocus on mount so guests can start typing immediately.
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  // Keep the active row in range as matches change.
  useEffect(() => {
    setActiveIndex((index) => (matches.length === 0 ? 0 : Math.min(index, matches.length - 1)))
  }, [matches.length])

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault()
        setActiveIndex((i) => Math.min(i + 1, matches.length - 1))
        break
      case "ArrowUp":
        event.preventDefault()
        setActiveIndex((i) => Math.max(i - 1, 0))
        break
      case "Enter":
        event.preventDefault()
        if (open && matches[activeIndex]) {
          onSelect(matches[activeIndex])
        } else {
          onSubmit()
        }
        break
      case "Escape":
        event.preventDefault()
        if (query) {
          onQueryChange("")
        } else {
          inputRef.current?.blur()
        }
        break
      case "Tab":
        // Allow natural tab navigation; close the dropdown.
        setFocused(false)
        break
    }
  }

  return (
    <div className="relative">
      <label htmlFor={`${listboxId}-input`} className="sr-only">
        Type your name to find your table
      </label>

      <div className="relative">
        {/* Search icon */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-gold"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
            <path
              d="m20 20-3.2-3.2"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
        </span>

        <input
          id={`${listboxId}-input`}
          ref={inputRef}
          type="text"
          inputMode="text"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="words"
          spellCheck={false}
          placeholder="Type your name…"
          value={query}
          role="combobox"
          aria-expanded={open}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={
            open && matches[activeIndex] ? `${listboxId}-opt-${activeIndex}` : undefined
          }
          onChange={(event) => onQueryChange(event.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full rounded-2xl border border-gold/40 bg-ivory/90 py-4 pl-14 pr-5 font-display text-xl text-plum-deep shadow-soft outline-none transition placeholder:text-plum-soft/55 focus:border-gold focus:bg-ivory focus:ring-4 focus:ring-gold/20"
        />
      </div>

      <AnimatePresence>
        {open && (
          <motion.ul
            id={listboxId}
            role="listbox"
            aria-label="Matching guests"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-gold/30 bg-ivory/95 p-1.5 shadow-card backdrop-blur-sm"
          >
            {matches.map((guest, index) => {
              const active = index === activeIndex
              return (
                <li
                  key={`${guest.name}-${guest.table}`}
                  id={`${listboxId}-opt-${index}`}
                  role="option"
                  aria-selected={active}
                  // Keep input focus while clicking a row so onBlur doesn't fire first.
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => onSelect(guest)}
                  className={[
                    "flex cursor-pointer items-center rounded-xl px-4 py-3 transition-colors",
                    active ? "bg-gold/15" : "hover:bg-plum/[0.06]",
                  ].join(" ")}
                >
                  <span className="font-display text-lg text-plum-deep">
                    {guest.name}
                  </span>
                </li>
              )
            })}
          </motion.ul>
        )}
      </AnimatePresence>

      {query.trim().length > 0 && matches.length === 0 && focused && (
        <p className="mt-3 px-1 text-sm text-plum-soft">
          No matches yet{query.trim().length < 3 ? " — keep typing" : ""}. Press
          Enter to look up{" "}
          <span className="font-semibold text-plum">“{firstName(query)}”</span>.
        </p>
      )}
    </div>
  )
}
