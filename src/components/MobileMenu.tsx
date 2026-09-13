import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { settleIfStalled } from "../lib/motion";
import { Button } from "./Button";
import { CloseIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";

export type NavLink = { href: string; label: string };

type Props = {
  open: boolean;
  onClose: () => void;
  links: NavLink[];
};

/* Slide-down navigation panel for phones. Sits under the sticky header and
   carries the same Call / WhatsApp buttons, so booking is always two taps
   away at most from anywhere on the page. */
export function MobileMenu({ open, onClose, links }: Props) {
  const whatsappHref = whatsappHrefFor(business.whatsappMessage);
  const [reduced] = useState(() => window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [mounted, setMounted] = useState(open);
  const sheetRef = useRef<HTMLDivElement>(null);
  const scrimRef = useRef<HTMLDivElement>(null);

  /* Adjusted during render rather than in an effect — no extra paint */
  if (open && !mounted) setMounted(true);
  const visible = open || (mounted && !reduced);

  /* Hold the page still behind the panel */
  useEffect(() => {
    if (!visible) return;
    const body = document.body;
    const prev = body.style.overflow;
    body.style.overflow = "hidden";
    return () => {
      body.style.overflow = prev;
    };
  }, [visible]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useLayoutEffect(() => {
    if (!visible) return;
    const sheet = sheetRef.current;
    const scrim = scrimRef.current;
    if (!sheet || !scrim) return;

    if (open) {
      if (reduced) {
        gsap.set([scrim, sheet], { opacity: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "power2.out" })
        .fromTo(
          sheet,
          { opacity: 0, y: -16 },
          { opacity: 1, y: 0, duration: 0.3, ease: "power3.out" },
          "-=0.12"
        )
        .fromTo(
          sheet.querySelectorAll("[data-menu-item]"),
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.25, stagger: 0.05, ease: "power2.out" },
          "-=0.16"
        );

      /* A dead ticker must never leave the panel invisible */
      const settle = settleIfStalled(() => tl.progress(1), 700);
      return () => {
        window.clearTimeout(settle);
        tl.kill();
      };
    }

    const tl = gsap.timeline({ onComplete: () => setMounted(false) });
    tl.to(sheet, { opacity: 0, y: -12, duration: 0.2, ease: "power2.in" }).to(
      scrim,
      { opacity: 0, duration: 0.16 },
      "-=0.12"
    );
    /* Closing must not depend on the animation finishing */
    const settle = window.setTimeout(() => setMounted(false), 600);
    return () => {
      window.clearTimeout(settle);
      tl.kill();
    };
  }, [open, visible, reduced]);

  if (!visible) return null;

  /* Portalled to <body> on purpose: the header uses backdrop-blur, and a
     backdrop-filter makes that element the containing block for any
     position:fixed descendant — which collapsed this panel to a sliver. */
  return createPortal(
    <div className="fixed inset-x-0 top-16 bottom-0 z-50 sm:top-20 lg:hidden" id="mobile-menu">
      <div
        ref={scrimRef}
        className="absolute inset-0 bg-obsidian/85 sm:bg-obsidian/70 sm:backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={sheetRef}
        className="relative max-h-full overflow-y-auto overscroll-contain border-b border-dark-line bg-obsidian px-5 pt-2 pb-8 shadow-modal"
      >
        <nav aria-label={ui.mainNavigation}>
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.href} data-menu-item>
                <a
                  href={link.href}
                  onClick={onClose}
                  className="flex min-h-16 items-center justify-between border-b border-dark-line type-nav text-2xl text-ivory-light transition-colors active:text-gold-soft"
                >
                  {link.label}
                  <span aria-hidden="true" className="text-gold">
                    →
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div data-menu-item className="mt-7 flex flex-col gap-3">
          <Button
            href={telHref}
            variant="onDark"
            size="lg"
            fullWidth
            icon={<PhoneIcon className="size-6" />}
            onClick={onClose}
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
            icon={<WhatsAppIcon className="size-6" />}
            onClick={onClose}
          >
            {ui.whatsappUs}
          </Button>
        </div>

        <p data-menu-item className="mt-6 text-center text-base text-muted-soft">
          {business.addressLine1}, {business.addressLine2}
        </p>

        <button
          type="button"
          onClick={onClose}
          data-menu-item
          className="mx-auto mt-5 flex min-h-12 items-center gap-2 px-5 type-nav text-base text-muted-soft"
        >
          <CloseIcon className="size-5" />
          {ui.closeMenu}
        </button>
      </div>
    </div>,
    document.body
  );
}
