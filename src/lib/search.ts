import Fuse from "fuse.js"
import type { Guest } from "./types"

/** Normalize a string: strip diacritics + lowercase for forgiving matching. */
export function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
}

/** First name token, e.g. "Eleanor Whitmore" -> "Eleanor". */
export function firstName(fullName: string): string {
  const trimmed = fullName.trim()
  const first = trimmed.split(/\s+/)[0]
  return first || trimmed
}

/** The document Fuse searches — carries the original guest alongside a normalized name. */
export interface SearchDoc {
  guest: Guest
  name: string
}

/** A Fuse index specialized for guest lookup. */
export type GuestFuse = Fuse<SearchDoc>

export function createGuestIndex(guests: Guest[]): GuestFuse {
  const docs: SearchDoc[] = guests.map((guest) => ({
    guest,
    name: normalize(guest.name),
  }))

  return new Fuse<SearchDoc>(docs, {
    keys: ["name"],
    includeScore: true,
    threshold: 0.4,
    ignoreLocation: true,
    minMatchCharLength: 1,
    isCaseSensitive: false,
  })
}

export type GuestSearchResult = { guest: Guest; score: number }

/** Run a fuzzy search, returning up to `limit` best guest matches. */
export function searchGuests(
  fuse: GuestFuse,
  query: string,
  limit = 6,
): GuestSearchResult[] {
  const normalized = normalize(query)
  if (normalized.length < 1) return []

  return fuse
    .search(normalized)
    .slice(0, limit)
    .map((result) => ({
      guest: result.item.guest,
      score: result.score ?? 1,
    }))
}
