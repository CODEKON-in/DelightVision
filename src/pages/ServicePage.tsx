import { useState } from "react";
import { PackageTierDetail, type PackageTier } from "../components/PackageTierDetail";
import { ScrollCue } from "../components/ScrollCue";
import { Reveal } from "../components/Reveal";
import { ServiceBody } from "../components/ServiceBody";
import { ServiceCard } from "../components/ServiceCard";
import { ui } from "../data/copy";
import { packagesForService, serviceById, type Service } from "../data/services";
import { HOME_PATH, navigate } from "../lib/router";
import { ServiceDetail } from "../sections/ServiceDetail";

/* Back to where the visitor came from, written out in words rather than
   left to the browser's back button — the same link the Decorations page
   carries, and repeated at the foot of the page. */
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

type Props = {
  /* From the path, e.g. "photography-videography". null when the path names
     no service the content has. */
  serviceId: string | null;
};

/* One service on a page of its own — what the details dialog shows, with
   room to look through the individual services it is made up of.

   A service gets this page rather than a dialog when it has individual
   services; the Services section decides that, exactly as it decides that a
   service with decoration designs goes to the Decorations page. The page
   renders the same `ServiceBody` the dialog does, so the two cannot drift
   apart, and a card here opens that individual service in the usual dialog. */
export function ServicePage({ serviceId }: Props) {
  const [openService, setOpenService] = useState<Service | null>(null);
  const [openTier, setOpenTier] = useState<PackageTier | null>(null);
  const service = serviceId ? serviceById[serviceId] : undefined;

  /* The packages devoted to this service — Bronze, Silver and Gold of the
     combo that is about it. Shown as the same cards the service itself
     uses, so the page reads as one set of cards. */
  const tiers = service ? packagesForService(service) : [];
  /* Only name the combo on the card when more than one of them shows up
     here; with a single combo the card is simply "Bronze". */
  const combosShown = new Set(tiers.map((t) => t.combo.id)).size;

  if (!service) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-24 text-center lg:px-8">
        <p className="text-lg text-muted">{ui.serviceNotFound}</p>
        <BackToServices className="mt-6" />
      </div>
    );
  }

  return (
    <>
      {/* The page carries on below the fold — said once, quietly, and only
          while the reader is still at the top. */}
      <ScrollCue className="fixed inset-x-0 bottom-6" />

      <section className="bg-ivory py-[clamp(2.5rem,7vw,4rem)]">
        <div className="mx-auto max-w-3xl px-5 lg:px-8">
          <Reveal immediate className="mb-6">
            <BackToServices />
          </Reveal>

          <Reveal immediate>
            <ServiceBody
              service={service}
              onOpenSub={setOpenService}
              asPage
              /* The packages devoted to this service, directly below its
                 individual services so the two read as one run of cards.
                 Each card opens that option's own dialog — its price, what
                 it covers and what it throws in — rather than a page. */
              afterServices={
                tiers.length > 0 && (
                  <section>
                    <h2 className="label-gold text-gold-deep">
                      {ui.packagesWithThisService}
                    </h2>
                    <ul className="dv-orphan-grid dv-orphan-grid-2 mt-4 grid grid-cols-2 items-stretch gap-3 sm:gap-4">
                      {tiers.map(({ combo, tier }, i) => (
                        <li key={`${combo.id}-${tier.name}`} className="h-full">
                          <ServiceCard
                            index={i}
                            service={{
                              id: `${combo.id}-${tier.name}`,
                              name:
                                combosShown > 1
                                  ? `${combo.name} — ${tier.name}`
                                  : tier.name,
                              description: tier.blurb,
                              image: tier.image,
                              price: tier.price,
                            }}
                            cta={{ short: ui.viewDetailsShort, long: ui.viewPackLong }}
                            iconId={service.id}
                            immediateIcon
                            onOpen={() => setOpenTier({ combo, tier })}
                          />
                        </li>
                      ))}
                    </ul>
                  </section>
                )
              }
            />
          </Reveal>

          <div className="mt-12 border-t border-cream-dark pt-8">
            <Reveal>
              <BackToServices />
            </Reveal>
          </div>
        </div>
      </section>

      {/* An individual service opens in the dialog the rest of the site
          uses — it is a service like any other. */}
      <ServiceDetail service={openService} onClose={() => setOpenService(null)} />

      {/* A package option, with everything it includes */}
      <PackageTierDetail selected={openTier} onClose={() => setOpenTier(null)} />
    </>
  );
}
