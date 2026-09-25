import { useState } from "react";
import { AnimatedIcon } from "./AnimatedIcon";
import { Button } from "./Button";
import { Modal } from "./Modal";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";
import { serviceById, type Combo, type ComboPriceTier } from "../data/services";
import { navigate, packagePathFor } from "../lib/router";

/* One Bronze/Silver/Gold option of a combo package, opened up: what it
   costs, what it covers, and what it throws in. The same content the
   package's own page carries, in the dialog the rest of the site uses, so a
   visitor reading about a service can see the packages it belongs to
   without leaving the page. */
export type PackageTier = { combo: Combo; tier: ComboPriceTier };

function DetailBody({ combo, tier, onClose }: PackageTier & { onClose: () => void }) {
  const services = tier.includes.map((id) => serviceById[id]).filter(Boolean);
  const notice = combo.detail.notice;
  const conditions = combo.detail.conditions;

  return (
    <>
      <div className="relative shrink-0">
        <PlaceholderPhoto
          index={0}
          src={tier.image}
          alt={`${tier.name} — ${combo.name}`}
          sizes="(min-width: 640px) 672px, 100vw"
          className="aspect-4/3 w-full sm:aspect-16/9 [@media(max-height:500px)]:max-h-[38svh]"
        />
        <span className="absolute top-4 left-4 rounded-full bg-charcoal px-4 py-2 type-caption text-base text-ivory-light shadow-soft">
          {tier.name}
        </span>
      </div>

      <div className="flex flex-col gap-8 p-6 sm:p-8">
        <div>
          <p className="label-gold text-gold-deep">{combo.name}</p>

          <h2
            id={`tier-title-${combo.id}-${tier.name}`}
            className="mt-3 type-heading text-4xl leading-tight text-charcoal sm:text-5xl"
          >
            {tier.name}
          </h2>

          {tier.blurb && (
            <p className="mt-3 type-subheading text-xl text-graphite">{tier.blurb}</p>
          )}

          {tier.price && (
            <p className="type-price mt-5 inline-block rounded-full border border-gold/40 bg-cream/60 px-5 py-2 text-lg text-ink">
              {tier.price}
            </p>
          )}
        </div>

        {tier.about && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.aboutThisPackageOption}</h3>
            <p className="mt-3 text-lg leading-relaxed text-ink">{tier.about}</p>
          </section>
        )}

        {/* Everything this option covers, read from the shared services data
            by the ids the package names — never a copy of them. Each line is
            the service's own name and one-line summary. No rate against
            them: the option's price covers the lot. */}
        {services.length > 0 && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.servicesInPackage}</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {services.map((service) => (
                <li key={service.id} className="flex gap-3">
                  <AnimatedIcon immediate delay={0.1} className="mt-1 shrink-0">
                    <CheckIcon className="size-5 text-gold-deep" />
                  </AnimatedIcon>
                  <div className="min-w-0">
                    <p className="text-base font-semibold text-ink">{service.name}</p>
                    {service.description && (
                      <p className="mt-0.5 text-base text-muted">{service.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Anything this option adds that is not one of the site's services */}
        {tier.extras.length > 0 && (
          <ul className="flex flex-wrap gap-1.5">
            {tier.extras.map((label) => (
              <li
                key={label}
                className="rounded-full bg-gold/15 px-3 py-1 text-base font-semibold text-gold-deep"
              >
                {label}
              </li>
            ))}
          </ul>
        )}

        {tier.complimentaryItems.length > 0 && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.complimentaryItems}</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {tier.complimentaryItems.map((item) => (
                <li key={item.label} className="flex gap-3">
                  <AnimatedIcon immediate delay={0.1} className="mt-1 shrink-0">
                    <CheckIcon className="size-5 text-gold-deep" />
                  </AnimatedIcon>
                  <div>
                    <p className="text-base font-semibold text-ink">{item.label}</p>
                    {item.description && (
                      <p className="mt-0.5 text-base text-muted">{item.description}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {(notice || conditions) && (
          <section className="flex flex-col gap-3 rounded-2xl bg-cream/60 p-5 sm:flex-row sm:gap-6">
            {notice && (
              <div className="flex-1">
                <p className="text-base type-label text-muted">{ui.availability}</p>
                <p className="mt-1 text-base text-ink">{notice}</p>
              </div>
            )}
            {notice && conditions && (
              <div className="hidden w-px bg-cream-dark sm:block" aria-hidden="true" />
            )}
            {conditions && (
              <div className="flex-1">
                <p className="text-base type-label text-muted">{ui.goodToKnow}</p>
                <p className="mt-1 text-base text-ink">{conditions}</p>
              </div>
            )}
          </section>
        )}

        {/* The package's own page carries the same option with its service
            cards and, where it has them, its decoration designs. */}
        <button
          type="button"
          onClick={() => {
            onClose();
            navigate(packagePathFor(combo.id, tier.name));
          }}
          className="inline-flex min-h-12 items-center self-start type-nav text-base text-charcoal underline underline-offset-4 transition-colors hover:text-graphite"
        >
          {ui.viewPackagePage}
        </button>
      </div>

      <div data-dialog-actions
        className="sticky bottom-0 mt-auto flex flex-col gap-3 border-t border-cream-dark bg-ivory-light p-4 sm:flex-row sm:bg-ivory-light/95 sm:p-5 sm:backdrop-blur-md">
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
          href={whatsappHrefFor(business.whatsappMessage)}
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
  selected: PackageTier | null;
  onClose: () => void;
};

export function PackageTierDetail({ selected, onClose }: Props) {
  /* Hold the last option on screen while the dialog animates closed,
     instead of blanking instantly. */
  const [shown, setShown] = useState(selected);
  if (selected && selected !== shown) setShown(selected);

  return (
    <Modal
      open={selected !== null}
      onClose={onClose}
      labelledBy={shown ? `tier-title-${shown.combo.id}-${shown.tier.name}` : "tier-title"}
    >
      {shown && <DetailBody combo={shown.combo} tier={shown.tier} onClose={onClose} />}
    </Modal>
  );
}
