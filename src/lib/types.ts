export interface Guest {
  name: string
  table: number
}

export interface EventInfo {
  title: string
  names?: string
  subtitle: string
}

export interface GuestData {
  event: EventInfo
  guests: Guest[]
}

/**
 * Status of the lookup flow.
 * - searching: guest is typing; the live dropdown is visible.
 * - found:     a single guest was chosen; show their table card.
 * - multiple:  several guests share the queried name; ask them to pick one.
 * - notfound:  nothing matched the query; show a warm helper message.
 */
export type LookupStatus = "searching" | "found" | "multiple" | "notfound"
