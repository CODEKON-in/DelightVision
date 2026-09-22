import { useState } from "react";
import { Reveal } from "../components/Reveal";
import { ServiceBody } from "../components/ServiceBody";
import { ui } from "../data/copy";
import { serviceById, type Service } from "../data/services";
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
  const service = serviceId ? serviceById[serviceId] : undefined;

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
    </>
  );
}
