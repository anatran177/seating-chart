import { useId } from "react"

/* -------------------------------------------------------------------------- */
/* Mapping — single source of truth for "table → flower".                     */
/* Tables not listed here fall back to DEFAULT_KIND so new tables keep working.*/
/* -------------------------------------------------------------------------- */

export type FlowerKind =
  | "peony"
  | "delphinium"
  | "daisy"
  | "ranunculus"
  | "lotus"
  | "sweetpea"
  | "tulip"
  | "sunflower"
  | "lavender"
  | "anemone"
  | "hydrangea"
  | "iris"
  | "poppy"
  | "sakura"
  | "daffodil"
  | "camellia"
  | "lily_calla"
  | "lily_stargazer"
  | "lily_tiger"
  | "orchid_moth"
  | "orchid_cattleya"
  | "orchid_slipper"

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
  tulip: "Tulip",
  sunflower: "Sunflower",
  lavender: "Lavender",
  anemone: "Anemone",
  hydrangea: "Hydrangea",
  iris: "Iris",
  poppy: "Poppy",
  sakura: "Cherry Blossom",
  daffodil: "Daffodil",
  camellia: "Camellia",
  lily_calla: "Calla Lily",
  lily_stargazer: "Stargazer Lily",
  lily_tiger: "Tiger Lily",
  orchid_moth: "Moth Orchid",
  orchid_cattleya: "Cattleya Orchid",
  orchid_slipper: "Slipper Orchid",
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

