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

        {/* The brand name in Over There, the logo's own face, and the
            slogan below it in Warpen — the two brand moments on the page.

            Over There is roughly two and a half times as wide as the serif
            this used to be set in, so it has its own sizes: one line from
            `sm` up, sized to the column; two lines on a phone, sized so
            "Delight" fits.

            The gold shimmer only paints inside the heading's own box, and
            Over There's T breaks out of that box two ways: its crossbar
            rises about 0.4em above the other capitals, and it reaches about
            1.4em past its own advance. Clipped, the name read "DELIGHI".
            The padding widens and heightens the painted box to take in the
            whole T; the matching negative margins cancel it, so the text
            sits exactly where it would without the padding.

            The same crossbar reaches over the space and into the "V", so
            on one line the name ran together as "DELIGHTVISION"; the extra
            word spacing clears it. */}
        {/* 7.25vw, not 9: at 9vw the painted box (the name plus the 0.75em
            of padding the T's crossbar needs) came out 6px wider than a
            390px phone on each side, and the section's own overflow-hidden
            sliced the crossbar off — the name ended in a cut-short T. At
            7.25vw the whole box, crossbar included, clears the gutter on
            every phone from 320px up. */}
        <h1 className="shimmer-text type-brand-name -mx-[0.75em] mt-[calc(0.75rem-0.5em)] mb-[-0.5em] px-[0.75em] py-[0.5em] text-[clamp(1.375rem,7.25vw,2.5rem)] leading-[1.2] [word-spacing:0.8em] sm:mt-[calc(1rem-0.5em)] sm:text-[clamp(2.25rem,6vw,2.875rem)] sm:whitespace-nowrap">
          {business.name}
        </h1>

        <p className="mt-4 type-slogan text-[clamp(1.35rem,5.5vw,1.875rem)] leading-snug text-gold-soft sm:mt-5">
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
            className="type-price mt-1 inline-flex min-h-14 items-center px-4 text-[clamp(1.5rem,7vw,2.25rem)] text-gold-soft underline decoration-gold decoration-2 underline-offset-8"
          >
            {business.phoneDisplay}
          </a>
        </div>

      </Reveal>
    </section>
  );
}
