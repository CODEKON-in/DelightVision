import { createElement } from "react";
import { AnimatedIcon } from "./AnimatedIcon";
import { Button } from "./Button";
import { Card } from "./Card";
import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { iconFor } from "./serviceIcons";
import { ui } from "../data/copy";
import type { Service } from "../data/services";

type Props = {
  service: Service;
  /* Position in its grid — picks the fallback tile palette if the photo
     is missing. */
  index: number;
  /* What "View Service Details" does. Left to the page, because the
     decoration service's card means different things in different places:
     the whole Decorations catalogue from the Services section, the one
     design a package includes from a package page. */
  onOpen: (service: Service) => void;
};

/* One service as a card: photo with its icon, name, one-line description,
   price and a "View Service Details" button. Shared by the Services section
   and a package's "Services in this package" grid, so a service looks the
   same wherever a visitor meets it.

   Render it inside an `h-full` grid item — the card fills that height so a
   row of cards lines up. */
export function ServiceCard({ service, index, onOpen }: Props) {
  return (
    <Card flush className="flex h-full flex-col">
      <div className="relative">
        <PlaceholderPhoto
          index={index}
          src={service.image}
          alt={service.name}
          className="aspect-16/10 w-full sm:aspect-4/3"
        />
        <AnimatedIcon className="absolute top-3 left-3 inline-flex size-9 items-center justify-center rounded-xl bg-ivory-light/95 text-charcoal shadow-soft ring-1 ring-gold/50 xs:size-10 sm:size-12 sm:backdrop-blur-sm">
          {/* createElement rather than `const Icon = iconFor(…)`: the lookup
              returns a stable component from a fixed map, but assigning it
              to a capitalised local reads to the linter as defining a new
              component on every render. */}
          {createElement(iconFor(service.id), { className: "size-[1.15rem] xs:size-5 sm:size-6" })}
        </AnimatedIcon>
      </div>

      {/* Each row below is height-locked, so every card in a row ends up the
          same height and the prices and buttons line up however long the
          copy runs. */}
      <div className="flex grow flex-col p-3.5 xs:p-4 sm:p-6">
        <h3 className="type-title line-clamp-2 min-h-[2.4em] text-lg leading-tight break-words text-charcoal xs:text-xl sm:text-2xl">
          {service.name}
        </h3>

        {/* No min-height: the price and button are pinned to the bottom by
            mt-auto, so they still line up across a row while each card stays
            only as tall as it needs. The clamp is a safety net for over-long
            copy, and three lines is what it takes down to a 320px phone - a
            fixed two-line box cut text off on narrow screens. */}
        <p className="mt-1.5 line-clamp-3 text-base break-words text-muted">
          {service.description}
        </p>

        <div className="mt-auto border-t border-cream-dark pt-3 sm:pt-4">
          <p className="type-price text-xl leading-tight text-charcoal xs:text-2xl sm:text-3xl">
            {service.price}
          </p>

          <Button
            variant="secondary"
            size="md"
            fullWidth
            className="mt-3 sm:mt-4"
            onClick={() => onOpen(service)}
          >
            <span className="xs:hidden">{ui.viewDetailsShort}</span>
            <span className="hidden xs:inline">{ui.viewDetailsLong}</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
