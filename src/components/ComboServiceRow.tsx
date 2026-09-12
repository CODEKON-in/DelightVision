import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { WhatsAppIcon } from "./icons";
import { ui } from "../data/copy";
import { enquiryMessageFor, whatsappHrefFor } from "../data/site";
import type { Service } from "../data/services";

type Props = {
  service: Service;
  /* Picks the fallback tile palette if the photo is missing or fails */
  index: number;
  onViewDetails: () => void;
};

/* One row of a combo card's included-services listing, in the same
   product-listing pattern the Materials page uses — a photo on the left,
   name/description/price stacked on the right, and two actions: "View
   Details" opens that service's own detail dialog (the same one the main
   Services section uses), and a WhatsApp enquiry link already names which
   service it's about.

   Sized compactly on purpose: a combo card is only ever one of 2-3 columns
   inside the Combo Packages grid (roughly 300-350px wide), never a full
   page width like the Materials list this pattern is borrowed from — the
   larger sizing that works there overflows a column this narrow. */
export function ComboServiceRow({ service, index, onViewDetails }: Props) {
  const enquiryHref = whatsappHrefFor(enquiryMessageFor(`"${service.name}"`));

  return (
    <div className="flex gap-3 rounded-xl px-2 py-4 transition-colors hover:bg-cream/50 -mx-2">
      <div className="relative shrink-0">
        {/* DUMMY photo — see src/data/services.ts */}
        <PlaceholderPhoto
          index={index}
          src={service.image || undefined}
          alt={service.name}
          sizes="80px"
          className="size-16 rounded-lg sm:size-20"
        />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h4 className="text-sm leading-snug font-semibold break-words text-charcoal sm:text-base">
          {service.name}
        </h4>

        {service.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-snug break-words text-muted sm:text-sm">
            {service.description}
          </p>
        )}

        {service.price && (
          <p className="nums-lining mt-1.5 text-base leading-none font-bold break-words text-charcoal sm:text-lg">
            {service.price}
          </p>
        )}

        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={onViewDetails}
            className="inline-flex min-h-8 items-center rounded-full border-2 border-charcoal/25 bg-ivory-light px-3 py-1 text-xs font-semibold text-charcoal transition-colors hover:border-charcoal/50 hover:bg-cream/60"
          >
            {ui.viewDetailsShort}
          </button>

          <a
            href={enquiryHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-8 items-center gap-1.5 rounded-full bg-whatsapp px-3 py-1 text-xs font-semibold text-white transition-colors hover:bg-whatsapp-dark"
          >
            <WhatsAppIcon className="size-3.5" />
            {ui.askAboutThis}
          </a>
        </div>
      </div>
    </div>
  );
}
