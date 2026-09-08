import { useState } from "react";
import { Button } from "../components/Button";
import { Flourish } from "../components/Flourish";
import { PlaceholderPhoto } from "../components/PlaceholderPhoto";
import { Reveal } from "../components/Reveal";
import { PhoneIcon, WhatsAppIcon } from "../components/icons";
import { ui } from "../data/copy";
import { business, enquiryMessageFor, telHref, whatsappHrefFor } from "../data/site";
import { services, type Decoration, type DecorationType } from "../data/services";
import { HOME_PATH, navigate } from "../lib/router";
import { DecorationDetail } from "../sections/DecorationDetail";
import { ServiceDetail } from "../sections/ServiceDetail";

/* Back to where the visitor came from. Written out in words rather than
   left to the browser's back button, and repeated at the foot of the page so
   it is there whichever end they finish at. */
function BackToServices({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => navigate(`${HOME_PATH}#services`)}
      className={`inline-flex min-h-12 items-center gap-2 text-base font-semibold text-plum transition-colors hover:text-plum-light ${className}`}
    >
      <span aria-hidden="true">&larr;</span>
      {ui.backToServices}
    </button>
  );
}

type GroupProps = {
  type: DecorationType;
  /* Keeps the placeholder tile colours varying down the page rather than
     restarting at every heading. */
  offset: number;
  onOpen: (decoration: Decoration, index: number) => void;
};

/* One decoration type: its heading, then the designs it holds. Everything is
   on the page at once — there is nothing to open or filter, so there is
   nothing to work out. */
function DecorationGroup({ type, offset, onOpen }: GroupProps) {
  return (
    <section className="border-t border-cream-dark pt-10 sm:pt-12">
      <Reveal>
        <h2 className="font-serif text-[clamp(1.6rem,5.5vw,2.25rem)] leading-tight font-semibold text-plum">
          {type.name}
        </h2>
        {type.description && (
          <p className="mt-2 max-w-2xl text-lg text-muted">{type.description}</p>
        )}
      </Reveal>

      {type.items.length === 0 ? (
        /* Nothing photographed for this type yet. Saying so plainly, with the
           same way to ask about it, beats an empty space. */
        <Reveal className="mt-6">
          <p className="max-w-xl text-lg text-muted">{ui.noDesignsYet}</p>
          <Button
            href={whatsappHrefFor(enquiryMessageFor(type.name.toLowerCase()))}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            size="md"
            className="mt-5"
            icon={<WhatsAppIcon className="size-5" />}
          >
            {ui.enquireAboutThis}
          </Button>
        </Reveal>
      ) : (
        <Reveal
          as="ul"
          stagger={0.07}
          className="mt-8 grid grid-cols-1 gap-8 xs:grid-cols-2 lg:grid-cols-3"
        >
          {type.items.map((decoration, i) => (
            <li key={decoration.id}>
              <button
                type="button"
                onClick={() => onOpen(decoration, offset + i)}
                className="group block w-full text-left"
              >
                <PlaceholderPhoto
                  index={offset + i}
                  src={decoration.images[0]}
                  alt={decoration.name}
                  sizes="(min-width: 1024px) 30vw, (min-width: 400px) 45vw, 90vw"
                  className="aspect-4/3 w-full rounded-2xl ring-1 ring-cream-dark transition-transform duration-500 motion-safe:group-hover:scale-[1.02]"
                />

                <h3 className="mt-4 font-serif text-2xl leading-tight font-semibold text-plum transition-colors group-hover:text-plum-light">
                  {decoration.name}
                </h3>

                {decoration.price && (
                  <p className="nums-lining mt-1 text-base text-muted">{decoration.price}</p>
                )}
              </button>
            </li>
          ))}
        </Reveal>
      )}
    </section>
  );
}

export function DecorationsPage() {
  const [open, setOpen] = useState<{ decoration: Decoration; index: number } | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  /* The page is the decoration service's showcase. If the content ever
     stops carrying one, the page says so rather than rendering an empty
     shell. */
  const service = services.find((item) => item.showcase);
  const showcase = service?.showcase;

  if (!service || !showcase) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
        <p className="text-lg text-muted">{ui.noDecorationsYet}</p>
        <BackToServices className="mt-6" />
      </div>
    );
  }

  /* Each group is told how many designs came before it, so the fallback tile
     colours keep changing down the page instead of every group restarting
     from the same one. Worked out up front rather than counted during
     render. */
  const groups = showcase.types.map((type, i) => ({
    type,
    offset: showcase.types.slice(0, i).reduce((n, before) => n + before.items.length, 0),
  }));

  return (
    <>
      {/* The same royal band the main page opens with, so arriving here
          reads as the next page of the same site rather than a new one. */}
      <section className="relative overflow-hidden bg-royal py-[clamp(3rem,8vw,4.5rem)]">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal immediate>
            <p className="label-gold text-gold-soft">{service.detail.badge}</p>

            <h1 className="mt-3 font-serif text-[clamp(2.25rem,8vw,3.5rem)] leading-tight font-semibold text-ivory-light">
              {ui.decorationsTitle}
            </h1>

            <Flourish onDark className="mt-5" />

            <p className="mt-6 max-w-2xl font-serif text-xl text-gold-soft italic sm:text-2xl">
              {service.detail.subtitle}
            </p>

            <p className="nums-lining mt-7 font-serif text-3xl leading-none font-semibold text-ivory-light">
              {service.price}
            </p>
          </Reveal>
        </div>
      </section>

      <section className="bg-ivory py-[clamp(3rem,8vw,5rem)]">
        <div className="mx-auto max-w-5xl px-5 lg:px-8">
          <Reveal immediate>
            <BackToServices />

            {showcase.intro && (
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">{showcase.intro}</p>
            )}
          </Reveal>

          <div className="mt-12 flex flex-col gap-14 sm:mt-14 sm:gap-16">
            {groups.map(({ type, offset }) => (
              <DecorationGroup
                key={type.id}
                type={type}
                offset={offset}
                onOpen={(decoration, index) => setOpen({ decoration, index })}
              />
            ))}
          </div>

          {/* One closing block: the two practical notes the service already
              carries, the site's usual pair of actions, and the ways onward
              as plain links rather than more buttons. */}
          <div className="mt-16 border-t border-cream-dark pt-10">
            <Reveal>
              <h2 className="font-serif text-[clamp(1.5rem,5vw,2rem)] leading-tight font-semibold text-plum">
                {ui.decorationsFootnoteTitle}
              </h2>

              <p className="mt-3 max-w-2xl text-lg text-muted">{service.detail.notice}</p>
              <p className="mt-1 max-w-2xl text-lg text-muted">{service.detail.conditions}</p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  href={telHref}
                  variant="primary"
                  size="md"
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
                  icon={<WhatsAppIcon className="size-5" />}
                >
                  {ui.whatsapp}
                </Button>
              </div>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-8">
                <BackToServices />
                <button
                  type="button"
                  onClick={() => setDetailOpen(true)}
                  className="inline-flex min-h-12 items-center text-base font-semibold text-plum underline underline-offset-4 transition-colors hover:text-plum-light"
                >
                  {ui.fullServiceDetails}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <DecorationDetail
        decoration={open?.decoration ?? null}
        index={open?.index ?? 0}
        onClose={() => setOpen(null)}
      />

      {/* Everything the service itself promises — about, highlights and the
          full inclusions — in the same dialog the rest of the site uses. */}
      <ServiceDetail service={detailOpen ? service : null} onClose={() => setDetailOpen(false)} />
    </>
  );
}
