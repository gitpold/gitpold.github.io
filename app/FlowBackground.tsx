/* ---------------------------------------------------------------------------
 * Ambient background: threads of light that gather and fan apart, with a
 * brighter segment travelling along each one. Strands fade in, carry their
 * light, and fade out again on their own cycle, so the composition never
 * settles.
 *
 * No hooks and no per-frame scripting — it is static SVG plus CSS keyframes,
 * and it disables itself entirely under prefers-reduced-motion.
 *
 * The layout is generated from a seeded PRNG rather than hand-authored: node
 * spacing, strand count, bow direction and magnitude, timings and fade cycles
 * are all irregular. The seed keeps it deterministic, which matters because
 * the page is statically prerendered — Math.random() here would bake one
 * layout into the HTML at build time and generate a different one on the
 * client, and hydration would mismatch. Change SEED to reroll the composition.
 *
 * Requires a stacking context on an ancestor (`isolate` on the page root), or
 * the -z-10 layer paints behind that ancestor's background instead of above it.
 * ------------------------------------------------------------------------- */

const SEED = 20260914;

/** mulberry32 — small, fast, good enough for layout jitter. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Strand {
  d: string;
  w: number;
  /** Seconds for the light to travel the strand. */
  dur: number;
  delay: number;
  /** Seconds for one appear / hold / disappear cycle. */
  fadeDur: number;
  fadeDelay: number;
  dim: number;
}

function makeStrands(seed: number): Strand[] {
  const r = rng(seed);
  const out: Strand[] = [];
  const range = (lo: number, hi: number) => lo + r() * (hi - lo);

  const BRAID_COUNT = 12;
  for (let b = 0; b < BRAID_COUNT; b++) {
    // 2–4 rather than 1–4: a lone-strand braid leaves its band looking bare
    // next to a 4-strand neighbour.
    const strandCount = 2 + Math.floor(r() * 3);
    const nodeCount = 4 + Math.floor(r() * 4); // 4–7
    const amp = range(26, 88);
    const baseDur = range(38, 68);

    // Stratified rather than uniform: each braid sits somewhere inside its own
    // horizontal band. Purely random placement clumps and leaves bare stripes.
    // The band is anchored to the braid's centre with the tilt applied
    // symmetrically — anchoring to the start point drags braids out of their
    // band. The span overshoots the viewBox so braids bleed off top and bottom.
    const band = 960 / BRAID_COUNT;
    const yCentre = -80 + b * band + r() * band;
    const tilt = range(-210, 210);
    const yStart = yCentre - tilt / 2;
    const yEnd = yCentre + tilt / 2;

    // Irregularly spaced nodes, from off-screen left to off-screen right.
    const weights = Array.from({ length: nodeCount - 1 }, () => range(0.45, 1.6));
    const total = weights.reduce((a, c) => a + c, 0);
    const xs = [-220];
    for (const w of weights) xs.push(xs[xs.length - 1] + (1640 * w) / total);

    // A drifting node line, not a straight one.
    const ys = xs.map((_, i) => {
      const t = i / (xs.length - 1);
      const onEdge = i === 0 || i === xs.length - 1;
      return yStart + (yEnd - yStart) * t + (onEdge ? 0 : range(-70, 70));
    });

    for (let k = 0; k < strandCount; k++) {
      // Some structure (strands keep a rough order) plus real randomness, so
      // they neither stack symmetrically nor read as unrelated squiggles.
      const spread = strandCount === 1 ? 0 : (k / (strandCount - 1)) * 2 - 1;

      let d = `M ${xs[0].toFixed(1)} ${ys[0].toFixed(1)}`;
      for (let i = 0; i < xs.length - 1; i++) {
        const dx = (xs[i + 1] - xs[i]) / 3;
        // Loosen the shared nodes a few px per strand so the joins look drawn
        // rather than snapped.
        const y0 = ys[i] + (i === 0 ? 0 : range(-9, 9));
        const y1 = ys[i + 1] + (i === xs.length - 2 ? 0 : range(-9, 9));
        const bow = (spread * 0.55 + range(-0.55, 0.55)) * amp * range(0.5, 1.35);
        d += ` C ${(xs[i] + dx).toFixed(1)} ${(y0 + bow).toFixed(1)}, ${(xs[i + 1] - dx).toFixed(1)} ${(y1 + bow).toFixed(1)}, ${xs[i + 1].toFixed(1)} ${y1.toFixed(1)}`;
      }

      out.push({
        d,
        w: range(0.6, 1.3),
        // Durations differ slightly per strand so the lights drift in and out
        // of sync instead of pulsing in lockstep.
        dur: baseDur * range(0.88, 1.12),
        delay: -range(0, 60),
        fadeDur: range(46, 104),
        fadeDelay: -range(0, 100),
        dim: range(0.5, 1),
      });
    }
  }
  return out;
}

