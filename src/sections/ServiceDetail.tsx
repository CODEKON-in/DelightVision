import { useState } from "react";
import { AnimatedIcon } from "../components/AnimatedIcon";
import { Button } from "../components/Button";
import { LevelDots } from "../components/LevelDots";
import { Modal } from "../components/Modal";
import { PlaceholderPhoto } from "../components/PlaceholderPhoto";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "../components/icons";
import { iconFor } from "../components/serviceIcons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";
import { categories, services, type Service } from "../data/services";

function DetailBody({ service }: { service: Service }) {
  const whatsappHref = whatsappHrefFor(business.whatsappMessage);
  const Icon = iconFor(service.id);
  const category = categories.find((c) => c.id === service.category);
  const d = service.detail;
  const photoIndex = services.findIndex((s) => s.id === service.id);

  return (
    <>
      {/* Header image with the badge pill */}
      <div className="relative shrink-0">
        {/* DUMMY photo — see src/data/services.ts */}
        <PlaceholderPhoto
          index={photoIndex}
          src={service.image}
          alt={service.name}
          sizes="(min-width: 640px) 672px, 100vw"
          className="aspect-4/3 w-full sm:aspect-16/9"
        />
        <span className="absolute top-4 left-4 rounded-full bg-plum px-4 py-2 text-base font-bold tracking-[0.14em] text-ivory-light uppercase shadow-soft">
          {d.badge}
        </span>
      </div>

      <div className="flex flex-col gap-8 p-6 sm:p-8">
        {/* Title block */}
        <div>
          <div className="flex items-center gap-3">
            <AnimatedIcon immediate>
              <Icon className="size-6 text-plum" />
            </AnimatedIcon>
            <p className="label-gold text-gold-deep">{category ? category.label : ""}</p>
          </div>

          <h2
            id={`service-title-${service.id}`}
            className="mt-3 font-serif text-4xl leading-tight font-semibold text-plum sm:text-5xl"
          >
            {service.name}
          </h2>

          <p className="mt-3 font-serif text-xl text-plum-light italic">{d.subtitle}</p>

          <p className="nums-lining mt-5 inline-block rounded-full border border-gold/40 bg-cream/60 px-5 py-2 text-lg font-semibold text-ink">
            {/* DUMMY PRICE */}
            {service.price}
          </p>
        </div>

        {/* About */}
        <section>
          <h3 className="label-gold text-gold-deep">{ui.aboutThisService}</h3>
          <p className="mt-3 text-lg leading-relaxed text-ink">{d.about}</p>
        </section>

        {/* Highlights / specs box */}
        <section className="rounded-2xl border border-cream-dark bg-ivory-light p-5 sm:p-6">
          <h3 className="label-gold text-gold-deep">{ui.serviceHighlights}</h3>
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

        {/* Tag pills */}
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

        {/* What's included */}
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

        {/* Footer info row */}
        <section className="flex flex-col gap-3 rounded-2xl bg-cream/60 p-5 sm:flex-row sm:gap-6">
          <div className="flex-1">
            <p className="text-base font-semibold tracking-wide text-muted uppercase">{ui.availability}</p>
            <p className="mt-1 text-base text-ink">{d.notice}</p>
          </div>
          <div className="hidden w-px bg-cream-dark sm:block" aria-hidden="true" />
          <div className="flex-1">
            <p className="text-base font-semibold tracking-wide text-muted uppercase">{ui.goodToKnow}</p>
            <p className="mt-1 text-base text-ink">{d.conditions}</p>
          </div>
        </section>
      </div>

      {/* Booking buttons stay reachable while the modal scrolls */}
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
  service: Service | null;
  onClose: () => void;
};

export function ServiceDetail({ service, onClose }: Props) {
  /* Hold on to the last service so its content stays on screen while the
     modal plays its closing animation, instead of blanking instantly.
     Derived during render, so there is no extra paint. */
  const [shown, setShown] = useState(service);
  if (service && service !== shown) setShown(service);

  return (
    <Modal
      open={service !== null}
      onClose={onClose}
      labelledBy={shown ? `service-title-${shown.id}` : "service-title"}
    >
      {shown && <DetailBody service={shown} />}
    </Modal>
  );
}
