import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Button } from "../components/Button";
import { HeroOrnament, Rosette } from "../components/HeroOrnament";
import { GoldMotes } from "../components/Royal";
import { Reveal } from "../components/Reveal";
import { PhoneIcon, WhatsAppIcon } from "../components/icons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";

/* Letter-by-letter reveal for the small tracked label above the headline */
function AnimatedLabel({
  text,
  className = "",
  splitLetters = true,
}: {
  text: string;
  className?: string;
  splitLetters?: boolean;
}) {
  const ref = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let settle = 0;
    const ctx = gsap.context(() => {
      const targets = splitLetters ? "[data-letter]" : el;
      const tween = gsap.fromTo(
        targets,
        { opacity: 0, y: 8 },
        {
          opacity: 1,
          y: 0,
          duration: splitLetters ? 0.4 : 0.6,
          ease: "power2.out",
          stagger: splitLetters ? 0.035 : 0,
          delay: 0.15,
        }
      );
      settle = window.setTimeout(() => {
        if (tween.progress() === 0) tween.progress(1);
      }, 1600);
    }, el);

    return () => {
      window.clearTimeout(settle);
      ctx.revert();
    };
  }, [splitLetters]);

  if (!splitLetters) {
    return (
      <p ref={ref} className={className}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={className} aria-label={text}>
      {text.split("").map((ch, i) => (
        <span key={i} data-letter aria-hidden="true" className="inline-block">
          {ch === " " ? " " : ch}
        </span>
      ))}
    </p>
  );
}

export function Hero() {
  const whatsappHref = whatsappHrefFor(business.whatsappMessage);

  return (
    <section id="top" className="hero-surface relative overflow-hidden">
      {/* A whisper of champagne from above. The ground already lifts to
          graphite from below, so this only has to suggest light falling on
          the black — anything stronger reads as a glow. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, rgba(184,148,79,0.10) 0%, rgba(184,148,79,0.03) 34%, rgba(8,8,8,0) 72%)",
        }}
        aria-hidden="true"
      />

      {/* The same drifting gold specks the dark sections used to carry */}
      <GoldMotes />

      <HeroOrnament />

      {/* Keeps the headline readable over the artwork behind it */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-[65%]"
        style={{
          background:
            "radial-gradient(62% 50% at 50% 30%, rgba(8,8,8,0.78) 0%, rgba(8,8,8,0) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Fades the artwork out into the section below */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-charcoal"
        aria-hidden="true"
      />

      {/* Each child fades up in sequence as the page loads */}
      <Reveal
        immediate
        stagger={0.08}
        className="relative mx-auto max-w-3xl px-5 pt-[clamp(2.5rem,8vw,5rem)] pb-[clamp(3rem,9vw,6rem)] text-center lg:px-8"
      >
        <div className="flex justify-center">
          <Rosette className="size-12 sm:size-14" />
        </div>

        <AnimatedLabel
          text={ui.heroEyebrow}
          className="label-gold mt-4 text-gold-soft sm:mt-5"
        />

        <h1 className="shimmer-text mt-3 font-serif text-[clamp(2.75rem,13vw,6rem)] leading-[1.06] font-semibold sm:mt-4">
          {business.name}
        </h1>

        <p className="mt-4 font-serif text-[clamp(1.35rem,5.5vw,1.875rem)] leading-snug text-gold-soft italic sm:mt-5">
          {business.tagline}
        </p>

        {/* Call is the single most prominent element on the page */}
        <div className="mt-8 flex flex-col items-center gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-4">
          <Button
            href={telHref}
            variant="onDark"
            size="lg"
            fullWidth
            className="sm:w-auto sm:min-w-56"
            icon={<PhoneIcon className="size-6" />}
          >
            {ui.callNow}
          </Button>

          <Button
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            variant="whatsapp"
            size="lg"
            fullWidth
            className="sm:w-auto sm:min-w-56"
            icon={<WhatsAppIcon className="size-6" />}
          >
            {ui.whatsappUs}
          </Button>
        </div>

        <div className="mt-7">
          <a
            href={telHref}
            className="nums-lining mt-1 inline-flex min-h-14 items-center px-4 font-serif text-[clamp(1.5rem,7vw,2.25rem)] font-semibold text-gold-soft underline decoration-gold decoration-2 underline-offset-8"
          >
            {business.phoneDisplay}
          </a>
        </div>

      </Reveal>
    </section>
  );
}
