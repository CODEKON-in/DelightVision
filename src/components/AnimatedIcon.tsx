import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { settleIfStalled } from "../lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type Props = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /* Animate on mount instead of on scroll — for icons inside a modal,
     which is already in view the moment it opens. */
  immediate?: boolean;
};

/* Wraps any icon and brings it to life: outlined icons draw themselves
   stroke by stroke, solid icons scale up. Works on the existing icon set
   without touching a single icon definition. */
export function AnimatedIcon({ children, className = "", delay = 0, immediate = false }: Props) {
  const ref = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let settle = 0;

    const ctx = gsap.context(() => {
      const svg = el.querySelector("svg");
      if (!svg) return;

      const geometry = Array.from(
        svg.querySelectorAll<SVGGeometryElement>("path, circle, rect, line, polyline, polygon")
      );
      if (geometry.length === 0) return;

      /* Split by how each shape is painted — a stroke can be drawn on,
         a fill can only be scaled in. */
      const stroked: SVGGeometryElement[] = [];
      const filled: SVGGeometryElement[] = [];
      geometry.forEach((node) => {
        const stroke = getComputedStyle(node).stroke;
        (stroke && stroke !== "none" ? stroked : filled).push(node);
      });

      const tl = gsap.timeline({
        delay,
        ...(immediate
          ? {}
          : { scrollTrigger: { trigger: el, start: "top 94%", once: true } }),
      });

      if (stroked.length) {
        stroked.forEach((node) => {
          const len = typeof node.getTotalLength === "function" ? node.getTotalLength() : 0;
          if (len > 0) gsap.set(node, { strokeDasharray: len, strokeDashoffset: len });
        });
        tl.to(
          stroked,
          { strokeDashoffset: 0, duration: 0.85, ease: "power2.out", stagger: 0.09 },
          0
        );
      }

      if (filled.length) {
        tl.fromTo(
          filled,
          { opacity: 0, scale: 0.5, transformOrigin: "center" },
          { opacity: 1, scale: 1, duration: 0.5, ease: "back.out(2)", stagger: 0.07 },
          0
        );
      }

      /* A dead ticker must never leave an icon half-drawn or invisible */
      settle = settleIfStalled(() => tl.progress(1), 2400);
    }, el);

    return () => {
      window.clearTimeout(settle);
      ctx.revert();
    };
  }, [delay, immediate]);

  return (
    <span ref={ref} className={className}>
      {children}
    </span>
  );
}
