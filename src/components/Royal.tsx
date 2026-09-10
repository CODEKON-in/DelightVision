import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { settleIfStalled } from "../lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const reduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ------------------------------------------------------------------
   Gold corner brackets that draw themselves onto a card. Used to crown
   the highlighted combo.
   ------------------------------------------------------------------ */
const CORNER = "M2 26V10A8 8 0 0 1 10 2h16";

export function CornerOrnaments() {
  const root = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced()) return;

    let settle = 0;
    const ctx = gsap.context(() => {
      const strokes = gsap.utils.toArray<SVGPathElement>("path");
      strokes.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 92%", toggleActions: "play none none none" },
      });
      tl.to(strokes, {
        strokeDashoffset: 0,
        duration: 0.9,
        ease: "power2.out",
        stagger: 0.12,
      });

      settle = settleIfStalled(() => tl.progress(1), 2200);
    }, el);

    return () => {
      window.clearTimeout(settle);
      ctx.revert();
    };
  }, []);

  /* Four rotations of one bracket, pinned to each corner */
  const corners = [
    "top-3 left-3",
    "top-3 right-3 rotate-90",
    "bottom-3 right-3 rotate-180",
    "bottom-3 left-3 -rotate-90",
  ];

  return (
    <span ref={root} aria-hidden="true">
      {corners.map((pos, i) => (
        <svg
          key={i}
          viewBox="0 0 28 28"
          className={`pointer-events-none absolute size-7 ${pos}`}
          focusable="false"
        >
          <path
            d={CORNER}
            fill="none"
            className="stroke-gold"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      ))}
    </span>
  );
}

/* ------------------------------------------------------------------
   Slow-drifting gold motes. Gives the dark sections some depth without
   pulling attention off the text.
   ------------------------------------------------------------------ */
/* Each entry is [left%, top%, size in px] */
const MOTES: [number, number, number][] = [
  [6, 22, 5],
  [17, 68, 3],
  [29, 34, 4],
  [41, 78, 3],
  [55, 18, 5],
  [68, 58, 3.5],
  [79, 30, 5],
  [91, 72, 3],
  [96, 44, 4],
  [12, 88, 3.5],
];

export function GoldMotes({ className = "" }: { className?: string }) {
  const root = useRef<HTMLDivElement>(null);
  /* Each mote runs its own endless tween. Half as many on a phone keeps
     the effect while halving the work on the weakest devices. */
  const [motes] = useState(() =>
    window.matchMedia("(max-width: 639px)").matches
      ? MOTES.filter((_, i) => i % 2 === 0)
      : MOTES
  );

  useLayoutEffect(() => {
    const el = root.current;
    if (!el || reduced()) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-mote]",
        { opacity: 0 },
        { opacity: 1, duration: 1.4, ease: "power1.out", stagger: { each: 0.12, from: "random" } }
      );

      /* Each mote drifts on its own loop so they never move in lockstep */
      gsap.utils.toArray<HTMLElement>("[data-mote]").forEach((mote, i) => {
        gsap.to(mote, {
          y: i % 2 === 0 ? -16 : 14,
          x: i % 3 === 0 ? 8 : -6,
          duration: 6 + (i % 5),
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
          delay: i * 0.35,
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  /* Round dots as elements rather than SVG: a stretched viewBox would
     squash them into ovals on wide screens. */
  return (
    <div
      ref={root}
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {motes.map(([left, top, size], i) => (
        <span
          key={i}
          data-mote
          className="absolute rounded-full bg-gold/55"
          style={{ left: `${left}%`, top: `${top}%`, width: size, height: size }}
        />
      ))}
    </div>
  );
}
