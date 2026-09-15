import { useState } from "react";
import { Button } from "../components/Button";
import { DecorationCard } from "../components/DecorationCard";
import type { DecorationContext } from "../components/DecorationDetail";
import { Reveal } from "../components/Reveal";
import { PhoneIcon, WhatsAppIcon } from "../components/icons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";
import { combos, services } from "../data/services";
import { HOME_PATH, navigate, packagePathFor } from "../lib/router";
import { ServiceDetail } from "../sections/ServiceDetail";

type BackLink = { label: string; to: string };

/* Back to where the visitor came from. Written out in words rather than
   left to the browser's back button, and repeated at the foot of the page so
   it is there whichever end they finish at. */
function Back({ link, className = "" }: { link: BackLink; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => navigate(link.to)}
      className={`inline-flex min-h-12 items-center gap-2 type-nav text-base text-charcoal transition-colors hover:text-graphite ${className}`}
    >
      <span aria-hidden="true">&larr;</span>
      {link.label}
    </button>
  );
}

type Props = {
  /* Set when the page shows one package's designs rather than the whole
     catalogue — "/packages/<comboId>/<tier>/decorations". undefined for
     the catalogue at "/decorations"; null for a package path naming no
     real combo. */
  comboId?: string | null;
  tierName?: string | null;
};

/* The decoration designs as a grid of photographs. One page for both ways
   in: from the Services section it is the whole catalogue; from a package
   it is only the designs that package tier offers, which the package names
   by id in the content. Same grid, same cards, same dialog either way. */
export function DecorationsPage({ comboId, tierName }: Props) {
  const [detailOpen, setDetailOpen] = useState(false);

  /* The page is the decoration service's gallery of designs. If the content ever
     stops carrying the service at all, the page says so rather than
     rendering an empty shell. */
  const service = services.find((item) => item.id === "decoration");

  const fromPackage = comboId !== undefined;
  const combo = comboId ? combos.find((c) => c.id === comboId) : undefined;
  /* The same tier fallback the package page uses: the named tier, else the
     combo's first. */
  const tier =
    (tierName && combo?.priceTiers.find((t) => t.name === tierName)) || combo?.priceTiers[0];

  const designs = fromPackage
    ? (tier ? tier.decorations : (combo?.decorations ?? []))
    : (service?.designs ?? []);

  const context: DecorationContext | undefined = combo
    ? { packageName: [tier?.name, combo.name].filter(Boolean).join(" ") }
    : undefined;

  const back: BackLink = combo
    ? { label: ui.backToPackage, to: packagePathFor(combo.id, tier?.name) }
    : fromPackage
      ? { label: ui.backToPackages, to: `${HOME_PATH}#packages` }
      : { label: ui.backToServices, to: `${HOME_PATH}#services` };

  if (!service || (fromPackage && designs.length === 0)) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
        <p className="text-lg text-muted">{ui.noDecorationsYet}</p>
        <Back link={back} className="mt-6" />
      </div>
    );
  }

  return (
    <>
      {/* No title band above this — the page opens straight on the
          designs grid, which is the reason anyone lands here. */}
      <section className="bg-ivory py-[clamp(2.5rem,7vw,4rem)]">
        <div className="mx-auto max-w-6xl px-5 lg:px-8">
          <Reveal immediate>
            <Back link={back} />
          </Reveal>

          {/* The decoration designs as photographs and nothing else.
              Everything written about one — its price, description, details
              and the two ways to get in touch — lives in the dialog a tile
              opens, so the page itself is something to look through rather
              than read. The heading below doubles as the page's own. */}
          {designs.length > 0 && (
            <section className="mt-8 sm:mt-10">
              <Reveal immediate>
                {/* From a package: whose designs these are, as the same
                    small gold label their dialogs carry. */}
                {context && (
                  <p className="label-gold mb-2 text-gold-deep">
                    {ui.includedInPackage} {context.packageName}
                  </p>
                )}
                <h1 className="type-heading text-[clamp(2rem,7vw,3rem)] leading-tight text-charcoal">
                  {ui.decorationsTitle}
                </h1>
              </Reveal>

              <Reveal
                as="ul"
                stagger={0.04}
                className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
              >
                {designs.map((design, i) => (
                  <li key={design.id}>
                    <DecorationCard design={design} index={i} context={context} />
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
                <Back link={back} />
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
