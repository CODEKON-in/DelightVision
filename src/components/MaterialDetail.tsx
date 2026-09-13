import { useState } from "react";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { ui } from "../data/copy";
import { enquiryMessageFor, telHref, whatsappHrefFor } from "../data/site";
import type { Material } from "../data/services";

function DetailBody({ material, index }: { material: Material; index: number }) {
  const enquiryHref = whatsappHrefFor(enquiryMessageFor(`"${material.name}"`));
  const { minimumOrder, extraCharges, tiers, examples } = material.priceStructure;
  const hasPriceStructure = Boolean(minimumOrder) || extraCharges.length > 0 || tiers.length > 0 || examples.length > 0;

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
      </div>

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

        {hasPriceStructure && (
          <section className="rounded-2xl border border-cream-dark bg-ivory-light p-5 sm:p-6">
            <h3 className="label-gold text-gold-deep">{ui.pricingDetailsHeading}</h3>

            <div className="mt-4 flex flex-col gap-5">
              {tiers.length > 0 && (
                <div>
                  <h4 className="text-sm type-label text-muted">
                    {ui.volumePricingLabel}
                  </h4>
                  <dl className="mt-2 flex flex-col gap-2">
                    {tiers.map((tier) => (
                      <div
                        key={tier.range}
                        className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-cream-dark pb-2 last:border-0 last:pb-0"
                      >
                        <dt className="text-base text-ink">
                          {tier.range}
                          {tier.quantity && <span className="mt-0.5 block text-sm text-muted">{tier.quantity}</span>}
                        </dt>
                        <dd className="type-price text-base text-charcoal">{tier.price}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {minimumOrder && (
                <p className="text-base text-ink">
                  <span className="font-semibold">{ui.minimumOrderLabel}:</span> {minimumOrder}
                </p>
              )}

              {extraCharges.length > 0 && (
                <div>
                  <h4 className="text-sm type-label text-muted">
                    {ui.extraChargesLabel}
                  </h4>
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
                  <h4 className="text-sm type-label text-muted">
                    {ui.costExamplesLabel}
                  </h4>
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
