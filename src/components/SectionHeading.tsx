import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flourish } from "./Flourish";
import { settleIfStalled } from "../lib/motion";

gsap.registerPlugin(ScrollTrigger);

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /* Renders light-on-dark, for use over the obsidian sections */
  onDark?: boolean;
};

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  onDark = false,
}: SectionHeadingProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);

  useLayoutEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let settle = 0;
    const ctx = gsap.context(() => {
      /* A band of gold passes through the title once, the first time it
         comes into view. It rides on background-position of a gradient
         clipped to the text, so nothing around it moves or reflows. */
      const tl = gsap.timeline({
        scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
      });
      tl.fromTo(
        el,
        { backgroundPosition: "100% 0" },
        { backgroundPosition: "0% 0", duration: 1.6, ease: "power2.inOut", delay: 0.15 }
      );

      settle = settleIfStalled(() => tl.progress(1), 2000);
    }, el);

    return () => {
      window.clearTimeout(settle);
      ctx.revert();
    };
  }, []);

  return (
    <div className="mx-auto max-w-2xl text-center">
      {eyebrow && (
        <p
          className={[
            "label-gold mb-3",
            onDark ? "text-gold-soft" : "text-gold-deep",
          ].join(" ")}
        >
          {eyebrow}
        </p>
      )}

      <h2
        ref={titleRef}
        className={[
          "title-sheen text-[clamp(1.75rem,6.5vw,2.25rem)] leading-tight font-semibold",
          onDark ? "title-sheen-dark text-ivory-light" : "title-sheen-light text-charcoal",
        ].join(" ")}
      >
        {title}
      </h2>

      {/* Animated gold rule — the recurring decorative motif of the site */}
      <div className="mt-4 flex justify-center">
        <Flourish onDark={onDark} />
      </div>

      {subtitle && (
        <p
          className={[
            "mt-5 text-lg",
            onDark ? "text-muted-soft" : "text-muted",
          ].join(" ")}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
