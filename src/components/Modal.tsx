import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import { settleIfStalled } from "../lib/motion";
import { CloseIcon } from "./icons";
import { ui } from "../data/copy";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  /* id of the element naming the dialog, for screen readers */
  labelledBy: string;
  /* What the close button announces. Defaults to the service wording the
     three older detail views already used. */
  closeLabel?: string;
  children: ReactNode;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

/* Full-screen on mobile, centred panel on desktop.
   Closes on the X button, a click outside the panel, or Escape. */
export function Modal({
  open,
  onClose,
  labelledBy,
  closeLabel = ui.closeDetails,
  children,
}: ModalProps) {
  /* Read once — the animation branches on it in several places */
  const [reduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  /* Kept mounted through the closing animation */
  const [mounted, setMounted] = useState(open);
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  /* Adjusting state during render rather than in an effect — this is the
     React pattern for reacting to a changed prop without an extra paint. */
  if (open && !mounted) setMounted(true);

  /* With motion reduced there is no exit animation to wait for, so the
     dialog simply stops rendering as soon as it is closed. */
  const visible = open || (mounted && !reduced);

  /* Lock the page behind the modal and hide the sticky call bar, so the
     two sets of call buttons can never overlap. */
  useEffect(() => {
    if (!visible) return;

    const html = document.documentElement;
    const body = document.body;
    const barWidth = window.innerWidth - html.clientWidth;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPad: body.style.paddingRight,
    };

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    /* Stop the page jumping sideways when the scrollbar disappears */
    if (barWidth > 0) body.style.paddingRight = `${barWidth}px`;
    html.classList.add("modal-open");

    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.paddingRight = prev.bodyPad;
      html.classList.remove("modal-open");
    };
  }, [visible]);

  /* Escape to close */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  /* Move focus in on open, and back to the trigger on close */
  useEffect(() => {
    if (open) {
      restoreFocusTo.current = document.activeElement as HTMLElement | null;
      /* Wait for the panel to exist before focusing */
      const id = window.setTimeout(() => closeRef.current?.focus(), 0);
      return () => window.clearTimeout(id);
    }
    restoreFocusTo.current?.focus?.();
  }, [open]);

  /* Keep Tab inside the dialog */
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key !== "Tab" || !panelRef.current) return;
    const items = Array.from(
      panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)
    ).filter((el) => el.offsetParent !== null);
    if (items.length === 0) return;

    const first = items[0];
    const last = items[items.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }, []);

  /* Scale + fade transition, skipped under prefers-reduced-motion */
  useLayoutEffect(() => {
    if (!visible) return;
    const backdrop = backdropRef.current;
    const panel = panelRef.current;
    if (!backdrop || !panel) return;

    if (open) {
      if (reduced) {
        gsap.set([backdrop, panel], { opacity: 1, scale: 1, y: 0 });
        return;
      }
      const tl = gsap.timeline();
      tl.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" })
        .fromTo(
          panel,
          { opacity: 0, scale: 0.96, y: 16 },
          { opacity: 1, scale: 1, y: 0, duration: 0.32, ease: "power3.out" },
          "-=0.15"
        );

      /* If the browser is not painting at all, jump to the end so the
         dialog is never left invisible. */
      const settle = settleIfStalled(() => tl.progress(1), 700);

      return () => {
        window.clearTimeout(settle);
        tl.kill();
      };
    }

    /* Closing — unmount once the exit animation has finished */
    const tl = gsap.timeline({ onComplete: () => setMounted(false) });
    tl.to(panel, { opacity: 0, scale: 0.97, y: 8, duration: 0.2, ease: "power2.in" }).to(
      backdrop,
      { opacity: 0, duration: 0.18, ease: "power1.in" },
      "-=0.12"
    );

    /* Closing must never depend on the animation finishing — if the ticker
       is stalled, a tap on Close would otherwise leave the dialog stuck. */
    const settle = window.setTimeout(() => setMounted(false), 600);

    return () => {
      window.clearTimeout(settle);
      tl.kill();
    };
  }, [open, visible, reduced]);

  if (!visible) return null;

  return createPortal(
    <div className="fixed inset-0 z-60" role="dialog" aria-modal="true" aria-labelledby={labelledBy}>
      <div
        ref={backdropRef}
        className="absolute inset-0 bg-royal/90 sm:bg-royal/80 sm:backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile: fills the screen. sm and up: a centred panel. */}
      <div className="relative flex h-full w-full items-stretch justify-center sm:items-center sm:p-6">
        <div
          ref={panelRef}
          onKeyDown={onKeyDown}
          className={[
            "no-scrollbar relative flex w-full flex-col overflow-y-auto overscroll-contain",
            "bg-ivory shadow-modal",
            "h-full sm:h-auto sm:max-h-[90vh] sm:max-w-2xl sm:rounded-3xl sm:border sm:border-gold/30",
          ].join(" ")}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label={closeLabel}
            className="absolute top-4 right-4 z-10 inline-flex size-12 items-center justify-center rounded-full bg-royal/90 text-ivory-light transition-colors hover:bg-royal"
          >
            <CloseIcon className="size-6" />
          </button>

          {children}
        </div>
      </div>
    </div>,
    document.body
  );
}
