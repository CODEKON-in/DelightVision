import { useState } from "react";
import { MaterialDetail } from "./MaterialDetail";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { WhatsAppIcon } from "./icons";
import { ui } from "../data/copy";
import { enquiryMessageFor, whatsappHrefFor } from "../data/site";
import type { Material } from "../data/services";

type Props = {
  material: Material;
  /* Picks the fallback tile palette if the photo is missing or fails */
  index: number;
};

/* One row of a product-style listing — a bigger square photo on the left,
   name/note/specs/price stacked on the right, and two actions: "View
   Details" opens the same kind of detail dialog the rest of the site uses
   (bigger photo, full note, every spec), and a WhatsApp enquiry link
   stands in for the "Add to cart" a real listing would have — this is a
   lead-gen site, not a checkout, so the honest equivalent of "add to cart"
   is "ask about this". Shared by the materials list on the Decorations
   page and the one inside the service detail popup. */
export function MaterialCard({ material, index }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);
  const enquiryHref = whatsappHrefFor(enquiryMessageFor(`"${material.name}"`));

  return (
    <div className="flex gap-4 py-5 sm:gap-6 sm:py-6">
      <div className="relative shrink-0">
        <PlaceholderPhoto
          index={index}
          src={material.image || undefined}
          alt={material.name}
          sizes="(min-width: 640px) 176px, 128px"
          className="size-32 rounded-xl sm:size-44"
        />
        {material.tag && (
          <span className="absolute top-2 left-2 rounded-md bg-charcoal px-2 py-1 type-caption text-[0.7rem] text-ivory-light shadow-soft sm:text-xs">
            {material.tag}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="type-title text-lg leading-snug text-charcoal sm:text-2xl">{material.name}</h3>

        {material.note && (
          <p className="mt-1.5 text-sm leading-snug text-muted sm:mt-2 sm:text-lg">{material.note}</p>
        )}

        {material.specs.length > 0 && (
          <dl className="mt-2 flex flex-col gap-0.5 sm:mt-3 sm:gap-1">
            {material.specs.map((spec) => (
              <div key={spec.label} className="flex flex-wrap gap-x-1.5 text-xs sm:text-base">
                <dt className="font-semibold text-charcoal">{spec.label}:</dt>
                <dd className="text-muted">{spec.value}</dd>
              </div>
            ))}
          </dl>
        )}

        {material.priceValue && (
          <p className="type-price mt-2.5 text-2xl leading-none text-charcoal sm:mt-4 sm:text-4xl">
            {material.priceValue}
          </p>
        )}

        <div className="mt-3 flex flex-wrap gap-2 sm:mt-4 sm:gap-3">
          <button
            type="button"
            onClick={() => setDetailOpen(true)}
            className="inline-flex min-h-10 items-center rounded-full border-2 border-charcoal/25 bg-ivory-light px-4 py-2 type-button text-sm text-charcoal transition-colors hover:border-charcoal/50 hover:bg-cream/60 sm:min-h-12 sm:px-5 sm:text-base"
          >
            {ui.viewDetailsShort}
          </button>

          <a
            href={enquiryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 items-center gap-2 rounded-full bg-whatsapp px-4 py-2 type-button text-sm text-white transition-colors hover:bg-whatsapp-dark sm:min-h-12 sm:px-5 sm:text-base"
          >
            <WhatsAppIcon className="size-4 sm:size-5" />
            {ui.askAboutThis}
          </a>
        </div>
      </div>

      <MaterialDetail
        material={detailOpen ? material : null}
        index={index}
        onClose={() => setDetailOpen(false)}
      />
    </div>
  );
}
