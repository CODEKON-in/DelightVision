import { useState } from "react";
import { AnimatedIcon } from "../components/AnimatedIcon";
import { Button } from "../components/Button";
import { FullImageView } from "../components/FullImageView";
import { LevelDots } from "../components/LevelDots";
import { Modal } from "../components/Modal";
import { PlaceholderPhoto } from "../components/PlaceholderPhoto";
import { ExpandIcon, PhoneIcon, WhatsAppIcon } from "../components/icons";
import { iconFor } from "../components/serviceIcons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";
import { combos, serviceById, type Combo } from "../data/services";

function DetailBody({ combo }: { combo: Combo }) {
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const whatsappHref = whatsappHrefFor(business.whatsappMessage);
  const d = combo.detail;
  const photoIndex = combos.findIndex((c) => c.id === combo.id);

  return (
    <>
      <div className="relative shrink-0">
        {/* DUMMY photo — see src/data/services.ts */}
        <PlaceholderPhoto
          index={photoIndex}
          src={combo.image}
          alt={combo.name}
          sizes="(min-width: 640px) 672px, 100vw"
          className="aspect-4/3 w-full sm:aspect-16/9"
        />
        <span className="absolute top-4 left-4 rounded-full bg-charcoal px-4 py-2 type-caption text-base text-ivory-light shadow-soft">
          {d.badge}
        </span>

        {/* The photo above is cropped to a fixed frame so every dialog opens
            the same shape; this gets the visitor the whole picture. */}
        {combo.image && (
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

      {combo.image && (
        <FullImageView
          open={fullImageOpen}
          src={combo.image}
          alt={combo.name}
          onClose={() => setFullImageOpen(false)}
        />
      )}

      <div className="flex flex-col gap-7 p-6 sm:p-8">
        <div>
          <h2
            id={`combo-title-${combo.id}`}
            className="type-heading text-4xl leading-tight break-words text-charcoal sm:text-5xl"
          >
            {combo.name}
          </h2>

          <p className="mt-3 type-subheading text-xl text-graphite">{d.subtitle}</p>

          <p className="type-price mt-5 inline-block rounded-full border border-gold/40 bg-cream/60 px-5 py-2 text-lg text-ink">
            {/* DUMMY PRICE */}
            {combo.price}
          </p>
        </div>

        {/* Price before prose, the same way a decoration reads: what the
            package costs at each level is the question this was opened to
            answer, and the description explains the thing whose price has
            just been seen. One row per level — name, what that level adds,
            and the price against it — so the three compare down a single
            column instead of across three paragraphs. */}
        {combo.priceTiers.length > 0 && (
          <section className="rounded-2xl border border-cream-dark bg-ivory-light p-5 sm:p-6">
            <h3 className="label-gold text-gold-deep">{ui.pricingDetailsHeading}</h3>
            <ul className="mt-4 flex flex-col">
              {combo.priceTiers.map((tier) => (
                <li
                  key={tier.name}
                  className="flex items-baseline justify-between gap-4 border-b border-cream-dark py-3.5 first:pt-0 last:border-0 last:pb-0"
                >
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-ink sm:text-lg">{tier.name}</p>
                    {tier.blurb && (
                      <p className="mt-0.5 text-sm text-muted sm:text-base">{tier.blurb}</p>
                    )}
                  </div>
                  {/* shrink-0 so a long blurb never squeezes the price onto
                      two lines — the number is the point. */}
                  <p className="type-price shrink-0 text-xl leading-none text-charcoal sm:text-2xl">
                    {tier.price}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h3 className="label-gold text-gold-deep">{ui.aboutThisPackage}</h3>
          <p className="mt-3 text-lg leading-relaxed text-ink">{d.about}</p>
        </section>

        {/* The bundled services, each with its own one-line summary */}
        <section>
          <h3 className="label-gold text-gold-deep">{ui.servicesInPackage}</h3>
          <ul className="mt-3 flex flex-col gap-3">
            {combo.includes.map((id) => {
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
          </ul>
        </section>

        <section className="rounded-2xl border border-cream-dark bg-ivory-light p-5 sm:p-6">
          <h3 className="label-gold text-gold-deep">{ui.packageHighlights}</h3>
          <dl className="mt-4 flex flex-col gap-4">
            {d.highlights.map((h) => (
              <div
                key={h.label}
                className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-cream-dark pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <dt className="text-base font-semibold text-ink">{h.label}</dt>
                  <dd className="text-base text-muted">{h.value}</dd>
                </div>
                <LevelDots level={h.level} />
              </div>
            ))}
          </dl>
        </section>

        <section className="flex flex-col gap-3 rounded-2xl bg-cream/60 p-5 sm:flex-row sm:gap-6">
          <div className="flex-1">
            <p className="text-base type-label text-muted">
              {ui.availability}
            </p>
            <p className="mt-1 text-base text-ink">{d.notice}</p>
          </div>
          <div className="hidden w-px bg-cream-dark sm:block" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-base type-label text-muted">
              {ui.goodToKnow}
            </p>
            <p className="mt-1 text-base text-ink">{d.conditions}</p>
          </div>
        </section>
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
          href={whatsappHref}
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
  combo: Combo | null;
  onClose: () => void;
};

export function ComboDetail({ combo, onClose }: Props) {
  /* Keep the last package on screen while the modal animates closed */
  const [shown, setShown] = useState(combo);
  if (combo && combo !== shown) setShown(combo);

  return (
    <Modal
      open={combo !== null}
      onClose={onClose}
      labelledBy={shown ? `combo-title-${shown.id}` : "combo-title"}
    >
      {shown && <DetailBody combo={shown} />}
    </Modal>
  );
}