/** Candidate bloom — Tulip: cupped three-lobed silhouette with stem and leaf. Coral. */
function Tulip({ id }: { id: string }) {
  const baseY = 68
  const left = `M 50 ${baseY} C 32 ${baseY - 4}, 28 40, 36 22 C 42 30, 47 44, 50 ${baseY} Z`
  const right = `M 50 ${baseY} C 68 ${baseY - 4}, 72 40, 64 22 C 58 30, 53 44, 50 ${baseY} Z`
  const center = `M 50 ${baseY + 2} C 40 ${baseY - 2}, 38 42, 44 20 C 47 30, 49 42, 50 54 C 51 42, 53 30, 56 20 C 62 42, 60 ${baseY - 2}, 50 ${baseY + 2} Z`
  return (
    <g>
      <path d={left} fill={`url(#${id}-side)`} />
      <path d={right} fill={`url(#${id}-side)`} />
      <path d={center} fill={`url(#${id}-front)`} />
      <path d={`M 50 ${baseY} C 50 ${baseY + 10}, 50 ${baseY + 20}, 50 96`} fill="none" stroke="#7A8C6E" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M 50 86 C 40 82, 32 74, 30 62 C 38 70, 45 79, 50 86 Z" fill="#9CA88E" />
      <path d="M 50 90 C 60 86, 66 78, 66 66 C 60 74, 53 82, 50 90 Z" fill="#9CA88E" opacity="0.85" />
      <ellipse cx="44" cy="34" rx="4.5" ry="9" fill="#ffffff" opacity="0.18" transform="rotate(-18 44 34)" />
      <defs>
        <linearGradient id={`${id}-front`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFB59E" />
          <stop offset="100%" stopColor="#E07A5F" />
        </linearGradient>
        <linearGradient id={`${id}-side`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E89379" />
          <stop offset="100%" stopColor="#C5634A" />
        </linearGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Sunflower: two offset rings of narrow ray petals around a seeded disk. Gold. */
function Sunflower({ id }: { id: string }) {
  const pathFor = (len: number, w: number) => {
    const tipY = 50 - len
    return [
      "M 50 50",
      `C ${50 - w} ${50 - len * 0.4}, ${50 - w * 0.5} ${tipY + 3}, 50 ${tipY}`,
      `C ${50 + w * 0.5} ${tipY + 3}, ${50 + w} ${50 - len * 0.4}, 50 50 Z`,
    ].join(" ")
  }
  const rings = [
    { count: 16, len: 38, w: 6, opacity: 0.92, offset: 0 },
    { count: 16, len: 33, w: 5.5, opacity: 0.85, offset: 11.25 },
  ]
  return (
    <g>
      {rings.map((r) =>
        Array.from({ length: r.count }, (_, i) => {
          const angle = r.offset + (360 / r.count) * i
          return (
            <path
              key={`ring-${r.count}-${i}`}
              d={pathFor(r.len, r.w)}
              fill={`url(#${id}-petal)`}
              opacity={r.opacity}
              transform={`rotate(${angle} 50 50)`}
            />
          )
        }),
      )}
      <circle cx="50" cy="50" r="13" fill={`url(#${id}-center)`} />
      {Array.from({ length: 18 }, (_, i) => {
        const a = (360 / 18) * i
        const r = 8
        const cx = 50 + r * Math.cos((a * Math.PI) / 180)
        const cy = 50 + r * Math.sin((a * Math.PI) / 180)
        return <circle key={`seed-${i}`} cx={cx} cy={cy} r="1.1" fill="#5A3A1E" opacity="0.5" />
      })}
      {Array.from({ length: 10 }, (_, i) => {
        const a = (360 / 10) * i + 13
        const r = 4
        const cx = 50 + r * Math.cos((a * Math.PI) / 180)
        const cy = 50 + r * Math.sin((a * Math.PI) / 180)
        return <circle key={`seed2-${i}`} cx={cx} cy={cy} r="0.9" fill="#5A3A1E" opacity="0.5" />
      })}
      <circle cx="46" cy="46" r="5" fill={`url(#${id}-hi)`} opacity="0.4" />
      <defs>
        <linearGradient id={`${id}-petal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F6D247" />
          <stop offset="100%" stopColor="#E0A82E" />
        </linearGradient>
        <radialGradient id={`${id}-center`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#8B5A2B" />
          <stop offset="100%" stopColor="#5A3A1E" />
        </radialGradient>
        <radialGradient id={`${id}-hi`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Lavender: a slender spike of tiny starry bud whorls. Violet. */
function Lavender({ id }: { id: string }) {
  const tiers = [
    { y: 24, s: 1.0 },
    { y: 33, s: 1.05 },
    { y: 42, s: 1.0 },
    { y: 51, s: 0.95 },
    { y: 60, s: 0.82 },
    { y: 67, s: 0.65 },
  ]
  const bud = (cx: number, cy: number, s: number) => (
    <g transform={`translate(${cx} ${cy}) scale(${s})`}>
      {Array.from({ length: 5 }, (_, i) => {
        const a = (360 / 5) * i - 90
        return (
          <ellipse
            key={i}
            cx={0}
            cy={-3}
            rx={1.8}
            ry={3.2}
            fill={`url(#${id}-bud)`}
            transform={`rotate(${a})`}
          />
        )
      })}
      <circle cx={0} cy={0} r={1.4} fill="#6B4A8C" />
    </g>
  )
  return (
    <g>
      <path d="M 50 90 C 50 78, 50 64, 50 24" fill="none" stroke="#8AA07A" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M 50 80 C 42 78, 36 72, 34 64 C 40 70, 46 76, 50 80 Z" fill="#9CA88E" />
      <path d="M 50 84 C 58 82, 64 76, 66 68 C 60 74, 54 80, 50 84 Z" fill="#9CA88E" />
      {tiers.map((t, i) => (
        <g key={`tier-${i}`}>{bud(50, t.y, t.s)}</g>
      ))}
      <defs>
        <radialGradient id={`${id}-bud`} cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#B89AD6" />
          <stop offset="100%" stopColor="#7A5AA8" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Anemone: a ring of soft petals around a dark, fuzzy center. Violet-white. */
function Anemone({ id }: { id: string }) {
  const count = 8
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i
        return (
          <ellipse
            key={`petal-${i}`}
            cx={50}
            cy={20}
            rx={7}
            ry={20}
            fill={`url(#${id}-petal)`}
            transform={`rotate(${angle} 50 50)`}
          />
        )
      })}
      <circle cx="50" cy="50" r="11" fill={`url(#${id}-center)`} />
      {Array.from({ length: 16 }, (_, i) => {
        const a = (360 / 16) * i
        const r = 8.5
        const cx = 50 + r * Math.cos((a * Math.PI) / 180)
        const cy = 50 + r * Math.sin((a * Math.PI) / 180)
        return <circle key={`fuzz-${i}`} cx={cx} cy={cy} r="1.3" fill="#2A1A35" />
      })}
      <circle cx="50" cy="50" r="5" fill="#1E1228" />
      <circle cx="47" cy="47" r="4" fill={`url(#${id}-hi)`} opacity="0.35" />
      <defs>
        <linearGradient id={`${id}-petal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F4ECF4" />
          <stop offset="100%" stopColor="#C9B6D8" />
        </linearGradient>
        <radialGradient id={`${id}-center`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#4A2E5A" />
          <stop offset="100%" stopColor="#1E1228" />
        </radialGradient>
        <radialGradient id={`${id}-hi`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Hydrangea: a packed dome of small four-petal florets. Soft blue. */
function Hydrangea({ id }: { id: string }) {
  const florets = [
    { x: 50, y: 36, s: 1.0 },
    { x: 38, y: 44, s: 0.95 },
    { x: 62, y: 44, s: 0.95 },
    { x: 50, y: 50, s: 1.05 },
    { x: 43, y: 57, s: 1.0 },
    { x: 57, y: 57, s: 1.0 },
    { x: 41, y: 65, s: 0.82 },
    { x: 59, y: 65, s: 0.82 },
    { x: 50, y: 64, s: 0.85 },
  ]
  const floret = (cx: number, cy: number, s: number, key: string) => (
    <g key={key} transform={`translate(${cx} ${cy}) scale(${s})`}>
      <ellipse cx={0} cy={-3.6} rx={3.2} ry={4.2} fill={`url(#${id}-petal)`} />
      <ellipse cx={0} cy={3.6} rx={3.2} ry={4.2} fill={`url(#${id}-petal)`} />
      <ellipse cx={-3.6} cy={0} rx={4.2} ry={3.2} fill={`url(#${id}-petal)`} />
      <ellipse cx={3.6} cy={0} rx={4.2} ry={3.2} fill={`url(#${id}-petal)`} />
      <circle cx={0} cy={0} r={1.4} fill="#5A7A98" />
    </g>
  )
  return (
    <g>
      {florets.map((f, i) => floret(f.x, f.y, f.s, `f-${i}`))}
      <defs>
        <radialGradient id={`${id}-petal`} cx="50%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#D4E2EE" />
          <stop offset="100%" stopColor="#7A9AB5" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Iris: upright standards behind three drooping falls with gold beards. Violet. */
function Iris({ id }: { id: string }) {
  const fallPath = (L: number, W: number) =>
    [
      "M 50 50",
      `C ${50 - W} 52, ${50 - W} ${50 + L * 0.5}, ${50 - W * 0.5} ${50 + L}`,
      `C 50 ${50 + L + 4}, ${50 + W * 0.5} ${50 + L * 0.5}, ${50 + W} 52`,
      "Z",
    ].join(" ")
  const standardPath = (L: number, W: number) =>
    [
      "M 50 50",
      `C ${50 - W} 48, ${50 - W} ${50 - L * 0.5}, 50 ${50 - L}`,
      `C ${50 + W} ${50 - L * 0.5}, ${50 + W} 48, 50 50 Z`,
    ].join(" ")
  const falls = [
    { angle: 30, len: 30, w: 12 },
    { angle: 150, len: 30, w: 12 },
    { angle: 270, len: 30, w: 12 },
  ]
  const standards = [
    { angle: 90, len: 26, w: 7 },
    { angle: 210, len: 26, w: 7 },
    { angle: 330, len: 26, w: 7 },
  ]
  return (
    <g>
      {standards.map((s) => (
        <path
          key={`std-${s.angle}`}
          d={standardPath(s.len, s.w)}
          fill={`url(#${id}-standard)`}
          transform={`rotate(${s.angle} 50 50)`}
        />
      ))}
      {falls.map((f) => (
        <g key={`fall-${f.angle}`} transform={`rotate(${f.angle} 50 50)`}>
          <path d={fallPath(f.len, f.w)} fill={`url(#${id}-fall)`} />
          <path
            d={`M 50 52 C 50 62, 50 70, 50 ${50 + f.len * 0.72}`}
            fill="none"
            stroke="#E6C879"
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.85"
          />
        </g>
      ))}
      <circle cx="50" cy="50" r="3" fill="#3A2452" />
      <defs>
        <radialGradient id={`${id}-fall`} cx="50%" cy="25%" r="85%">
          <stop offset="0%" stopColor="#9C7BC4" />
          <stop offset="100%" stopColor="#4A2E6E" />
        </radialGradient>
        <linearGradient id={`${id}-standard`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7A5AA8" />
          <stop offset="100%" stopColor="#3A2452" />
        </linearGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Poppy: broad crinkled petals with dark basal blotch around a seed capsule. Crimson. */
function Poppy({ id }: { id: string }) {
  const count = 5
  const petal =
    "M 50 50 C 40 44, 32 34, 34 18 C 42 22, 48 28, 50 32 C 52 28, 58 22, 66 18 C 68 34, 60 44, 50 50 Z"
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i
        return (
          <g key={`petal-${i}`} transform={`rotate(${angle} 50 50)`}>
            <path d={petal} fill={`url(#${id}-petal)`} />
            <ellipse cx="50" cy="40" rx="6" ry="9" fill="#5A1020" opacity="0.32" />
          </g>
        )
      })}
      <circle cx="50" cy="50" r="6" fill="#1E1020" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (360 / 12) * i
        const r = 7
        const cx = 50 + r * Math.cos((a * Math.PI) / 180)
        const cy = 50 + r * Math.sin((a * Math.PI) / 180)
        return <circle key={`stamen-${i}`} cx={cx} cy={cy} r="1.1" fill="#2A1A2A" />
      })}
      <circle cx="47" cy="47" r="5" fill={`url(#${id}-hi)`} opacity="0.3" />
      <defs>
        <radialGradient id={`${id}-petal`} cx="50%" cy="80%" r="85%">
          <stop offset="0%" stopColor="#FF6B5E" />
          <stop offset="100%" stopColor="#D32E3A" />
        </radialGradient>
        <radialGradient id={`${id}-hi`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Cherry Blossom: five notched petals with a stamen ring. Blush pink. */
function Sakura({ id }: { id: string }) {
  const count = 5
  const petal = [
    "M 50 50",
    "C 39 43, 34 28, 40 12",
    "C 44 15, 47 14, 47 14",
    "L 50 18",
    "L 53 14",
    "C 53 14, 56 15, 60 12",
    "C 66 28, 61 43, 50 50 Z",
  ].join(" ")
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i
        return (
          <path
            key={`petal-${i}`}
            d={petal}
            fill={`url(#${id}-petal)`}
            transform={`rotate(${angle} 50 50)`}
          />
        )
      })}
      {Array.from({ length: 14 }, (_, i) => {
        const a = (360 / 14) * i
        const r = 7
        const cx = 50 + r * Math.cos((a * Math.PI) / 180)
        const cy = 50 + r * Math.sin((a * Math.PI) / 180)
        return <circle key={`stamen-${i}`} cx={cx} cy={cy} r="1.1" fill="#E6A061" />
      })}
      <circle cx="50" cy="50" r="3" fill="#D98AA0" />
      <circle cx="46" cy="46" r="4" fill={`url(#${id}-hi)`} opacity="0.3" />
      <defs>
        <radialGradient id={`${id}-petal`} cx="50%" cy="80%" r="85%">
          <stop offset="0%" stopColor="#FFE0EA" />
          <stop offset="100%" stopColor="#F4A8C0" />
        </radialGradient>
        <radialGradient id={`${id}-hi`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Daffodil: six-petal skirt with a flared trumpet coronet. Gold. */
function Daffodil({ id }: { id: string }) {
  const count = 6
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i
        return (
          <ellipse
            key={`petal-${i}`}
            cx={50}
            cy={24}
            rx={9}
            ry={18}
            fill={`url(#${id}-petal)`}
            transform={`rotate(${angle} 50 50)`}
          />
        )
      })}
      <path
        d="M 36 52 C 36 38, 42 30, 50 30 C 58 30, 64 38, 64 52 C 62 58, 56 62, 50 62 C 44 62, 38 58, 36 52 Z"
        fill={`url(#${id}-trumpet)`}
      />
      <ellipse cx="50" cy="50" rx="11" ry="6" fill="#B8862A" opacity="0.45" />
      <ellipse cx="48" cy="47" rx="4" ry="2.5" fill="#ffffff" opacity="0.3" />
      <defs>
        <linearGradient id={`${id}-petal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF1B8" />
          <stop offset="100%" stopColor="#F0CF5E" />
        </linearGradient>
        <radialGradient id={`${id}-trumpet`} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#F2B53C" />
          <stop offset="100%" stopColor="#C88820" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Camellia: dense rounded overlapping petal rings. Rose-red. */
function Camellia({ id }: { id: string }) {
  const pathFor = (len: number, w: number) => {
    const tipY = 50 - len
    return [
      "M 50 50",
      `C ${50 - w} ${50 - len * 0.3}, ${50 - w * 0.7} ${tipY + 3}, 50 ${tipY}`,
      `C ${50 + w * 0.7} ${tipY + 3}, ${50 + w} ${50 - len * 0.3}, 50 50 Z`,
    ].join(" ")
  }
  const rings = [
    { count: 7, len: 38, w: 16, opacity: 0.72, offset: 0 },
    { count: 7, len: 38, w: 16, opacity: 0.72, offset: 25.7 },
    { count: 6, len: 27, w: 13, opacity: 0.88, offset: 15 },
    { count: 5, len: 17, w: 9, opacity: 1, offset: 0 },
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
              fill={`url(#${id}-petal)`}
              opacity={r.opacity}
              transform={`rotate(${angle} 50 50)`}
            />
          )
        }),
      )}
      <circle cx="50" cy="50" r="3.5" fill="#7A1A30" />
      <circle cx="45" cy="43" r="12" fill={`url(#${id}-hi)`} opacity="0.3" />
      <defs>
        <radialGradient id={`${id}-petal`} cx="50%" cy="40%" r="65%">
          <stop offset="0%" stopColor="#E89AAE" />
          <stop offset="100%" stopColor="#B23A56" />
        </radialGradient>
        <radialGradient id={`${id}-hi`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  )
}

