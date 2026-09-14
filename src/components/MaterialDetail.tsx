import { useState } from "react";
import { Button } from "./Button";
import { FullImageView } from "./FullImageView";
import { Modal } from "./Modal";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { ExpandIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { ui } from "../data/copy";
import { enquiryMessageFor, telHref, whatsappHrefFor } from "../data/site";
import type { Material } from "../data/services";

/* Every tier is written as "Size — what it covers". Splitting the two lets
   the size carry the weight and the coverage sit under it as the
   explanation, instead of one long line the eye has to parse before it
   reaches the price. A tier written without the dash is left whole. */
function splitTier(range: string): { size: string; covers: string } {
  const i = range.indexOf("—");
  if (i === -1) return { size: range, covers: "" };
  return { size: range.slice(0, i).trim(), covers: range.slice(i + 1).trim() };
}

/* What it costs, stated plainly.

   This is the first thing under the name, ahead of the description: a
   visitor deciding whether to call wants the number before the prose.
   Each option is one row — size, what that size covers, and the price
   against it — so three options can be compared down a single column. */
function Pricing({ material }: { material: Material }) {
  const { minimumOrder, extraCharges, tiers, examples } = material.priceStructure;
  if (!minimumOrder && extraCharges.length === 0 && tiers.length === 0 && examples.length === 0) {
    return null;
  }

  return (
    <section className="rounded-2xl border border-cream-dark bg-ivory-light p-5 sm:p-6">
      <h3 className="label-gold text-gold-deep">{ui.pricingDetailsHeading}</h3>

      {tiers.length > 0 && (
        <ul className="mt-4 flex flex-col">
          {tiers.map((tier) => {
            const { size, covers } = splitTier(tier.range);
            return (
              <li
                key={tier.range}
                className="flex items-baseline justify-between gap-4 border-b border-cream-dark py-3.5 first:pt-0 last:border-0 last:pb-0"
              >
                <div className="min-w-0">
                  <p className="text-base font-semibold text-ink sm:text-lg">{size}</p>
                  {covers && <p className="mt-0.5 text-sm text-muted sm:text-base">{covers}</p>}
                  {tier.quantity && (
                    <p className="mt-0.5 text-sm text-muted sm:text-base">{tier.quantity}</p>
                  )}
                </div>
                {/* shrink-0 so a long coverage line never squeezes the
                    price onto two lines — the number is the point. */}
                <p className="type-price shrink-0 text-xl leading-none text-charcoal sm:text-2xl">
                  {tier.price}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {(minimumOrder || extraCharges.length > 0 || examples.length > 0) && (
        <div className="mt-5 flex flex-col gap-4 border-t border-cream-dark pt-5">
          {minimumOrder && (
            <p className="text-base text-ink">
              <span className="font-semibold">{ui.minimumOrderLabel}:</span> {minimumOrder}
            </p>
          )}

          {extraCharges.length > 0 && (
            <div>
              <h4 className="text-sm type-label text-muted">{ui.extraChargesLabel}</h4>
              <ul className="mt-2 flex flex-col gap-1">
                {extraCharges.map((charge) => (
                  <li key={charge} className="text-base text-ink">
                    {charge}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {examples.length > 0 && (
            <div>
              <h4 className="text-sm type-label text-muted">{ui.costExamplesLabel}</h4>
              <dl className="mt-2 flex flex-col gap-2">
                {examples.map((example) => (
                  <div
                    key={example.label}
                    className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-cream-dark pb-2 last:border-0 last:pb-0"
                  >
                    <dt className="text-base text-ink">{example.label}</dt>
                    <dd className="type-price text-base text-charcoal">{example.amount}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

function DetailBody({ material, index }: { material: Material; index: number }) {
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const enquiryHref = whatsappHrefFor(enquiryMessageFor(`"${material.name}"`));

  return (
    <>
      <div className="relative shrink-0">
        <PlaceholderPhoto
          index={index}
          src={material.image || undefined}
          alt={material.name}
          sizes="(min-width: 640px) 672px, 100vw"
          className="aspect-4/3 w-full sm:aspect-16/10"
        />
        {material.tag && (
          <span className="absolute top-4 left-4 rounded-full bg-charcoal px-4 py-2 type-caption text-base text-ivory-light shadow-soft">
            {material.tag}
          </span>
        )}

        {/* The photo above is cropped to a fixed frame so every dialog
            opens the same shape. This gets the visitor the whole picture.
            Offered only when there is a real photograph — the drawn
            fallback tile has no full version to show. */}
        {material.image && (
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

      {material.image && (
        <FullImageView
          open={fullImageOpen}
          src={material.image}
          alt={material.name}
          onClose={() => setFullImageOpen(false)}
        />
      )}

      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div>
          <h2
            id={`material-title-${material.id}`}
            className="type-heading text-4xl leading-tight text-charcoal sm:text-5xl"
          >
            {material.name}
          </h2>

          {material.price && (
            <p className="type-price mt-5 inline-block rounded-full border border-gold/40 bg-cream/60 px-5 py-2 text-lg text-ink">
              {material.price}
            </p>
          )}
        </div>

        {/* Price before prose: what it costs is the question a visitor
            opened this to answer, and the description explains the thing
            they have just seen the price of. */}
        <Pricing material={material} />

        {material.details ? (
          <p className="text-lg leading-relaxed text-ink">{material.details}</p>
        ) : (
          material.note && <p className="text-lg leading-relaxed text-ink">{material.note}</p>
        )}

        {material.specs.length > 0 && (
          <section className="rounded-2xl border border-cream-dark bg-ivory-light p-5 sm:p-6">
            <h3 className="label-gold text-gold-deep">{ui.decorationDetails}</h3>
            <dl className="mt-4 flex flex-col gap-4">
              {material.specs.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-cream-dark pb-4 last:border-0 last:pb-0"
                >
                  <dt className="text-base font-semibold text-ink">{spec.label}</dt>
                  <dd className="text-base text-muted">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {/* The same two actions as every other detail view on the site. The
          WhatsApp message already names this material, so the enquiry
          arrives saying which one it is about. */}
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

type Props = {
  material: Material | null;
  /* Picks the fallback tile palette if the photo is missing or fails */
  index: number;
  onClose: () => void;
};

/* A single material, opened up: bigger photo, full note, and every spec —
   the same detail-dialog pattern the rest of the site uses for a
   decoration design or a whole service. */
export function MaterialDetail({ material, index, onClose }: Props) {
  /* Hold the last material on screen while the modal animates closed,
     instead of blanking instantly. Derived during render, so no extra
     paint. */
  const [shown, setShown] = useState(material);
  if (material && material !== shown) setShown(material);

  return (
    <Modal
      open={material !== null}
      onClose={onClose}
      labelledBy={shown ? `material-title-${shown.id}` : "material-title"}
    >
      {shown && <DetailBody material={shown} index={index} />}
    </Modal>
  );
}
