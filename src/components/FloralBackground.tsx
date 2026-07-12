import { useId, useMemo } from "react"
import { motion, useReducedMotion } from "framer-motion"

type FloralColor = "plum" | "rose" | "blush" | "gold" | "gold-soft" | "sage"

const COLOR_HEX: Record<FloralColor, string> = {
  plum: "#7A4A60",
  rose: "#B5798A",
  blush: "#E3B8C4",
  gold: "#C9A961",
  "gold-soft": "#DDC592",
  sage: "#9CA88E",
}

/** Two-stop (light tip -> deep base) gradients used by the falling petals. */
const PETAL_GRADIENTS: Record<FloralColor, [string, string]> = {
  plum: ["#9A6478", "#5F3248"],
  rose: ["#E3B8C4", "#B5798A"],
  blush: ["#F4D8E0", "#E3B8C4"],
  gold: ["#E6D2A0", "#C9A961"],
  "gold-soft": ["#EEDDB8", "#DDC592"],
  sage: ["#C2CCB6", "#9CA88E"],
}

/** useId() returns strings with colons; sanitize for use inside SVG url(#...) refs. */
function useSafeId(): string {
  return useId().replace(/[^a-zA-Z0-9_-]/g, "")
}

/* -------------------------------------------------------------------------- */
/* Peony bloom                                                                */
/* -------------------------------------------------------------------------- */

/** A single notched, ruffled petal path drawn upward from the bloom center (50,50). */
function peonyPetalPath(len: number, w: number, notch: number): string {
  const tipY = 50 - len
  const sideY = 50 - len * 0.4
  return [
    "M 50 50",
    `C ${50 - w} ${sideY}, ${50 - w} ${tipY + 4}, ${50 - notch} ${tipY}`,
    `C ${50 - notch * 0.3} ${tipY + 3.5}, ${50 + notch * 0.3} ${tipY + 3.5}, ${50 + notch} ${tipY}`,
    `C ${50 + w} ${tipY + 4}, ${50 + w} ${sideY}, 50 50 Z`,
  ].join(" ")
}

interface RingProps {
  count: number
  len: number
  w: number
  notch: number
  opacity: number
  offset: number
}

function PetalRing({ count, len, w, notch, opacity, offset }: RingProps) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const angle = offset + (360 / count) * i
        return (
          <path
            key={`${count}-${offset}-${i}`}
            d={peonyPetalPath(len, w, notch)}
            fill="currentColor"
            opacity={opacity}
            transform={`rotate(${angle} 50 50)`}
          />
        )
      })}
    </>
  )
}

/** The drawable peony (a <g>), usable inside other SVGs or wrapped by <Peony>. */
function PeonyBloom({ color = "rose" }: { color?: FloralColor }) {
  const id = useSafeId()
  const center = COLOR_HEX[color]
  return (
    <g style={{ color: center }}>
      {/* Outer ruff — two offset layers for fullness */}
      <PetalRing count={8} len={36} w={13} notch={4} opacity={0.5} offset={0} />
      <PetalRing count={8} len={36} w={13} notch={4} opacity={0.5} offset={22.5} />
      {/* Middle layer */}
      <PetalRing count={7} len={26} w={11} notch={3} opacity={0.78} offset={15} />
      {/* Inner crown */}
      <PetalRing count={6} len={16} w={8} notch={2} opacity={1} offset={0} />

      {/* Center stamens */}
      <g>
        {Array.from({ length: 6 }, (_, i) => {
          const a = (360 / 6) * i
          const r = 5
          const cx = 50 + r * Math.cos((a * Math.PI) / 180)
          const cy = 50 + r * Math.sin((a * Math.PI) / 180)
          return <circle key={i} cx={cx} cy={cy} r="1.8" fill="#C9A961" />
        })}
        <circle cx="50" cy="50" r="3" fill={center} />
      </g>

      {/* Soft directional highlight */}
      <circle cx="45" cy="43" r="13" fill={`url(#${id}-hi)`} opacity="0.4" />
      <defs>
        <radialGradient id={`${id}-hi`}>
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>
    </g>
  )
}

/** Standalone peony (full SVG) for direct placement in the background. */
function Peony({
  color = "rose",
  className,
}: {
  color?: FloralColor
  className?: string
}) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <PeonyBloom color={color} />
    </svg>
  )
}

/** A slender leaf. */
function Leaf({ color = "sage" }: { color?: FloralColor }) {
  return (
    <path
      d="M0 0 C 18 -6, 40 -6, 60 0 C 40 6, 18 6, 0 0 Z"
      fill={COLOR_HEX[color]}
    />
  )
}