/* -------------------------------------------------------------------------- */
/* Lilies — three distinct silhouettes: funnel, open star, recurved.          */
/* -------------------------------------------------------------------------- */

/** Candidate bloom — Calla Lily: a single elegant funnel spathe around a spadix. Ivory. */
function CallaLily({ id }: { id: string }) {
  return (
    <g>
      {/* Spathe — the funnel petal, narrowing to a stem */}
      <path
        d="M 50 92 C 50 92, 48 86, 48 80 C 40 64, 34 42, 42 22 C 46 30, 48 30, 50 30 C 52 30, 54 30, 58 22 C 66 42, 60 64, 52 80 C 52 86, 50 92, 50 92 Z"
        fill={`url(#${id}-spathe)`}
      />
      {/* Rolled margin highlight */}
      <path
        d="M 50 30 C 54 32, 58 30, 58 22 C 56 24, 53 26, 50 26 C 47 26, 44 24, 42 22 C 42 30, 46 32, 50 30 Z"
        fill="#F0E6D4"
      />
      {/* Spadix — the central golden spike */}
      <path d="M 50 78 C 50 60, 50 44, 50 30 C 51 30, 51 60, 50 78 Z" fill={`url(#${id}-spadix)`} />
      <circle cx="50" cy="32" r="1.8" fill="#C9A961" />
      <defs>
        <linearGradient id={`${id}-spathe`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#E8DDC8" />
        </linearGradient>
        <linearGradient id={`${id}-spadix`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F2D247" />
          <stop offset="100%" stopColor="#C9A961" />
        </linearGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Stargazer Lily: open six-pointed star with speckles and long stamens. Pink. */
function StargazerLily({ id }: { id: string }) {
  const count = 6
  const petal =
    "M 50 50 C 40 44, 32 30, 34 14 C 42 20, 48 28, 50 32 C 52 28, 58 20, 66 14 C 68 30, 60 44, 50 50 Z"
  const speckles = [{ x: 46, y: 40 }, { x: 54, y: 40 }, { x: 44, y: 34 }, { x: 56, y: 34 }, { x: 50, y: 44 }]
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i
        return (
          <g key={`petal-${i}`} transform={`rotate(${angle} 50 50)`}>
            <path d={petal} fill={`url(#${id}-petal)`} />
            {speckles.map((p, j) => (
              <circle key={`sp-${i}-${j}`} cx={p.x} cy={p.y} r="0.9" fill="#7A2050" opacity="0.6" />
            ))}
          </g>
        )
      })}
      {/* Long radiating stamens with orange anthers */}
      {Array.from({ length: 6 }, (_, i) => {
        const a = ((360 / 6) * i + 30) * (Math.PI / 180)
        const x2 = 50 + 16 * Math.cos(a)
        const y2 = 50 + 16 * Math.sin(a)
        return (
          <g key={`stamen-${i}`}>
            <line x1="50" y1="50" x2={x2} y2={y2} stroke="#E8DDC8" strokeWidth="1" strokeLinecap="round" />
            <ellipse cx={x2} cy={y2} rx="1.6" ry="2.4" fill="#D9602A" />
          </g>
        )
      })}
      <circle cx="50" cy="50" r="3.5" fill="#7A2050" />
      <defs>
        <radialGradient id={`${id}-petal`} cx="50%" cy="85%" r="80%">
          <stop offset="0%" stopColor="#F2B8C8" />
          <stop offset="60%" stopColor="#E89AAD" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Tiger Lily: six strongly recurved spotted petals. Orange. */
function TigerLily({ id }: { id: string }) {
  const count = 6
  // Reflexed petal — base at center, sweeping up and curling back at the tip
  const petal =
    "M 50 50 C 46 40, 40 28, 42 14 C 46 22, 48 26, 50 24 C 52 26, 54 22, 58 14 C 60 28, 54 40, 50 50 Z"
  const speckles = [{ x: 48, y: 38 }, { x: 52, y: 38 }, { x: 46, y: 32 }, { x: 54, y: 32 }, { x: 50, y: 44 }]
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i
        return (
          <g key={`petal-${i}`} transform={`rotate(${angle} 50 50)`}>
            <path d={petal} fill={`url(#${id}-petal)`} />
            {speckles.map((p, j) => (
              <circle key={`sp-${i}-${j}`} cx={p.x} cy={p.y} r="0.9" fill="#5A1020" opacity="0.65" />
            ))}
          </g>
        )
      })}
      {Array.from({ length: 6 }, (_, i) => {
        const a = ((360 / 6) * i + 30) * (Math.PI / 180)
        const x2 = 50 + 18 * Math.cos(a)
        const y2 = 50 + 18 * Math.sin(a)
        return (
          <g key={`stamen-${i}`}>
            <line x1="50" y1="50" x2={x2} y2={y2} stroke="#3A1010" strokeWidth="1" strokeLinecap="round" />
            <ellipse cx={x2} cy={y2} rx="1.4" ry="2.2" fill="#5A1020" />
          </g>
        )
      })}
      <circle cx="50" cy="50" r="3.5" fill="#5A1020" />
      <defs>
        <radialGradient id={`${id}-petal`} cx="50%" cy="80%" r="80%">
          <stop offset="0%" stopColor="#F29030" />
          <stop offset="100%" stopColor="#D45A14" />
        </radialGradient>
      </defs>
    </g>
  )
}

