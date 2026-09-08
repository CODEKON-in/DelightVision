import { useState } from "react";
import { AnimatedIcon } from "../components/AnimatedIcon";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { PlaceholderPhoto } from "../components/PlaceholderPhoto";
import { PhoneIcon, WhatsAppIcon } from "../components/icons";
import { iconFor } from "../components/serviceIcons";
import { ui } from "../data/copy";
import { business, telHref, whatsappHrefFor } from "../data/site";
import { categories, serviceById, type GalleryItem } from "../data/services";

function DetailBody({ item, index }: { item: GalleryItem; index: number }) {
  const whatsappHref = whatsappHrefFor(business.whatsappMessage);
  const service = serviceById[item.service];
  const Icon = iconFor(item.service);
  const category = categories.find((c) => c.id === item.category);

  return (
    <>
      <div className="relative shrink-0">
        {/* DUMMY photo — see src/data/services.ts */}
        <PlaceholderPhoto
          index={index}
          src={item.image}
          alt={item.caption}
          sizes="(min-width: 640px) 672px, 100vw"
          className="aspect-4/3 w-full sm:aspect-16/10"
        />
        <span className="absolute top-4 left-4 rounded-full bg-plum px-4 py-2 text-base font-bold tracking-[0.14em] text-ivory-light uppercase shadow-soft">
          {item.badge}
        </span>
      </div>

      <div className="flex flex-col gap-7 p-6 sm:p-8">
        <div>
          <div className="flex items-center gap-3">
            <AnimatedIcon immediate>
              <Icon className="size-6 text-plum" />
            </AnimatedIcon>
            <p className="label-gold text-gold-deep">{category ? category.label : ""}</p>
          </div>

          <h2
            id={`gallery-title-${item.id}`}
            className="mt-3 font-serif text-4xl leading-tight font-semibold text-plum sm:text-5xl"
          >
            {item.caption}
          </h2>
        </div>

        <section>
          <h3 className="label-gold text-gold-deep">{ui.aboutThisPhoto}</h3>
          <p className="mt-3 text-lg leading-relaxed text-ink">{item.description}</p>
        </section>

        <section>
          <h3 className="label-gold text-gold-deep">{ui.shownHere}</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {item.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-gold/40 bg-cream/50 px-4 py-2 text-base font-medium text-ink"
              >
                {tag}
              </li>
            ))}
          </ul>
        </section>

        {/* Ties the photo back to the service that produced it */}
        <section className="rounded-2xl bg-cream/60 p-5">
          <p className="text-base font-semibold tracking-wide text-muted uppercase">
            {ui.wantThis}
          </p>
          <p className="mt-2 flex items-center gap-2 font-serif text-2xl font-semibold text-plum">
            <AnimatedIcon immediate delay={0.15}>
              <Icon className="size-6" />
            </AnimatedIcon>
            {service.name}
          </p>
          {/* DUMMY PRICE */}
          <p className="nums-lining mt-1 text-lg text-ink">{service.price}</p>
        </section>
      </div>

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
  item: GalleryItem | null;
  index: number;
  onClose: () => void;
};

export function GalleryDetail({ item, index, onClose }: Props) {
  /* Keep the last photo on screen while the modal animates closed */
  const [shown, setShown] = useState(item);
  if (item && item !== shown) setShown(item);

  return (
    <Modal
      open={item !== null}
      onClose={onClose}
      labelledBy={shown ? `gallery-title-${shown.id}` : "gallery-title"}
    >
      {shown && <DetailBody item={shown} index={index} />}
    </Modal>
  );
}
