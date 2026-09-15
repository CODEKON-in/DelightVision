import { useState } from "react";
import { DecorationDetail, type DecorationContext } from "./DecorationDetail";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { ui } from "../data/copy";
import type { DecorationDesign } from "../data/services";

type Props = {
  design: DecorationDesign;
  /* Position in the grid — picks the fallback tile palette if the photo is
     missing, and names an untitled design for screen readers. */
  index: number;
  /* Set when the grid is one package's designs — the dialog then says so. */
  context?: DecorationContext;
};

/* One decoration design in the Decorations grid: the photograph alone, with
   its badge. The whole tile is the button that opens the design's detail
   dialog, where its price, description and details live — the page is for
   browsing by eye. */
export function DecorationCard({ design, index, context }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const label = design.title || `${ui.decorationDesignTitle} ${index + 1}`;

  return (
    <>
      <button
        type="button"
        onClick={() => setDetailOpen(true)}
        aria-label={label}
        className="group relative block w-full overflow-hidden rounded-2xl border border-cream-dark bg-ivory-light shadow-soft transition-shadow duration-300 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
      >
        <PlaceholderPhoto
          index={index}
          src={design.image || undefined}
          alt={label}
          sizes="(min-width: 1024px) 24vw, (min-width: 640px) 30vw, 45vw"
          className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.04]"
        />
        {design.badge && (
          <span className="absolute top-3 left-3 rounded-md bg-charcoal px-2.5 py-1 type-caption text-xs text-ivory-light shadow-soft">
            {design.badge}
          </span>
        )}
      </button>

      <DecorationDetail
        design={detailOpen ? design : null}
        index={index}
        context={context}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
