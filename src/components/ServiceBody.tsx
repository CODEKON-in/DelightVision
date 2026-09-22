<<<<<<< HEAD
import { createElement } from "react";
=======
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
import { AnimatedIcon } from "./AnimatedIcon";
import { Button } from "./Button";
import { LevelDots } from "./LevelDots";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { ServiceCard } from "./ServiceCard";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "./icons";
import { iconFor } from "./serviceIcons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";
import { categories, services, type Service } from "../data/services";

/* Everything there is to say about one service: its photo, what it is,
   what it costs, and — when it is made up of individual services — those as
   cards. Rendered in two places, and identical in both: inside the details
   dialog, and on the service's own page (`ServicePage`), which a service
   with individual services gets instead of a dialog.

   Exported as one piece so the two never drift apart. */
export function ServiceBody({
  service,
  onOpenSub,
  back,
  asPage = false,
}: {
  service: Service;
  /* Opens one of the individual services listed below, in this same dialog */
  onOpenSub: (sub: Service) => void;
  /* Set while an individual service is open: the way back to the service it
     belongs to */
  back?: { name: string; onBack: () => void };
  /* Laid out as a page rather than inside the dialog: the photo is rounded
     into the page, and the call buttons sit at the end of the content
     instead of sticking to the bottom of a scrolling panel. */
  asPage?: boolean;
}) {
  const whatsappHref = whatsappHrefFor(business.whatsappMessage);
<<<<<<< HEAD
  const icon = createElement(iconFor(service.id), {
    className: "size-6 text-charcoal",
  });
=======
  const Icon = iconFor(service.id);
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
  const category = categories.find((c) => c.id === service.category);
  const d = service.detail;
  const photoIndex = Math.max(
    services.findIndex((s) => s.id === service.id),
    0
  );

  return (
    <>
      {/* Header image with the badge pill */}
      <div
        className={`relative shrink-0 ${asPage ? "overflow-hidden rounded-2xl" : ""}`}
      >
        {/* Sample photo — set in content/*.json */}
        <PlaceholderPhoto
          index={photoIndex}
          src={service.image}
          alt={service.name}
          sizes="(min-width: 640px) 672px, 100vw"
          className="aspect-4/3 w-full sm:aspect-16/9 [@media(max-height:500px)]:max-h-[38svh]"
        />
        {d.badge && (
          <span className="absolute top-4 left-4 rounded-full bg-charcoal px-4 py-2 type-caption text-base text-ivory-light shadow-soft">
            {d.badge}
          </span>
        )}
      </div>

      <div
        className={`flex flex-col gap-8 ${asPage ? "py-8" : "p-6 sm:p-8"}`}
      >
        {/* Back to the service this one belongs to — the dialog swaps its
            contents rather than opening a second dialog on top. */}
        {back && (
          <button
            type="button"
            onClick={back.onBack}
            className="-mb-4 inline-flex min-h-12 items-center gap-2 self-start type-nav text-base text-charcoal transition-colors hover:text-graphite"
          >
            <span aria-hidden="true">&larr;</span>
            {ui.backToService} {back.name}
          </button>
        )}

        {/* Title block */}
        <div>
          <div className="flex items-center gap-3">
<<<<<<< HEAD
            <AnimatedIcon immediate>{icon}</AnimatedIcon>
=======
            <AnimatedIcon immediate>
              <Icon className="size-6 text-charcoal" />
            </AnimatedIcon>
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
            <p className="label-gold text-gold-deep">
              {category ? category.label : ""}
            </p>
          </div>

          <h2
            id={`service-title-${service.id}`}
            className="mt-3 type-heading text-4xl leading-tight text-charcoal sm:text-5xl"
          >
            {service.name}
          </h2>

          {d.subtitle && (
            <p className="mt-3 type-subheading text-xl text-graphite">
              {d.subtitle}
            </p>
          )}

          {service.price && (
            <p className="type-price mt-5 inline-block rounded-full border border-gold/40 bg-cream/60 px-5 py-2 text-lg text-ink">
              {/* Sample price — set in content/*.json */}
              {service.price}
            </p>
          )}
        </div>

<<<<<<< HEAD
        {/* The individual services this one is made up of — Candid
            Photography, Album Design and so on for Photography &
            Videography. Straight from the content, on the same cards the
            Services section uses, so a service looks the same wherever a
            visitor meets it. Tapping one swaps this dialog to that service.
            Omitted for a service that is a single thing. */}
        {service.subServices.length > 0 && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.servicesIncluded}</h3>
            <ul className="dv-orphan-grid dv-orphan-grid-2 mt-4 grid grid-cols-2 items-stretch gap-3 sm:gap-4">
              {service.subServices.map((sub, i) => (
                <li key={sub.id} className="h-full">
                  <ServiceCard
                    service={sub}
                    index={i}
                    onOpen={onOpenSub}
                    immediateIcon
                  />
                </li>
              ))}
            </ul>
=======
        {/* About */}
        {d.about && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.aboutThisService}</h3>
            <p className="mt-3 text-lg leading-relaxed text-ink">{d.about}</p>
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
          </section>
        )}

        {/* A service priced as lines rather than one rate — the same box the
            decoration designs use, and read straight from the content, so any
            label works. One line is already shown as the price above. */}
        {service.priceLines.length > 1 && (
          <section className="rounded-2xl border border-cream-dark bg-ivory-light p-5 sm:p-6">
            <h3 className="label-gold text-gold-deep">{ui.pricingHeading}</h3>
            <ul className="mt-4 flex flex-col">
              {service.priceLines.map((line) => (
                <li
                  key={line.label}
                  className="flex items-baseline justify-between gap-4 border-b border-cream-dark py-3.5 first:pt-0 last:border-0 last:pb-0"
                >
                  <p className="min-w-0 text-base font-semibold text-ink sm:text-lg">
                    {line.label}
                  </p>
                  <p className="type-price shrink-0 text-xl leading-none text-charcoal sm:text-2xl">
                    {line.price}
                  </p>
                </li>
              ))}
            </ul>
          </section>
        )}

