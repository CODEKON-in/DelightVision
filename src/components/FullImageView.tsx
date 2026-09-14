import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "./icons";
import { ui } from "../data/copy";

type Props = {
  open: boolean;
  src: string;
  alt: string;
  onClose: () => void;
};

/* The photograph on its own — the actual image, whole.

   Everywhere else on the site a photo is object-cover inside a fixed
   aspect box, because a grid of tiles only holds together if every tile is
   the same shape. That crop is right for browsing and wrong for looking:
   a near-square stage photo loses its floor and its ceiling to a 16:10
   frame. Here the file is shown as it is, scaled down only as far as the
   window requires, with nothing cropped off any edge.

   It sits above the detail dialog (z-70 to the dialog's z-60) rather than
   replacing it, so closing this returns the visitor exactly where they
   were, one step back rather than out. */
export function FullImageView({ open, src, alt, onClose }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreFocusTo = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    restoreFocusTo.current = document.activeElement as HTMLElement | null;
    closeRef.current?.focus();

    /* Captured on the document, and stopped here: the dialog underneath
       closes on Escape too, and without this one keypress would shut both
       and drop the visitor back to the grid. */
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      event.stopPropagation();
      onClose();
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => {
      document.removeEventListener("keydown", onKeyDown, true);
      restoreFocusTo.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-70 flex items-center justify-center bg-obsidian/95 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={alt}
      onClick={onClose}
    >
      <img
        src={src}
        alt={alt}
        /* Stops a click on the photo itself from closing — only the space
           around it does, which is what a viewer expects. */
        onClick={(event) => event.stopPropagation()}
        className="max-h-full max-w-full rounded-lg object-contain shadow-modal"
      />

      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label={ui.closeFullImage}
        className="absolute top-4 right-4 inline-flex size-12 items-center justify-center rounded-full bg-ivory-light/95 text-charcoal transition-colors hover:bg-ivory-light sm:top-6 sm:right-6"
      >
        <CloseIcon className="size-6" />
      </button>
    </div>,
    document.body
  );
}
