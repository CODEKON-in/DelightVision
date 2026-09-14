import { useState } from "react";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { ServiceCard } from "../components/ServiceCard";
import { ui } from "../data/copy";
import { services, type Service } from "../data/services";
import { ServiceDetail } from "./ServiceDetail";

export function Services() {
  const [openService, setOpenService] = useState<Service | null>(null);

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
          /* Seven services divide badly: two columns leave one card alone
             on the last row, three columns leave it alone with two empty
             cells beside it. Centring the last row puts the odd card under
             the middle of the grid instead of stranding it hard left. */
          className="dv-orphan-grid mt-10 grid grid-cols-2 items-stretch gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-6"
        >
          {services.map((service, i) => (
            <li key={service.id} className="h-full">
              <ServiceCard service={service} index={i} onOpen={setOpenService} />
            </li>
          ))}
        </Reveal>
      </div>

      <ServiceDetail service={openService} onClose={() => setOpenService(null)} />
    </section>
  );
}