const STRANDS = makeStrands(SEED);

export function FlowBackground() {
  return (
    <div className="flow-bg pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <style>{`
        @keyframes flow-travel { to { stroke-dashoffset: 0; } }
        @keyframes flow-drift {
          0%, 100% { transform: translate3d(0, 0, 0); }
          50%      { transform: translate3d(0, -18px, 0); }
        }
        /* A strand fades in, holds while the light runs through it, fades out,
           then stays gone for a while. Random durations and negative delays
           mean they come and go independently. */
        @keyframes flow-breathe {
          0%        { opacity: 0; }
          10%, 55%  { opacity: 1; }
          72%, 100% { opacity: 0; }
        }
        .flow-light {
          stroke-dasharray: 110 890;
          stroke-dashoffset: 1000;
        }
        .flow-drift { animation: flow-drift 31s ease-in-out infinite; }
        /* !important: the per-strand animations are set inline, and an inline
           style otherwise wins over a stylesheet rule. */
        @media (prefers-reduced-motion: reduce) {
          .flow-bg *    { animation: none !important; }
          .flow-light   { opacity: 0 !important; }
        }
      `}</style>
      {/* preserveAspectRatio="none" stretches the viewBox to exactly fill the
          viewport, so the braids cover the screen at every aspect ratio.
          "slice" would crop ~30% of the height on a 16:9 monitor and leave the
          top and bottom bare. The curves distort a little, which is invisible
          on shapes this organic. */}
      <svg
        className="h-full w-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        fill="none"
      >
        <defs>
          <linearGradient id="flow-fade" x1="0" y1="0" x2="1200" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#bfdbfe" stopOpacity="0" />
            <stop offset="0.2" stopColor="#bfdbfe" stopOpacity="0.6" />
            <stop offset="0.8" stopColor="#bfdbfe" stopOpacity="0.6" />
            <stop offset="1" stopColor="#bfdbfe" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="flow-drift" opacity="0.14">
          {STRANDS.map((s, i) => (
            // The whole strand breathes in and out; the light travels it on
            // its own, unrelated cycle.
            <g
              key={i}
              style={{ animation: `flow-breathe ${s.fadeDur.toFixed(1)}s ease-in-out ${s.fadeDelay.toFixed(1)}s infinite` }}
            >
              <path
                d={s.d}
                pathLength={1000}
                stroke="url(#flow-fade)"
                strokeWidth={s.w}
                opacity={(0.22 * s.dim).toFixed(3)}
              />
              {/* pathLength normalises every strand to 1000 units, so the light
                  sits at the same fraction of each path regardless of its real
                  length — that is what makes strands converge at the nodes. */}
              <path
                className="flow-light"
                d={s.d}
                pathLength={1000}
                stroke="url(#flow-fade)"
                strokeWidth={s.w * 1.6}
                strokeLinecap="round"
                opacity={s.dim.toFixed(3)}
                style={{ animation: `flow-travel ${s.dur.toFixed(1)}s linear ${s.delay.toFixed(1)}s infinite` }}
              />
            </g>
          ))}
        </g>
      </svg>
    </div>
  );
}
