import { useEffect, useState, type RefObject } from "react";
import { ChevronDownIcon } from "./icons";
import { ui } from "../data/copy";

type Props = {
  /* The box that scrolls. Left out for the page itself. */
  scroller?: RefObject<HTMLElement | null>;
  className?: string;
};

/* How much more content there has to be before the cue is worth showing. */
const WORTH_SHOWING = 48;

/* A small chevron saying "there is more below". Shown only when it is
   needed: the box has to actually scroll, and the reader has to still be on
   its first screenful — a fixed number of pixels hid it while they were
   barely a third of the way down the opening screen. Past that they know it
   scrolls, so it fades out, and it comes back if they return to the top.

   Decorative: it is `aria-hidden` and takes no clicks, because scrolling is
   the thing it describes rather than an action of its own. */
export function ScrollCue({ scroller, className = "" }: Props) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = scroller?.current;
    /* The page scrolls on the document element; a dialog on its own panel. */
    const target: HTMLElement | null = el ?? document.documentElement;
    if (!target) return;

    const listener: EventTarget = el ?? window;

    const update = () => {
      const scrolled = el ? el.scrollTop : window.scrollY;
      const remaining = target.scrollHeight - target.clientHeight - scrolled;
      /* One screenful — of the page, or of the dialog's panel — so the cue
         lasts as long as the view it appeared on. */
      const firstScreen = target.clientHeight;
      setShow(remaining > WORTH_SHOWING && scrolled < firstScreen);
    };

    update();
    listener.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);

    /* Content that arrives or images that load change the height, and a
       dialog's body is measured before its photo has loaded. */
    const observer = new ResizeObserver(update);
    observer.observe(target);
    if (target.firstElementChild) observer.observe(target.firstElementChild);

    return () => {
      listener.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
      observer.disconnect();
    };
  }, [scroller]);

  return (
    <div
      aria-hidden="true"
      className={[
        "pointer-events-none z-30 flex justify-center transition-opacity duration-500",
        show ? "opacity-100" : "opacity-0",
        className,
      ].join(" ")}
    >
      <span
        title={ui.moreBelow}
        className="dv-scroll-cue inline-flex size-9 items-center justify-center rounded-full border border-gold/40 bg-ivory-light/90 text-gold-deep shadow-soft backdrop-blur-sm"
      >
        <ChevronDownIcon className="size-5" />
      </span>
    </div>
  );
}
