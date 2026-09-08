import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { settleIfStalled } from "../lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  /* Gold on royal, or the deeper gold used on ivory */
  onDark?: boolean;
  className?: string;
};

/* Ornamental gold rule. The two side strokes draw outwards from the centre
   as it scrolls into view, and the centre diamond settles into place. */
export function Flourish({ onDark = true, className = "" }: Props) {
  const root = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let settle = 0;

    const ctx = gsap.context(() => {
      const strokes = gsap.utils.toArray<SVGPathElement>("[data-draw]");
      strokes.forEach((p) => {
        const len = p.getTotalLength();
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 92%", once: true },
      });

      tl.to(strokes, { strokeDashoffset: 0, duration: 0.9, ease: "power2.out" }).fromTo(
        "[data-gem]",
        { opacity: 0, scale: 0, transformOrigin: "center" },
        { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)" },
        "-=0.35"
      );

      /* Never leave the rule half-drawn if the browser is not painting */
      settle = settleIfStalled(() => tl.progress(1), 1600);
    }, el);

    return () => {
      window.clearTimeout(settle);
      ctx.revert();
    };
  }, []);

  const line = onDark ? "#d4af37" : "#7a5a0f";
  const gem = onDark ? "#f2dc9b" : "#d4af37";

  return (
    <svg
      ref={root}
      viewBox="0 0 240 24"
      className={`h-6 w-60 ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      {/* Tapered strokes running out from the centre */}
      <path
        data-draw
        d="M120 12H74c-8 0-12-5-20-5"
        fill="none"
        stroke={line}
        strokeOpacity="0.65"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        data-draw
        d="M120 12h46c8 0 12-5 20-5"
        fill="none"
        stroke={line}
        strokeOpacity="0.65"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <g data-gem>
        <rect
          x="115"
          y="7"
          width="10"
          height="10"
          transform="rotate(45 120 12)"
          fill={gem}
        />
        <circle cx="96" cy="12" r="1.6" fill={gem} fillOpacity="0.7" />
        <circle cx="144" cy="12" r="1.6" fill={gem} fillOpacity="0.7" />
      </g>
    </svg>
  );
}
