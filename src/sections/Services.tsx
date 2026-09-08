import { useMemo, useState } from "react";
import { AnimatedIcon } from "../components/AnimatedIcon";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { FilterTabs, type Tab } from "../components/FilterTabs";
import { PlaceholderPhoto } from "../components/PlaceholderPhoto";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { iconFor } from "../components/serviceIcons";
import { ui } from "../data/copy";
import { categories, services, type CategoryId, type Service } from "../data/services";
import { ServiceDetail } from "./ServiceDetail";

type FilterId = CategoryId | "all";

export function Services() {
  const [filter, setFilter] = useState<FilterId>("all");

  const tabs: Tab<FilterId>[] = [
    { id: "all", label: ui.allServices },
    ...categories.map((c) => ({ id: c.id as FilterId, label: c.label, short: c.short })),
  ];

  const [openService, setOpenService] = useState<Service | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? services : services.filter((s) => s.category === filter)),
    [filter]
  );

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

        <Reveal className="mt-10 sm:mt-12">
          <FilterTabs
            tabs={tabs}
            active={filter}
            onChange={setFilter}
            label={ui.filterServices}
          />
        </Reveal>

        {/* `key` restarts the reveal animation when the filter changes */}
        <Reveal
          key={filter}
          as="ul"
          stagger={0.07}
          className="mt-10 grid grid-cols-2 items-stretch gap-3 sm:grid-cols-3 sm:gap-6"
        >
          {visible.map((service, i) => {
            const Icon = iconFor(service.id);

            return (
              <li key={service.id} className="h-full">
                <Card flush className="flex h-full flex-col">
                  <div className="relative">
                    {/* DUMMY photo of this service - see src/data/services.ts */}
                    <PlaceholderPhoto
                      index={i}
                      src={service.image}
                      alt={service.name}
                      className="aspect-16/10 w-full sm:aspect-4/3"
                    />
                    <AnimatedIcon className="absolute top-3 left-3 inline-flex size-9 items-center justify-center rounded-xl bg-ivory-light/95 text-plum shadow-soft ring-1 ring-gold/50 xs:size-10 sm:size-12 sm:backdrop-blur-sm">
                      <Icon className="size-[1.15rem] xs:size-5 sm:size-6" />
                    </AnimatedIcon>
                  </div>

                  {/* Each row below is height-locked, so every card in a row
                      ends up the same height and the prices and buttons line
                      up however long the copy runs. */}
                  <div className="flex grow flex-col p-3.5 xs:p-4 sm:p-6">
                    <h3 className="line-clamp-2 min-h-[2.4em] text-lg leading-tight font-semibold break-words text-plum xs:text-xl sm:text-2xl">
                      {service.name}
                    </h3>

                    {/* No min-height: the price and button are pinned to the
                        bottom by mt-auto, so they still line up across a row
                        while each card stays only as tall as it needs. The
                        clamp is a safety net for over-long copy, and three
                        lines is what it takes down to a 320px phone - a fixed
                        two-line box cut text off on narrow screens. */}
                    <p className="mt-1.5 line-clamp-3 text-base break-words text-muted">
                      {service.description}
                    </p>

                    <div className="mt-auto border-t border-cream-dark pt-3 sm:pt-4">
                      {/* DUMMY PRICE - see src/data/services.ts */}
                      <p className="nums-lining font-serif text-xl leading-tight font-semibold text-plum xs:text-2xl sm:text-3xl">
                        {service.price}
                      </p>

                      <Button
                        variant="secondary"
                        size="md"
                        fullWidth
                        className="mt-3 sm:mt-4"
                        onClick={() => setOpenService(service)}
                      >
                        <span className="xs:hidden">{ui.viewDetailsShort}</span>
                        <span className="hidden xs:inline">{ui.viewDetailsLong}</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              </li>
            );
          })}
        </Reveal>
      </div>

      <ServiceDetail service={openService} onClose={() => setOpenService(null)} />
    </section>
  );
}
