import { useId } from "react"

/* -------------------------------------------------------------------------- */
/* Mapping — single source of truth for "table → flower".                     */
/* Tables not listed here fall back to DEFAULT_KIND so new tables keep working.*/
/* -------------------------------------------------------------------------- */

type FlowerKind =
  | "peony"
  | "delphinium"
  | "daisy"
  | "ranunculus"
  | "lotus"
  | "sweetpea"

const TABLE_FLOWERS: Record<number, FlowerKind> = {
  1: "sweetpea",
  2: "lotus",
  3: "ranunculus",
  4: "daisy",
  5: "delphinium",
  6: "peony",
}

const FLOWER_NAMES: Record<FlowerKind, string> = {
  peony: "Peony",
  delphinium: "Delphinium",
  daisy: "Daisy",
  ranunculus: "Ranunculus",
  lotus: "Lotus",
  sweetpea: "Sweet Pea",
}

const DEFAULT_KIND: FlowerKind = "peony"

function flowerForTable(table: number): FlowerKind {
  return TABLE_FLOWERS[table] ?? DEFAULT_KIND
}

/** Human-readable flower name for a given table (e.g. "Peony"). */
export function getFlowerName(table: number): string {
  return FLOWER_NAMES[flowerForTable(table)]
}

/** useId() returns strings with colons; sanitize for use inside SVG url(#...) refs. */
function useSafeId(): string {
  return useId().replace(/[^a-zA-Z0-9_-]/g, "")
}

/* -------------------------------------------------------------------------- */
/* Flower components — each is a <g> drawn around (50, 50) on a 100×100 grid.  */
/* Kept cohesive: shared palette, soft two-tone gradients, gold stamen dots.  */
/* Kept distinct: different petal count, silhouette, and accent color.        */
/* -------------------------------------------------------------------------- */