/* -------------------------------------------------------------------------- */
/* Orchids — three distinct forms: round moth, showy cattleya, pouch slipper. */
/* -------------------------------------------------------------------------- */

/** Candidate bloom — Moth Orchid: five broad round petals with a lobed lip. Lilac. */
function MothOrchid({ id }: { id: string }) {
  const count = 5
  const petal = "M 50 50 C 40 42, 38 26, 50 14 C 62 26, 60 42, 50 50 Z"
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i
        return (
          <path
            key={`petal-${i}`}
            d={petal}
            fill={`url(#${id}-petal)`}
            transform={`rotate(${angle} 50 50)`}
          />
        )
      })}
      {/* Three-lobed lip at the bottom */}
      <path
        d="M 44 50 C 38 56, 38 68, 44 74 C 46 78, 54 78, 56 74 C 62 68, 62 56, 56 50 Z"
        fill={`url(#${id}-lip)`}
      />
      <circle cx="50" cy="52" r="2.5" fill="#6B4A8C" />
      <defs>
        <radialGradient id={`${id}-petal`} cx="50%" cy="70%" r="80%">
          <stop offset="0%" stopColor="#F0E0F0" />
          <stop offset="100%" stopColor="#C9A0D4" />
        </radialGradient>
        <radialGradient id={`${id}-lip`} cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#D98AB8" />
          <stop offset="100%" stopColor="#8A4A78" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Cattleya Orchid: narrow pointed petals with a large ruffled lip. Lavender. */