/** A botanical sprig: stem with leaves and a peony bloom at the tip. */
function Sprig({
  bloom = "rose",
  leaf = "sage",
  className,
}: {
  bloom?: FloralColor
  leaf?: FloralColor
  className?: string
}) {
  return (
    <svg viewBox="0 0 120 200" className={className} aria-hidden="true">
      <path
        d="M60 200 C 50 150, 70 110, 60 60"
        fill="none"
        stroke={COLOR_HEX["gold-soft"]}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <g transform="translate(60 150) rotate(35)">
        <Leaf color={leaf} />
      </g>
      <g transform="translate(58 110) rotate(-30)">
        <Leaf color={leaf} />
      </g>
      <svg x="36" y="18" width="48" height="48" viewBox="0 0 100 100">
        <PeonyBloom color={bloom} />
      </svg>
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Falling peony petals                                                       */
/* -------------------------------------------------------------------------- */

/** A broad, notched peony petal with a midrib vein and a soft two-tone fill. */
const PETAL_BODY =
  "M 16 42 C 3 33, 3 15, 11 6 C 13 4, 13 8, 16 8 C 19 8, 19 4, 21 6 C 29 15, 29 33, 16 42 Z"
const PETAL_VEIN = "M 16 40 C 15 30, 15 20, 16 10"

function PetalShape({ color }: { color: FloralColor }) {
  return (
    <svg
      viewBox="0 0 32 44"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      <path d={PETAL_BODY} fill={`url(#petalGrad-${color})`} />
      <path d={PETAL_VEIN} fill="none" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="0.7" />
      <path
        d={PETAL_BODY}
        fill="none"
        stroke="#ffffff"
        strokeOpacity="0.22"
        strokeWidth="0.5"
      />
    </svg>
  )
}

interface PetalConfig {
  id: number
  left: number
  size: number
  duration: number
  delay: number
  drift: number
  rotate: number
  maxOpacity: number
  color: FloralColor
}

const PETAL_COLORS: FloralColor[] = ["blush", "rose", "plum", "gold"]

function usePetalConfigs(count: number): PetalConfig[] {
  return useMemo(
    () =>
      Array.from({ length: count }, (_, id) => {
        const duration = 10 + Math.random() * 10
        return {
          id,
          left: Math.random() * 100,
          size: 22 + Math.random() * 20, // 22–42px (bigger peony petals)
          duration,
          // Negative delay starts each petal mid-fall, so petals are already
          // falling across the screen the moment the page loads.
          delay: -Math.random() * duration,
          drift: (Math.random() * 2 - 1) * 80,
          rotate: (Math.random() * 2 - 1) * 240,
          maxOpacity: 0.5 + Math.random() * 0.4,
          color: PETAL_COLORS[id % PETAL_COLORS.length],
        }
      }),
    [count],
  )
}

function FallingPetals({ configs }: { configs: PetalConfig[] }) {
  return (
    <>
      {configs.map((p) => (
        <motion.span
          key={p.id}
          aria-hidden="true"
          className="absolute block"
          style={{
            left: `${p.left}%`,
            top: "-10%",
            width: p.size,
            height: p.size * 1.3,
          }}
          initial={{ y: "0vh", x: 0, rotate: 0, opacity: 0 }}
          animate={{
            y: ["0vh", "112vh"],
            x: [0, p.drift, p.drift * -0.55, p.drift],
            rotate: [0, p.rotate],
            opacity: [0, p.maxOpacity, p.maxOpacity, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          <PetalShape color={p.color} />
        </motion.span>
      ))}
    </>
  )
}

function StaticPetals({ configs }: { configs: PetalConfig[] }) {
  return (
    <>
      {configs.map((p) => (
        <span
          key={p.id}
          aria-hidden="true"
          className="absolute block"
          style={{
            left: `${p.left}%`,
            top: `${10 + ((p.id * 37) % 80)}%`,
            width: p.size,
            height: p.size * 1.3,
            opacity: p.maxOpacity * 0.85,
            transform: `rotate(${p.rotate}deg)`,
          }}
        >
          <PetalShape color={p.color} />
        </span>
      ))}
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Background                                                                 */
/* -------------------------------------------------------------------------- */

export function FloralBackground() {
  const prefersReduced = useReducedMotion()
  const petals = usePetalConfigs(prefersReduced ? 6 : 14)

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Shared petal gradient definitions (one set, reused by every petal) */}
      <svg width="0" height="0" className="absolute" aria-hidden="true">
        <defs>
          {Object.entries(PETAL_GRADIENTS).map(([color, [light, deep]]) => (
            <linearGradient
              key={color}
              id={`petalGrad-${color}`}
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop offset="0%" stopColor={light} />
              <stop offset="100%" stopColor={deep} />
            </linearGradient>
          ))}
        </defs>
      </svg>

      {/* Vertical wash: ivory -> faint plum */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, #FAF5EF 0%, #F7F1EA 45%, #F1E6DD 100%)",
        }}
      />
      {/* Soft warm glow */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 18%, rgba(201,169,97,0.14), transparent 70%)",
        }}
      />

      {/* Peony clusters bleeding off the edges */}
      <Peony
        color="blush"
        className="absolute -left-20 -top-20 h-80 w-80 opacity-[0.22] sm:h-96 sm:w-96"
      />
      <Peony
        color="rose"
        className="absolute -right-24 top-8 h-64 w-64 opacity-[0.2] sm:h-80 sm:w-80"
      />
      <Peony
        color="plum"
        className="absolute -bottom-28 -right-20 h-96 w-96 opacity-[0.22] sm:h-[30rem] sm:w-[30rem]"
      />
      <Peony
        color="rose"
        className="absolute -bottom-24 -left-24 h-72 w-72 opacity-[0.18] sm:h-80 sm:w-80"
      />

      {/* Botanical sprigs */}
      <Sprig
        bloom="rose"
        leaf="sage"
        className="absolute -left-6 bottom-10 h-56 w-32 opacity-[0.2] sm:h-72 sm:w-44"
      />
      <Sprig
        bloom="blush"
        leaf="gold"
        className="absolute -right-8 top-1/3 h-52 w-28 -scale-x-100 opacity-[0.18] sm:h-64 sm:w-40"
      />

      {/* Falling petals, or a gentle static scatter under reduced motion */}
      {prefersReduced ? (
        <StaticPetals configs={petals} />
      ) : (
        <FallingPetals configs={petals} />
      )}
    </div>
  )
}