/** Table 1 — Peony: full, ruffled, many notched petals. Rose tone. */
function Peony({ id }: { id: string }) {
  const pathFor = (len: number, w: number, notch: number) => {
    const tipY = 50 - len
    const sideY = 50 - len * 0.4
    return [
      "M 50 50",
      `C ${50 - w} ${sideY}, ${50 - w} ${tipY + 4}, ${50 - notch} ${tipY}`,
      `C ${50 - notch * 0.3} ${tipY + 3.5}, ${50 + notch * 0.3} ${tipY + 3.5}, ${50 + notch} ${tipY}`,
      `C ${50 + w} ${tipY + 4}, ${50 + w} ${sideY}, 50 50 Z`,
    ].join(" ")
  }
  const rings = [
    { count: 8, len: 36, w: 13, notch: 4, opacity: 0.55, offset: 0 },
    { count: 8, len: 36, w: 13, notch: 4, opacity: 0.55, offset: 22.5 },
    { count: 7, len: 26, w: 11, notch: 3, opacity: 0.8, offset: 15 },
    { count: 6, len: 16, w: 8, notch: 2, opacity: 1, offset: 0 },
  ]
  return (
    <g>
      {rings.map((r) =>
        Array.from({ length: r.count }, (_, i) => {
          const angle = r.offset + (360 / r.count) * i
          return (
            <path
              key={`ring-${r.count}-${r.offset}-${i}`}
              d={pathFor(r.len, r.w, r.notch)}
              fill={`url(#${id}-petal)`}
              opacity={r.opacity}
              transform={`rotate(${angle} 50 50)`}
            />
          )
        }),
      )}
      {Array.from({ length: 6 }, (_, i) => {
        const a = (360 / 6) * i
        const r = 5
        const cx = 50 + r * Math.cos((a * Math.PI) / 180)
        const cy = 50 + r * Math.sin((a * Math.PI) / 180)
        return <circle key={`stamen-${i}`} cx={cx} cy={cy} r="1.6" fill="#C9A961" />
      })}
      <circle cx="50" cy="50" r="3.2" fill="#7A4A60" />
      <circle cx="45" cy="43" r="13" fill={`url(#${id}-hi)`} opacity="0.35" />
      <defs>
        <radialGradient id={`${id}-petal`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#F4D8E0" />
          <stop offset="100%" stopColor="#B5798A" />
        </radialGradient>
        <radialGradient id={`${id}-hi`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Table 2 — Ranunculus: tight nested circular whorls of rounded petals. Gold/ivory. */
function Ranunculus({ id }: { id: string }) {
  const pathFor = (len: number, w: number) => {
    const tipY = 50 - len
    return [
      "M 50 50",
      `C ${50 - w} ${50 - len * 0.35}, ${50 - w} ${tipY + w * 0.4}, 50 ${tipY}`,
      `C ${50 + w} ${tipY + w * 0.4}, ${50 + w} ${50 - len * 0.35}, 50 50 Z`,
    ].join(" ")
  }
  const rings = [
    { count: 10, len: 32, w: 10, opacity: 0.85, offset: 0, grad: `${id}-outer` },
    { count: 9, len: 24, w: 8.5, opacity: 0.9, offset: 18, grad: `${id}-mid` },
    { count: 7, len: 16, w: 6.8, opacity: 0.95, offset: 10, grad: `${id}-inner` },
    { count: 5, len: 9, w: 4.5, opacity: 1, offset: 0, grad: `${id}-core` },
  ]
  return (
    <g>
      {rings.map((r) =>
        Array.from({ length: r.count }, (_, i) => {
          const angle = r.offset + (360 / r.count) * i
          return (
            <path
              key={`ring-${r.count}-${r.offset}-${i}`}
              d={pathFor(r.len, r.w)}
              fill={`url(#${r.grad})`}
              opacity={r.opacity}
              transform={`rotate(${angle} 50 50)`}
            />
          )
        }),
      )}
      <circle cx="50" cy="50" r="2.4" fill="#C9A961" />
      <circle cx="46" cy="44" r="11" fill={`url(#${id}-hi)`} opacity="0.4" />
      <defs>
        <radialGradient id={`${id}-outer`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#EEDDB8" />
          <stop offset="100%" stopColor="#C9A961" />
        </radialGradient>
        <radialGradient id={`${id}-mid`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#F4E8C8" />
          <stop offset="100%" stopColor="#DDC592" />
        </radialGradient>
        <radialGradient id={`${id}-inner`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#F7F1EA" />
          <stop offset="100%" stopColor="#EEDDB8" />
        </radialGradient>
        <radialGradient id={`${id}-core`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F4E8C8" />
        </radialGradient>
        <radialGradient id={`${id}-hi`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Table 3 — Daisy: a ring of elongated ray florets around a gold center disk. Ivory/cream. */
function Daisy({ id }: { id: string }) {
  // 13 ray petals (odd count reads more natural than even) in a single ring
  const count = 13
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i
        return (
          <ellipse
            key={`petal-${i}`}
            cx={50}
            cy={24}
            rx={5.5}
            ry={16}
            fill={`url(#${id}-petal)`}
            transform={`rotate(${angle} 50 50)`}
          />
        )
      })}
      {/* Gold center disk */}
      <circle cx={50} cy={50} r={11} fill={`url(#${id}-center)`} />
      {/* Disk-floret speckle for texture */}
      {Array.from({ length: 12 }, (_, i) => {
        const a = (360 / 12) * i + 8
        const r = 6
        const cx = 50 + r * Math.cos((a * Math.PI) / 180)
        const cy = 50 + r * Math.sin((a * Math.PI) / 180)
        return <circle key={`fleck-${i}`} cx={cx} cy={cy} r="0.9" fill="#7A5A2A" opacity="0.55" />
      })}
      <circle cx="46" cy="46" r="4" fill={`url(#${id}-hi)`} opacity="0.5" />
      <defs>
        <linearGradient id={`${id}-petal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F1E2D0" />
        </linearGradient>
        <radialGradient id={`${id}-center`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#E6C879" />
          <stop offset="100%" stopColor="#A8842F" />
        </radialGradient>
        <radialGradient id={`${id}-hi`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Table 2 — Delphinium: a loose branched spray of spurred open blooms. Periwinkle. */
function Delphinium({ id }: { id: string }) {
  const grad = `url(#${id}-petal)`
  // Each flower dangles from a thin pedicel off the main stem
  const flowers = [
    { ped: "M 50 60 C 44 58, 38 56, 34 52", fx: 34, fy: 52, s: 1.0 },
    { ped: "M 50 50 C 56 48, 62 47, 66 43", fx: 66, fy: 43, s: 1.05 },
    { ped: "M 50 42 C 44 40, 38 38, 35 33", fx: 35, fy: 33, s: 0.95 },
    { ped: "M 50 34 C 56 32, 62 30, 65 25", fx: 65, fy: 25, s: 0.85 },
    { ped: "M 50 26 C 50 22, 50 19, 50 15", fx: 50, fy: 15, s: 0.8 },
  ]
  // Palmate basal leaf
  const palmLeaf =
    "M 0 0 C -10 -3, -14 -10, -12 -16 C -8 -12, -6 -8, -4 -6 C -4 -12, -3 -18, 0 -22 C 3 -18, 4 -12, 4 -6 C 6 -8, 8 -12, 12 -16 C 14 -10, 10 -3, 0 0 Z"
  return (
    <g>
      {/* Main stem with a gentle curve and a branch point */}
      <path
        d="M 50 92 C 50 76, 50 58, 50 26"
        fill="none"
        stroke="#6E7A5E"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
      {/* Pedicels (thin stems to each flower) */}
      {flowers.map((f, i) => (
        <path
          key={`ped-${i}`}
          d={f.ped}
          fill="none"
          stroke="#6E7A5E"
          strokeWidth="1.1"
          strokeLinecap="round"
        />
      ))}
      {/* Palmate leaves */}
      <g transform="translate(50 84) rotate(-28) scale(0.85)">
        <path d={palmLeaf} fill="#9CA88E" opacity="0.85" />
      </g>
      <g transform="translate(50 88) rotate(25) scale(0.7) scale(-1 1)">
        <path d={palmLeaf} fill="#9CA88E" opacity="0.85" />
      </g>
      {/* Open spurred flowers at the end of each pedicel */}
      {flowers.map((f, i) => (
        <g key={`flower-${i}`} transform={`translate(${f.fx} ${f.fy}) scale(${f.s})`}>
          {/* Spur — the signature thin tube pointing up-back */}
          <path
            d="M -1 -3 C -5 -6, -7 -11, -4 -14 C -3 -11, -2 -7, 1 -5 Z"
            fill={grad}
          />
          {/* 5 open petals — wider, more spread than a typical spike bloom */}
          <ellipse cx={-5} cy={-3} rx={3.8} ry={5.5} fill={grad} transform="rotate(-45 -5 -3)" />
          <ellipse cx={5} cy={-3} rx={3.8} ry={5.5} fill={grad} transform="rotate(45 5 -3)" />
          <ellipse cx={-6} cy={3} rx={3.8} ry={5.5} fill={grad} transform="rotate(-100 -6 3)" />
          <ellipse cx={6} cy={3} rx={3.8} ry={5.5} fill={grad} transform="rotate(100 6 3)" />
          <ellipse cx={0} cy={6} rx={4} ry={5.5} fill={grad} />
          {/* Prominent white center — the soft decorative look */}
          <circle cx={0} cy={0} r={2.6} fill="#FFFFFF" opacity="0.9" />
          <circle cx={0} cy={-0.5} r={1.2} fill="#6B7AC4" />
        </g>
      ))}
      <defs>
        <radialGradient id={`${id}-petal`} cx="50%" cy="35%" r="80%">
          <stop offset="0%" stopColor="#A8B2E6" />
          <stop offset="100%" stopColor="#6B7AC4" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Table 5 — Lotus: minimal stylized 8-petal bloom, two-tone pink with gold center. */
function Lotus({ id }: { id: string }) {
  const grad = `url(#${id}-petal)`
  const innerGrad = `url(#${id}-inner)`
  const petal = (L: number, W: number) =>
    `M 50 50 C ${50 - W} ${50 - L * 0.4}, ${50 - W} ${50 - L * 0.8}, 50 ${50 - L} C ${50 + W} ${50 - L * 0.8}, ${50 + W} ${50 - L * 0.4}, 50 50 Z`
  const outer = Array.from({ length: 8 }, (_, i) => (360 / 8) * i)
  const inner = Array.from({ length: 4 }, (_, i) => (360 / 4) * i + 22.5)
  return (
    <g>
      {outer.map((a) => (
        <path key={`o-${a}`} d={petal(40, 11)} fill={grad} transform={`rotate(${a} 50 50)`} />
      ))}
      {inner.map((a) => (
        <path key={`i-${a}`} d={petal(22, 8)} fill={innerGrad} transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="4.5" fill="#E6C879" />
      <circle cx="50" cy="50" r="2.2" fill="#C9A961" />
      <defs>
        <linearGradient id={`${id}-petal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFE4EC" />
          <stop offset="100%" stopColor="#E89AAD" />
        </linearGradient>
        <linearGradient id={`${id}-inner`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF4F8" />
          <stop offset="100%" stopColor="#F4B8C8" />
        </linearGradient>
      </defs>
    </g>
  )
}

/** Table 6 — Sweet Pea: upright bilobed standard + wings + keel. Sage/ivory. */
function SweetPea({ id }: { id: string }) {
  // Standard — upright broad petal, notched (bilobed) at the top
  const standard = [
    "M 50 50",
    "C 32 38, 30 22, 36 14",
    "C 40 18, 44 14, 50 12",
    "C 56 14, 60 18, 64 14",
    "C 70 22, 68 38, 50 50 Z",
  ].join(" ")
  // Wings — two side petals
  const leftWing = "M 50 48 C 38 50, 26 60, 22 76 C 30 78, 44 68, 50 56 Z"
  const rightWing = "M 50 48 C 62 50, 74 60, 78 76 C 70 78, 56 68, 50 56 Z"
  // Keel — lower petal, peeking out between the wings
  const keel = "M 50 50 C 44 60, 44 74, 50 86 C 56 74, 56 60, 50 50 Z"
  return (
    <g>
      <path d={keel} fill={`url(#${id}-keel)`} />
      <path d={leftWing} fill={`url(#${id}-wing)`} />
      <path d={rightWing} fill={`url(#${id}-wing)`} />
      <path d={standard} fill={`url(#${id}-standard)`} />
      <circle cx="50" cy="48" r="2.4" fill="#C9A961" />
      <defs>
        <linearGradient id={`${id}-standard`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F7F1EA" />
          <stop offset="100%" stopColor="#DDC592" />
        </linearGradient>
        <linearGradient id={`${id}-wing`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EEDDB8" />
          <stop offset="100%" stopColor="#9CA88E" />
        </linearGradient>
        <linearGradient id={`${id}-keel`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C2CCB6" />
          <stop offset="100%" stopColor="#9CA88E" />
        </linearGradient>
      </defs>
    </g>
  )
}

function renderFlower(kind: FlowerKind, id: string) {
  switch (kind) {
    case "peony":
      return <Peony id={id} />
    case "ranunculus":
      return <Ranunculus id={id} />
    case "daisy":
      return <Daisy id={id} />
    case "delphinium":
      return <Delphinium id={id} />
    case "lotus":
      return <Lotus id={id} />
    case "sweetpea":
      return <SweetPea id={id} />
    default:
      return <Peony id={id} />
  }
}

/* -------------------------------------------------------------------------- */
/* Public component                                                            */
/* -------------------------------------------------------------------------- */

export interface TableFlowerProps {
  table: number
  className?: string
  /**
   * When true, the SVG is hidden from assistive tech (use next to a visible
   * text label). When false, it gets role="img" and an aria-label like
   * "Peony, table 1".
   */
  decorative?: boolean
  /** Override the auto-generated aria-label. Only used when decorative=false. */
  "aria-label"?: string
}

export function TableFlower({
  table,
  className,
  decorative = false,
  ...rest
}: TableFlowerProps) {
  const kind = flowerForTable(table)
  const id = useSafeId()
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : {
        role: "img" as const,
        "aria-label":
          (rest["aria-label"] as string | undefined) ??
          `${FLOWER_NAMES[kind]}, table ${table}`,
      }

  return (
    <svg viewBox="0 0 100 100" className={className} {...a11y}>
      {renderFlower(kind, id)}
    </svg>
  )
}