function CattleyaOrchid({ id }: { id: string }) {
  const count = 5
  const petal = "M 50 50 C 46 38, 45 22, 50 8 C 55 22, 54 38, 50 50 Z"
  return (
    <g>
      {Array.from({ length: count }, (_, i) => {
        const angle = (360 / count) * i
        return (
          <path
            key={`petal-${i}`}
            d={petal}
            fill={`url(#${id}-petal)`}
            transform={`rotate(${angle} 50 50)`}
          />
        )
      })}
      {/* Showy ruffled lip */}
      <path
        d="M 50 50 C 36 54, 30 64, 34 76 C 37 82, 42 84, 44 80 C 43 85, 47 87, 50 84 C 53 87, 57 85, 56 80 C 58 84, 63 82, 66 76 C 70 64, 64 54, 50 50 Z"
        fill={`url(#${id}-lip)`}
      />
      {/* Yellow throat */}
      <ellipse cx="50" cy="64" rx="5" ry="7" fill="#F2D247" opacity="0.7" />
      <circle cx="50" cy="50" r="2.5" fill="#5A2A5A" />
      <defs>
        <linearGradient id={`${id}-petal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4B6DC" />
          <stop offset="100%" stopColor="#9C6AB4" />
        </linearGradient>
        <radialGradient id={`${id}-lip`} cx="50%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#C4609A" />
          <stop offset="100%" stopColor="#7A2A6A" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Candidate bloom — Slipper Orchid: a striped dorsal petal over a bulbous pouch. Bronze. */
function SlipperOrchid({ id }: { id: string }) {
  return (
    <g>
      {/* Dorsal petal — large rounded top */}
      <path d="M 50 48 C 36 44, 34 24, 50 14 C 66 24, 64 44, 50 48 Z" fill={`url(#${id}-dorsal)`} />
      {/* Vertical stripes on the dorsal */}
      <path d="M 50 14 L 50 46" stroke="#7A4A20" strokeWidth="0.8" opacity="0.4" />
      <path d="M 44 18 C 42 28, 42 38, 46 45" stroke="#7A4A20" strokeWidth="0.7" opacity="0.4" fill="none" />
      <path d="M 56 18 C 58 28, 58 38, 54 45" stroke="#7A4A20" strokeWidth="0.7" opacity="0.4" fill="none" />
      {/* Hanging side petals */}
      <path d="M 50 48 C 38 54, 30 66, 32 80 C 40 72, 46 60, 50 50 Z" fill={`url(#${id}-petal)`} />
      <path d="M 50 48 C 62 54, 70 66, 68 80 C 60 72, 54 60, 50 50 Z" fill={`url(#${id}-petal)`} />
      {/* The pouch (slipper) */}
      <path
        d="M 42 50 C 36 58, 34 72, 42 82 C 46 88, 54 88, 58 82 C 66 72, 64 58, 58 50 C 54 54, 46 54, 42 50 Z"
        fill={`url(#${id}-pouch)`}
      />
      <ellipse cx="50" cy="52" rx="7" ry="3" fill="#5A2A20" opacity="0.45" />
      <circle cx="50" cy="50" r="2" fill="#C9A961" />
      <defs>
        <linearGradient id={`${id}-dorsal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E8C46A" />
          <stop offset="100%" stopColor="#C88820" />
        </linearGradient>
        <linearGradient id={`${id}-petal`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4A05A" />
          <stop offset="100%" stopColor="#9C6A2A" />
        </linearGradient>
        <radialGradient id={`${id}-pouch`} cx="50%" cy="40%" r="75%">
          <stop offset="0%" stopColor="#C4703A" />
          <stop offset="100%" stopColor="#7A3A1A" />
        </radialGradient>
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
    case "tulip":
      return <Tulip id={id} />
    case "sunflower":
      return <Sunflower id={id} />
    case "lavender":
      return <Lavender id={id} />
    case "anemone":
      return <Anemone id={id} />
    case "hydrangea":
      return <Hydrangea id={id} />
    case "iris":
      return <Iris id={id} />
    case "poppy":
      return <Poppy id={id} />
    case "sakura":
      return <Sakura id={id} />
    case "daffodil":
      return <Daffodil id={id} />
    case "camellia":
      return <Camellia id={id} />
    case "lily_calla":
      return <CallaLily id={id} />
    case "lily_stargazer":
      return <StargazerLily id={id} />
    case "lily_tiger":
      return <TigerLily id={id} />
    case "orchid_moth":
      return <MothOrchid id={id} />
    case "orchid_cattleya":
      return <CattleyaOrchid id={id} />
    case "orchid_slipper":
      return <SlipperOrchid id={id} />
    default:
      return <Peony id={id} />
  }
}

/** Candidate blooms surfaced for selection on the main page. */
export const CANDIDATE_FLOWERS: { kind: FlowerKind; name: string }[] = [
  { kind: "tulip", name: "Tulip" },
  { kind: "sunflower", name: "Sunflower" },
  { kind: "lavender", name: "Lavender" },
  { kind: "anemone", name: "Anemone" },
  { kind: "hydrangea", name: "Hydrangea" },
  { kind: "iris", name: "Iris" },
  { kind: "poppy", name: "Poppy" },
  { kind: "sakura", name: "Cherry Blossom" },
  { kind: "daffodil", name: "Daffodil" },
  { kind: "camellia", name: "Camellia" },
  { kind: "lily_calla", name: "Calla Lily" },
  { kind: "lily_stargazer", name: "Stargazer Lily" },
  { kind: "lily_tiger", name: "Tiger Lily" },
  { kind: "orchid_moth", name: "Moth Orchid" },
  { kind: "orchid_cattleya", name: "Cattleya Orchid" },
  { kind: "orchid_slipper", name: "Slipper Orchid" },
]

export interface FlowerProps {
  kind: FlowerKind
  className?: string
  decorative?: boolean
  "aria-label"?: string
}

/** Render a specific flower kind directly, independent of the table mapping. */
export function Flower({ kind, className, decorative = false, ...rest }: FlowerProps) {
  const id = useSafeId()
  const a11y = decorative
    ? { "aria-hidden": true as const }
    : {
        role: "img" as const,
        "aria-label":
          (rest["aria-label"] as string | undefined) ?? FLOWER_NAMES[kind],
      }

  return (
    <svg viewBox="0 0 100 100" className={className} {...a11y}>
      {renderFlower(kind, id)}
    </svg>
  )
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
