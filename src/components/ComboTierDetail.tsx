import { useState } from "react";
import { AnimatedIcon } from "./AnimatedIcon";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { PhoneIcon, WhatsAppIcon } from "./icons";
import { iconFor } from "./serviceIcons";
import { ui } from "../data/copy";
import { enquiryMessageFor, telHref, whatsappHrefFor } from "../data/site";
import { serviceById, type Combo, type ComboPriceTier } from "../data/services";

const TIER_ACCENTS: Record<string, { bg: string; text: string }> = {
  Bronze: { bg: "#a9713f", text: "#fff7ec" },
  Silver: { bg: "#93938d", text: "#fff" },
  Gold: { bg: "#d4af37", text: "#2a1f08" },
};

function tierAccent(name: string) {
  return TIER_ACCENTS[name] ?? { bg: "#3a3632", text: "#fff" };
}

function DetailBody({
  combo,
  tier,
  index,
}: {
  combo: Combo;
  tier: ComboPriceTier;
  index: number;
}) {
  const enquiryHref = whatsappHrefFor(
    enquiryMessageFor(`the ${tier.name} option of "${combo.name}"`)
  );
  const accent = tierAccent(tier.name);

  return (
    <>
      <div className="relative shrink-0">
        {/* DUMMY photo — reuses the combo's own photo, see src/data/services.ts */}
        <PlaceholderPhoto
          index={index}
          src={combo.image || undefined}
          alt={`${combo.name} — ${tier.name}`}
          sizes="(min-width: 640px) 672px, 100vw"
          className="aspect-4/3 w-full sm:aspect-16/10"
        />
        <span
          className="absolute top-4 left-4 rounded-full px-4 py-2 type-caption text-base shadow-soft"
          style={{ background: accent.bg, color: accent.text }}
        >
          {tier.name}
        </span>
      </div>

      <div className="flex flex-col gap-6 p-6 sm:p-8">
        <div>
          <h2
            id={`combo-tier-title-${combo.id}-${tier.name}`}
            className="type-heading text-4xl leading-tight text-charcoal sm:text-5xl"
          >
            {combo.name}
          </h2>

          <p className="mt-2 type-subheading text-xl text-graphite">{tier.name} package</p>

          {tier.price && (
            <p className="type-price mt-5 inline-block rounded-full border border-gold/40 bg-cream/60 px-5 py-2 text-lg text-ink">
              {tier.price}
            </p>
          )}
        </div>

        {(tier.about || tier.blurb) && (
          <p className="text-lg leading-relaxed text-ink">{tier.about || tier.blurb}</p>
        )}

        {(tier.includes.length > 0 || tier.extras.length > 0) && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.servicesInPackage}</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {tier.includes.map((id) => {
                const service = serviceById[id];
                const Icon = iconFor(id);

                return (
                  <li
                    key={id}
                    className="flex items-start gap-3 rounded-2xl border border-cream-dark bg-ivory-light p-4"
                  >
                    <AnimatedIcon
                      immediate
                      className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl bg-cream text-charcoal ring-1 ring-gold/40"
                    >
                      <Icon className="size-5" />
                    </AnimatedIcon>
                    <div className="min-w-0">
                      <p className="text-base font-semibold break-words text-ink">
                        {service.name}
                      </p>
                      <p className="mt-0.5 text-base break-words text-muted">
                        {service.description}
                      </p>
                    </div>
                  </li>
                );
              })}

              {/* Tier-specific add-ons that aren't part of the main service
                  catalog (e.g. "Tour Photography") — kept visually distinct
                  with a gold tint, same as the card's chips. */}
              {tier.extras.map((label) => (
                <li
                  key={label}
                  className="flex items-center gap-3 rounded-2xl border border-gold/30 bg-gold/10 p-4"
                >
                  <p className="text-base font-semibold break-words text-gold-deep">{label}</p>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <div className="sticky bottom-0 mt-auto flex flex-col gap-3 border-t border-cream-dark bg-ivory-light p-4 sm:flex-row sm:bg-ivory-light/95 sm:p-5 sm:backdrop-blur-md">
        <Button
          href={telHref}
          variant="primary"
          size="md"
          fullWidth
          icon={<PhoneIcon className="size-5" />}
        >
          {ui.callToBook}
        </Button>
        <Button
          href={enquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          size="md"
          fullWidth
          icon={<WhatsAppIcon className="size-5" />}
        >
          {ui.whatsapp}
        </Button>
      </div>
    </>
  );
}

type Props = {
  combo: Combo;
  tier: ComboPriceTier | null;
  /* Picks the fallback tile palette if the photo is missing or fails */
  index: number;
  onClose: () => void;
};

/* One Bronze/Silver/Gold tier, opened up — bigger photo, the tier's own
   price and "about" paragraph, and every service (plus extras) it
   includes. The same detail-dialog pattern the rest of the site uses. */
export function ComboTierDetail({ combo, tier, index, onClose }: Props) {
  /* Hold the last tier on screen while the modal animates closed, instead
     of blanking instantly. Derived during render, so no extra paint. */
  const [shown, setShown] = useState(tier);
  if (tier && tier !== shown) setShown(tier);

  return (
    <Modal
      open={tier !== null}
      onClose={onClose}
      labelledBy={shown ? `combo-tier-title-${combo.id}-${shown.name}` : "combo-tier-title"}
    >
      {shown && <DetailBody combo={combo} tier={shown} index={index} />}
    </Modal>
  );
}
