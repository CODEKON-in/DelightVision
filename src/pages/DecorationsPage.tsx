import { useState } from "react";
import { Button } from "../components/Button";
import { MaterialCard } from "../components/MaterialCard";
import { Reveal } from "../components/Reveal";
import { PhoneIcon, WhatsAppIcon } from "../components/icons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";
import { services } from "../data/services";
import { HOME_PATH, navigate } from "../lib/router";
import { ServiceDetail } from "../sections/ServiceDetail";

/* Back to where the visitor came from. Written out in words rather than
   left to the browser's back button, and repeated at the foot of the page so
   it is there whichever end they finish at. */
function BackToServices({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => navigate(`${HOME_PATH}#services`)}
      className={`inline-flex min-h-12 items-center gap-2 type-nav text-base text-charcoal transition-colors hover:text-graphite ${className}`}
    >
      <span aria-hidden="true">&larr;</span>
      {ui.backToServices}
    </button>
  );
}

export function DecorationsPage() {
  const [detailOpen, setDetailOpen] = useState(false);

  /* The page is the decoration service's showcase. If the content ever
     stops carrying the service at all, the page says so rather than
     rendering an empty shell. */
  const service = services.find((item) => item.id === "decoration");

  if (!service) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
        <p className="text-lg text-muted">{ui.noDecorationsYet}</p>
        <BackToServices className="mt-6" />
      </div>
    );
  }

  return (
    <>
      {/* No title band above this — the page opens straight on the
          materials grid, which is the reason anyone lands here. */}
      <section className="bg-ivory py-[clamp(2.5rem,7vw,4rem)]">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal immediate>
            <BackToServices />
          </Reveal>

          {/* The decorations as photographs and nothing else. Everything
              written about one — name, note, specs, price, and the two ways
              to get in touch — lives in the dialog a tile opens, so the page
              itself is something to look through rather than read. The
              heading below doubles as the page's own, now that the title
              band above it is gone. */}
          {service.materials.length > 0 && (
            <section className="mt-8 sm:mt-10">
              <Reveal immediate>
                <h1 className="type-heading text-[clamp(2rem,7vw,3rem)] leading-tight text-charcoal">
                  {ui.decorationsTitle}
                </h1>
              </Reveal>

              <Reveal
                as="ul"
                stagger={0.04}
                className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
              >
                {service.materials.map((material, i) => (
                  <li key={material.id}>
                    <MaterialCard material={material} index={i} layout="tile" />
                  </li>
                ))}
              </Reveal>
            </section>
          )}

          {/* One closing block: the two practical notes the service already
              carries, the site's usual pair of actions, and the ways onward
              as plain links rather than more buttons. */}
          <div className="mt-16 border-t border-cream-dark pt-10">
            <Reveal>
              <h2 className="type-heading text-[clamp(1.5rem,5vw,2rem)] leading-tight text-charcoal">
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
                  className="inline-flex min-h-12 items-center type-nav text-base text-charcoal underline underline-offset-4 transition-colors hover:text-graphite"
                >
                  {ui.fullServiceDetails}
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Everything the service itself promises — about, highlights and the
          full inclusions — in the same dialog the rest of the site uses. */}
      <ServiceDetail service={detailOpen ? service : null} onClose={() => setDetailOpen(false)} />
    </>
  );
}
