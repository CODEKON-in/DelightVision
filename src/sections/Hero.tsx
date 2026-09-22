<<<<<<< HEAD
=======
// import { useLayoutEffect, useRef } from "react";
// import gsap from "gsap";
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
import { Button } from "../components/Button";
import { HeroOrnament, Rosette } from "../components/HeroOrnament";
import { GoldMotes } from "../components/Royal";
import { Reveal } from "../components/Reveal";
import { PhoneIcon, WhatsAppIcon } from "../components/icons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";

<<<<<<< HEAD
=======
/* Letter-by-letter reveal for the small tracked label above the headline */
// function AnimatedLabel({
//   text,
//   className = "",
//   splitLetters = true,
// }: {
//   text: string;
//   className?: string;
//   splitLetters?: boolean;
// }) {
//   const ref = useRef<HTMLParagraphElement>(null);

//   useLayoutEffect(() => {
//     const el = ref.current;
//     if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
//       return;

//     let settle = 0;
//     const ctx = gsap.context(() => {
//       const targets = splitLetters ? "[data-letter]" : el;
//       const tween = gsap.fromTo(
//         targets,
//         { opacity: 0, y: 8 },
//         {
//           opacity: 1,
//           y: 0,
//           duration: splitLetters ? 0.4 : 0.6,
//           ease: "power2.out",
//           stagger: splitLetters ? 0.035 : 0,
//           delay: 0.15,
//         },
//       );
//       settle = window.setTimeout(() => {
//         if (tween.progress() === 0) tween.progress(1);
//       }, 1600);
//     }, el);

//     return () => {
//       window.clearTimeout(settle);
//       ctx.revert();
//     };
//   }, [splitLetters]);

//   if (!splitLetters) {
//     return (
//       <p ref={ref} className={className}>
//         {text}
//       </p>
//     );
//   }

//   return (
//     <p ref={ref} className={className} aria-label={text}>
//       {text.split("").map((ch, i) => (
//         <span key={i} data-letter aria-hidden="true" className="inline-block">
//           {ch === " " ? " " : ch}
//         </span>
//       ))}
//     </p>
//   );
// }

>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
export function Hero() {
  const whatsappHref = whatsappHrefFor(business.whatsappMessage);

  return (
    <section id="top" className="hero-surface relative overflow-hidden">
      {/* The same drifting gold specks the dark sections used to carry */}
      <GoldMotes />

      <HeroOrnament />

      {/* Fades the artwork out at the foot. It must end on the same colour
          the ground ends on (.hero-surface in index.css) — any other colour
          shows as a band across the bottom of the hero. */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-graphite"
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

        {/* The brand name in Over There, the logo's own face, and the
            slogan below it in Warpen — the two brand moments on the page.

            Over There is roughly two and a half times as wide as the serif
            this used to be set in, so it has its own sizes: from `sm` up,
            sized to the column; on a phone, sized to the screen so the name
            still fits on one line (it is about 15.1em wide, so the width
            inside the gutters divided by 15.5 keeps it clear down to 320px).
            It used to wrap to two lines there, which left the slogan wider
            than the name and no longer ending under "Vision".

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
        {/* The name and the slogan share one box as wide as the name,
            centred, with the slogan at its end — so the slogan finishes
            exactly where "Vision" does, as in the footer. The painted box
            (the name plus the 0.75em of padding the T's crossbar needs)
            stays inside the page gutter at every width, so the section's
            overflow-hidden never slices the crossbar off. */}
        <div className="mx-auto flex w-fit max-w-full flex-col items-end">
          <h1 className="shimmer-text type-brand-name mx-[-0.75em] mt-[calc(0.75rem-0.5em)] mb-[-0.5em] px-[0.75em] py-[0.5em] text-[clamp(1rem,calc((100vw_-_3rem)/15.5),2.5rem)] leading-[1.2] whitespace-nowrap [word-spacing:0.8em] sm:mt-[calc(1rem-0.5em)] sm:text-[clamp(2.25rem,6vw,2.875rem)]">
            {business.name}
          </h1>
          <p className="mt-4 type-slogan text-[clamp(1.1rem,5.5vw,1.875rem)] leading-snug text-gold-soft sm:mt-5">
            {business.tagline}
          </p>
        </div>

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
