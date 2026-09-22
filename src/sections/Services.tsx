import { useState } from "react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceCard } from "../components/ServiceCard";
import { ui } from "../data/copy";
import { services, type Service } from "../data/services";
import { DECORATIONS_PATH, navigate, servicePathFor } from "../lib/router";
import { ServiceDetail } from "./ServiceDetail";

export function Services() {
  const [openService, setOpenService] = useState<Service | null>(null);

  /* Two services have a page of their own rather than a dialog, because
     each has a set of things to look through: the one with a gallery of
     designs (Decorations) and the one made up of individual services
     (Photography & Videography). Both are data checks, not hardcoded ids,
     so the next service of either kind needs no change here. */
  const openCard = (service: Service) => {
    if (service.designs.length > 0) {
      navigate(DECORATIONS_PATH);
      return;
    }
    if (service.subServices.length > 0) {
      navigate(servicePathFor(service.id));
      return;
    }
    setOpenService(service);
  };

  return (
    <section id="services" className="scroll-mt-20 bg-ivory py-[clamp(3.5rem,9vw,6rem)]">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={ui.servicesEyebrow}
            title={ui.servicesTitle}
            subtitle={ui.servicesSubtitle}
          />
        </Reveal>

        <Reveal
          as="ul"
          stagger={0.07}
          /* Four services: two rows of two on a phone. From sm the grid has
             three columns, which leaves the fourth card alone on its row, so
             it is centred under the three instead of stranded hard left. */
          className="dv-orphan-grid mt-10 grid grid-cols-2 items-stretch gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-6"
        >
          {services.map((service, i) => (
            <li key={service.id} className="h-full">
              <ServiceCard service={service} index={i} onOpen={openCard} />
            </li>
          ))}
        </Reveal>
      </div>

      <ServiceDetail service={openService} onClose={() => setOpenService(null)} />
    </section>
  );
}
