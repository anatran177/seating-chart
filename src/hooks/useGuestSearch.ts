import { useEffect, useMemo, useState } from "react"
import type { Guest, LookupStatus } from "../lib/types"
import { searchGuests, type GuestFuse } from "../lib/search"

interface UseGuestSearchArgs {
  fuse: GuestFuse
  debounceMs?: number
  limit?: number
}

export interface GuestSearchApi {
  query: string
  setQuery: (value: string) => void
  matches: Guest[]
  status: LookupStatus
  selected: Guest | null
  candidates: Guest[]
  /** Choose a specific guest from the dropdown / multiple list. */
  selectGuest: (guest: Guest) => void
  /** Pressed Enter with no highlighted row: resolve the current query. */
  submit: () => void
  /** Clear everything and return to the search input. */
  reset: () => void
}

export function useGuestSearch({
  fuse,
  debounceMs = 120,
  limit = 6,
}: UseGuestSearchArgs): GuestSearchApi {
  const [query, setQuery] = useState("")
  const [debounced, setDebounced] = useState("")
  const [status, setStatus] = useState<LookupStatus>("searching")
  const [selected, setSelected] = useState<Guest | null>(null)
  const [candidates, setCandidates] = useState<Guest[]>([])

  // Debounce the query so typing doesn't run the matcher on every keystroke.
  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(query), debounceMs)
    return () => window.clearTimeout(id)
  }, [query, debounceMs])

  const matches = useMemo<Guest[]>(() => {
    if (status !== "searching") return []
    return searchGuests(fuse, debounced, limit).map((result) => result.guest)
  }, [fuse, debounced, limit, status])

  function selectGuest(guest: Guest): void {
    setSelected(guest)
    setCandidates([])
    setStatus("found")
  }

  function submit(): void {
    // Resolve against the current (non-debounced) query so Enter feels instant.
    const results = searchGuests(fuse, query, limit).map(
      (result) => result.guest,
    )

    if (results.length === 0) {
      setSelected(null)
      setCandidates([])
      setStatus("notfound")
      return
    }

    if (results.length === 1) {
      selectGuest(results[0])
      return
    }

    // Several matches — never assume; ask them to pick.
    setSelected(null)
    setCandidates(results)
    setStatus("multiple")
  }

  function reset(): void {
    setQuery("")
    setDebounced("")
    setSelected(null)
    setCandidates([])
    setStatus("searching")
  }

  return {
    query,
    setQuery,
    matches,
    status,
    selected,
    candidates,
    selectGuest,
    submit,
    reset,
  }
}