<<<<<<< HEAD
        {/* About, kept below the list: what the service is made up of is
            what a visitor is looking for, and the paragraph reads as
            background once they have seen it. */}
        {d.about && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.aboutThisService}</h3>
            <p className="mt-3 text-lg leading-relaxed text-ink">{d.about}</p>
=======
        {/* The individual services this one is made up of — Candid
            Photography, Album Design and so on for Photography &
            Videography. Straight from the content, on the same cards the
            Services section uses, so a service looks the same wherever a
            visitor meets it. Tapping one swaps this dialog to that service.
            Omitted for a service that is a single thing. */}
        {service.subServices.length > 0 && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.servicesIncluded}</h3>
            <ul className="dv-orphan-grid mt-4 grid grid-cols-2 items-stretch gap-3 sm:gap-4">
              {service.subServices.map((sub, i) => (
                <li key={sub.id} className="h-full">
                  <ServiceCard
                    service={sub}
                    index={i}
                    onOpen={onOpenSub}
                    immediateIcon
                  />
                </li>
              ))}
            </ul>
>>>>>>> 34464e446a9a6e6edcf00c3f765c17317c75cca2
          </section>
        )}

        {/* Highlights / specs box. This and the two lists below are left
            out when the content has nothing for them — a short promotional
            service such as Tour Planning & Organizing only has its about
            text, and an empty heading would read as missing content. */}
        {d.highlights.length > 0 && (
          <section className="rounded-2xl border border-cream-dark bg-ivory-light p-5 sm:p-6">
            <h3 className="label-gold text-gold-deep">
              {ui.serviceHighlights}
            </h3>
            <dl className="mt-4 flex flex-col gap-4">
              {d.highlights.map((h) => (
                <div
                  key={h.label}
                  className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-cream-dark pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <dt className="text-base font-semibold text-ink">
                      {h.label}
                    </dt>
                    <dd className="text-base text-muted">{h.value}</dd>
                  </div>
                  <LevelDots level={h.level} />
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* Tag pills */}
        {d.tags.length > 0 && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.covers}</h3>
            <ul className="mt-3 flex flex-wrap gap-2">
              {d.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded-full border border-gold/40 bg-cream/50 px-4 py-2 text-base font-medium text-ink"
                >
                  {tag}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* What's included */}
        {d.includes.length > 0 && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.whatsIncluded}</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {d.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <AnimatedIcon immediate delay={0.1} className="mt-1 shrink-0">
                    <CheckIcon className="size-5 text-gold-deep" />
                  </AnimatedIcon>
                  <span className="text-base text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Footer info row */}
        {(d.notice || d.conditions) && (
          <section className="flex flex-col gap-3 rounded-2xl bg-cream/60 p-5 sm:flex-row sm:gap-6">
            {d.notice && (
              <div className="flex-1">
                <p className="text-base type-label text-muted">
                  {ui.availability}
                </p>
                <p className="mt-1 text-base text-ink">{d.notice}</p>
              </div>
            )}
            {d.notice && d.conditions && (
              <div
                className="hidden w-px bg-cream-dark sm:block"
                aria-hidden="true"
              />
            )}
            {d.conditions && (
              <div className="flex-1">
                <p className="text-base type-label text-muted">
                  {ui.goodToKnow}
                </p>
                <p className="mt-1 text-base text-ink">{d.conditions}</p>
              </div>
            )}
          </section>
        )}
      </div>

      {/* In the dialog the booking buttons stay reachable while it scrolls;
          on a page they simply end the content. */}
      <div
        className={
          asPage
            ? "flex flex-col gap-3 sm:flex-row"
            : "sticky bottom-0 mt-auto flex flex-col gap-3 border-t border-cream-dark bg-ivory-light p-4 sm:flex-row sm:bg-ivory-light/95 sm:p-5 sm:backdrop-blur-md"
        }
      >
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
