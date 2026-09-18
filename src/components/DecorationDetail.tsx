import { useState } from "react";
import { Button } from "./Button";
import { FullImageView } from "./FullImageView";
import { Modal } from "./Modal";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { ExpandIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { ui } from "../data/copy";
import { enquiryMessageFor, telHref, whatsappHrefFor } from "../data/site";
import type { DecorationDesign } from "../data/services";

/* The design's price broken into its lines — e.g. the setup, then each
   flower option. Rendered straight from the content in order; no label is
   special to the site. A design with a single price has nothing to break
   down, so it shows only the headline price above and this is omitted. */
function Pricing({ design }: { design: DecorationDesign }) {
  if (design.pricing.length < 2) return null;

  return (
    <section className="rounded-2xl border border-cream-dark bg-ivory-light p-5 sm:p-6">
      <h3 className="label-gold text-gold-deep">{ui.pricingHeading}</h3>

      <ul className="mt-4 flex flex-col">
        {design.pricing.map((entry, i) => (
          <li
            key={`${entry.label}-${i}`}
            className="flex items-baseline justify-between gap-4 border-b border-cream-dark py-3.5 first:pt-0 last:border-0 last:pb-0"
          >
            <p className="min-w-0 text-base font-semibold text-ink sm:text-lg">{entry.label}</p>
            {/* shrink-0 so a long label never squeezes the price onto two
                lines — the number is the point. */}
            <p className="type-price shrink-0 text-xl leading-none text-charcoal sm:text-2xl">
              {entry.price}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function DetailBody({
  design,
  index,
  context,
}: {
  design: DecorationDesign;
  index: number;
  context?: DecorationContext;
}) {
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const title = design.title || ui.decorationDesignTitle;

  /* The enquiry names the design by its reference, so it arrives saying
     exactly which one it is about even when the design has no title — and,
     opened from a package, which package it came with. */
  const designRef = design.title
    ? `the decoration design "${design.title}" (ref: ${design.id})`
    : `a decoration design (ref: ${design.id})`;
  const enquiryHref = whatsappHrefFor(
    enquiryMessageFor(context ? `${designRef}, included in the ${context.packageName}` : designRef)
  );

  /* Customisation is shown as one more line of the design's details rather
     than a section of its own. */
  const details = design.customization
    ? [...design.details, { label: ui.customizationLabel, value: design.customization }]
    : design.details;

  return (
    <>
      <div className="relative shrink-0">
        <PlaceholderPhoto
          index={index}
          src={design.image || undefined}
          alt={title}
          sizes="(min-width: 640px) 672px, 100vw"
          className="aspect-4/3 w-full sm:aspect-16/10 [@media(max-height:500px)]:max-h-[38svh]"
        />
        {design.badge && (
          <span className="absolute top-4 left-4 rounded-full bg-charcoal px-4 py-2 type-caption text-base text-ivory-light shadow-soft">
            {design.badge}
          </span>
        )}

        {/* The photo above is cropped to a fixed frame so every dialog
            opens the same shape. This gets the visitor the whole picture.
            Offered only when there is a real photograph — the drawn
            fallback tile has no full version to show. */}
        {design.image && (
          <button
            type="button"
            onClick={() => setFullImageOpen(true)}
            className="absolute right-4 bottom-4 inline-flex min-h-12 items-center gap-2 rounded-full bg-ivory-light/95 px-4 type-button text-base text-charcoal shadow-soft transition-colors hover:bg-ivory-light"
          >
            <ExpandIcon className="size-5" />
            {ui.viewFullImage}
          </button>
        )}
      </div>

      {design.image && (
        <FullImageView
          open={fullImageOpen}
          src={design.image}
          alt={title}
          onClose={() => setFullImageOpen(false)}
        />
      )}

      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div>
          {/* Opened from a package: which package this design comes with,
              as the same small gold label the dialog's sections use. */}
          {context && (
            <p className="label-gold mb-2 text-gold-deep">
              {ui.includedInPackage} {context.packageName}
            </p>
          )}
          <h2
            id={`decoration-title-${design.id}`}
            className="type-heading text-4xl leading-tight text-charcoal sm:text-5xl"
          >
            {title}
          </h2>

          {/* The headline price: the first pricing line, stated as a fixed
              amount. */}
          {design.basePrice && (
            <p className="type-price mt-5 inline-block rounded-full border border-gold/40 bg-cream/60 px-5 py-2 text-lg text-ink">
              {design.basePrice}
            </p>
          )}
        </div>

        {/* Price before prose: what it costs is the question a visitor
            opened this to answer. */}
        <Pricing design={design} />

        {design.description && (
          <p className="text-lg leading-relaxed text-ink">{design.description}</p>
        )}

        {details.length > 0 && (
          <section className="rounded-2xl border border-cream-dark bg-ivory-light p-5 sm:p-6">
            <h3 className="label-gold text-gold-deep">{ui.decorationDetails}</h3>
            <dl className="mt-4 flex flex-col gap-4">
              {details.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-cream-dark pb-4 last:border-0 last:pb-0"
                >
                  <dt className="text-base font-semibold text-ink">{row.label}</dt>
                  <dd className="text-base text-muted">{row.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {/* The same two actions as every other detail view on the site. */}
      <div className="sticky bottom-0 mt-auto flex flex-col gap-3 border-t border-cream-dark bg-ivory-light p-4 sm:flex-row sm:bg-ivory-light/95 sm:p-5 sm:backdrop-blur-md">
        <Button
          href={enquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          size="md"
          fullWidth
          icon={<WhatsAppIcon className="size-5" />}
        >
          {ui.askAboutThis}
        </Button>
        <Button href={telHref} variant="primary" size="md" fullWidth icon={<PhoneIcon className="size-5" />}>
          {ui.callToBook}
        </Button>
      </div>
    </>
  );
}

/* Where the design was opened from, when that is a package rather than the
   Decorations catalogue. */
export type DecorationContext = {
  /* e.g. "Silver Complete Wedding Combo" */
  packageName: string;
};

type Props = {
  design: DecorationDesign | null;
  /* Picks the fallback tile palette if the photo is missing or fails */
  index: number;
  context?: DecorationContext;
  onClose: () => void;
};

/* One decoration design, opened up: the photograph large, its price and
   price lines, description and details. The same dialog whether it was
   opened from the Decorations catalogue or from a package. */
export function DecorationDetail({ design, index, context, onClose }: Props) {
  /* Hold the last design on screen while the modal animates closed,
     instead of blanking instantly. Derived during render, so no extra
     paint. */
  const [shown, setShown] = useState(design);
  if (design && design !== shown) setShown(design);

  return (
    <Modal
      open={design !== null}
      onClose={onClose}
      labelledBy={shown ? `decoration-title-${shown.id}` : "decoration-title"}
      closeLabel={ui.closeDecorationDetails}
    >
      {shown && <DetailBody design={shown} index={index} context={context} />}
    </Modal>
  );
}
