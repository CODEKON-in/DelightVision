import { useLayoutEffect, useRef, type ElementType, type ReactNode } from "react";
import gsap from "gsap";
import { settleIfStalled } from "../lib/motion";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

type RevealProps = {
  children: ReactNode;
  /* Render as something other than a div, e.g. "ul" or "section" */
  as?: ElementType;
  className?: string;
  delay?: number;
  /* When set, the wrapper's direct children animate in sequence
     instead of the wrapper animating as one block. */
  stagger?: number;
  /* Animate as soon as it mounts instead of waiting for a scroll —
     used for above-the-fold content like the hero. */
  immediate?: boolean;
};

/* Subtle fade + slide-up. Elements start visible in the DOM and are only
   hidden once GSAP takes over, so the page still reads correctly if
   JavaScript fails or motion is reduced. */
export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  delay = 0,
  stagger,
  immediate = false,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let settle = 0;

    const ctx = gsap.context(() => {
      const targets = stagger !== undefined ? Array.from(el.children) : [el];
      if (targets.length === 0) return;

      const tween = gsap.fromTo(
        targets,
        { opacity: 0, y: immediate ? 18 : 24 },
        {
          opacity: 1,
          y: 0,
          duration: immediate ? 0.7 : 0.6,
          ease: "power2.out",
          delay,
          stagger: stagger ?? 0,
          ...(immediate
            ? {}
            : {
                scrollTrigger: {
                  trigger: el,
                  start: "top 88%",
                  toggleActions: "play none none none",
                },
              }),
        }
      );

      /* Safety net for a browser that never paints. It deliberately does
         NOT fire just because this has not been scrolled to yet — see
         src/lib/motion.ts. */
      settle = settleIfStalled(() => tween.progress(1), 1200);
    }, el);

    return () => {
      window.clearTimeout(settle);
      ctx.revert();
    };
  }, [delay, stagger, immediate]);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
