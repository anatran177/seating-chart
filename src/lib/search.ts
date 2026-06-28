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

/**
 * Re-rank Fuse matches so prefix relevance beats generic fuzzy matching.
 * Lower tier = better: 0 first-name prefix, 1 full-name prefix, 2 any word prefix,
 * 3 contains, 4 fuzzy only. This is why typing "A" surfaces A-names first.
 */
function prefixTier(name: string, query: string): number {
  const words = name.split(/[\s-]+/)
  const first = words[0] ?? name
  if (first.startsWith(query)) return 0
  if (name.startsWith(query)) return 1
  if (words.some((word) => word.startsWith(query))) return 2
  if (name.includes(query)) return 3
  return 4
}

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
    .map((result) => ({
      guest: result.item.guest,
      tier: prefixTier(result.item.name, normalized),
      score: result.score ?? 1,
    }))
    .sort(
      (a, b) =>
        a.tier - b.tier ||
        a.score - b.score ||
        a.guest.name.localeCompare(b.guest.name),
    )
    .slice(0, limit)
    .map(({ guest, score }) => ({ guest, score }))
}
