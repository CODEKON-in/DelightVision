import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
<<<<<<< HEAD
import { pauseWhileOffscreen, settleIfStalled } from "../lib/motion";
=======
import { settleIfStalled } from "../lib/motion";
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2

gsap.registerPlugin(ScrollTrigger);

/* One petal of the rosette, drawn from its centre outwards */
const PETAL = "M0 0C9 -11 9 -27 0 -36C-9 -27 -9 -11 0 0Z";

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* Small floral rosette. Rendered inline above the headline rather than in
   the background, so its gold strokes never cross the text. */
export function Rosette({ className = "" }: { className?: string }) {
  const root = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    let settle = 0;
<<<<<<< HEAD
    let unobserve = () => {};
=======
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tl.fromTo(
        "[data-petal]",
        { opacity: 0, scale: 0.3, transformOrigin: "center" },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.6)",
          stagger: { each: 0.06, from: "start" },
        }
      ).fromTo(
        "[data-core]",
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" },
        "-=0.3"
      );

<<<<<<< HEAD
      const spin = gsap.to("[data-spin]", {
=======
      gsap.to("[data-spin]", {
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
        rotate: 360,
        transformOrigin: "center",
        duration: 110,
        ease: "none",
        repeat: -1,
      });
<<<<<<< HEAD
      unobserve = pauseWhileOffscreen(el, [spin]);
=======
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2

      settle = settleIfStalled(() => tl.progress(1), 1600);
    }, el);

    return () => {
      window.clearTimeout(settle);
<<<<<<< HEAD
      unobserve();
=======
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
      ctx.revert();
    };
  }, []);

  return (
    <svg
      ref={root}
      viewBox="-50 -50 100 100"
      className={`size-14 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <g data-spin>
        {Array.from({ length: 8 }, (_, i) => (
          <path
            key={i}
            data-petal
            d={PETAL}
            transform={`rotate(${i * 45}) translate(0 6)`}
            fill="none"
            className="stroke-gold"
            strokeOpacity="0.8"
            strokeWidth="2.2"
          />
        ))}
      </g>
      <circle data-core cx="0" cy="0" r="5" className="fill-gold-soft" />
    </svg>
  );
}

/* Decorative arch behind the hero. Everything sits out at the edges — the
   centre column is kept clear so the headline stays easy to read. */
export function HeroOrnament() {
  const root = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    let settle = 0;
<<<<<<< HEAD
    let unobserve = () => {};
=======
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2

    const ctx = gsap.context(() => {
      const strokes = gsap.utils.toArray<SVGPathElement>("[data-draw]");
      strokes.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline();
      tl.to(strokes, {
        strokeDashoffset: 0,
        duration: 2.1,
        ease: "power2.inOut",
        stagger: 0.25,
      }).fromTo(
        "[data-bloom]",
        { opacity: 0, scale: 0, transformOrigin: "center" },
        {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "back.out(1.8)",
          stagger: { each: 0.1, from: "random" },
        },
        "-=1.2"
      );

      /* Gentle, never-ending drift so the hero is not completely static */
<<<<<<< HEAD
      const float = gsap.to("[data-float]", {
=======
      gsap.to("[data-float]", {
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
        y: -9,
        duration: 3.6,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        stagger: { each: 0.5, from: "random" },
      });

<<<<<<< HEAD
      /* Ambient only: paused once the artwork has scrolled away, so it
         costs a phone nothing for the rest of the visit. */
      unobserve = pauseWhileOffscreen(el, [float]);

=======
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
      /* The arch drifts a little slower than the page as you scroll, which
         gives the hero depth without moving anything the eye is reading.
         Transform only, and scrubbed so it costs nothing when still. */
      gsap.to(el, {
        yPercent: 12,
        ease: "none",
        scrollTrigger: {
          trigger: el.parentElement,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      /* A dead ticker must never leave the artwork half-drawn */
      settle = settleIfStalled(() => tl.progress(1), 2800);
    }, el);

    return () => {
      window.clearTimeout(settle);
<<<<<<< HEAD
      unobserve();
=======
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
      ctx.revert();
    };
  }, []);

  return (
    /* No h-full: the art keeps its own aspect ratio and sits across the top,
       which stops it zooming in awkwardly on narrow phone screens. */
    <svg
      ref={root}
      className="pointer-events-none absolute inset-x-0 top-0 mx-auto w-full max-w-3xl opacity-80"
      viewBox="0 0 400 520"
      preserveAspectRatio="xMidYMin meet"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="dv-arch" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--color-gold)" }} stopOpacity="0.75" />
          <stop offset="55%" style={{ stopColor: "var(--color-gold)" }} stopOpacity="0.3" />
          <stop offset="100%" style={{ stopColor: "var(--color-gold)" }} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Twin arches */}
      <path
        data-draw
        d="M52 520V206a148 148 0 0 1 296 0v314"
        fill="none"
        stroke="url(#dv-arch)"
        strokeWidth="2"
      />
      <path
        data-draw
        d="M88 520V212a112 112 0 0 1 224 0v308"
        fill="none"
        stroke="url(#dv-arch)"
        strokeWidth="1"
      />

      {/* Blooms, kept to the outer edges */}
      {[
        [58, 250, 3.6],
        [342, 250, 3.6],
        [70, 330, 3],
        [330, 330, 3],
        [46, 418, 2.6],
        [354, 418, 2.6],
      ].map(([cx, cy, r], i) => (
        <g key={i} data-bloom>
          <g data-float>
            <circle cx={cx} cy={cy} r={r} className="fill-gold-soft" fillOpacity="0.5" />
            <circle cx={cx} cy={cy} r={r * 2.2} fill="none" className="stroke-gold" strokeOpacity="0.25" />
          </g>
        </g>
      ))}

      {/* Drifting petals, also off to the sides */}
      {[
        [96, 300, 18],
        [306, 286, -14],
        [82, 402, 26],
        [320, 430, -9],
      ].map(([x, y, rot], i) => (
        <g key={`p-${i}`} data-bloom>
          <g data-float>
            <path
              d={PETAL}
              transform={`translate(${x} ${y}) rotate(${rot}) scale(0.5)`}
              fill="none"
              className="stroke-gold"
              strokeOpacity="0.38"
              strokeWidth="1.6"
            />
          </g>
        </g>
      ))}
    </svg>
  );
}
