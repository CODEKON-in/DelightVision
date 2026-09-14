import { useMemo, useState } from "react";
import { Button } from "../components/Button";
import { FilterTabs, type Tab } from "../components/FilterTabs";
import { Modal } from "../components/Modal";
import { PlaceholderPhoto } from "../components/PlaceholderPhoto";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { PhoneIcon, WhatsAppIcon } from "../components/icons";
import { ui } from "../data/copy";
import { categories, galleryItems, type CategoryId, type GalleryItem } from "../data/services";
import { enquiryMessageFor, telHref, whatsappHrefFor } from "../data/site";

/* Our work, in photographs.

   Everything here was already written and shot — content/gallery.json and
   public/images/gallery — and simply had nothing rendering it, so the home
   page went from the services grid straight to the packages without ever
   showing a wedding. On a site whose whole job is to make an older visitor
   confident enough to pick up the phone, the photographs are the argument.

   The filter reuses the same category set as the rest of the site, and a
   category with no photographs in it is never offered as a tab. */

type FilterId = CategoryId | "all";

export function Gallery() {
  const [filter, setFilter] = useState<FilterId>("all");
  const [openItem, setOpenItem] = useState<GalleryItem | null>(null);

  const tabs: Tab<FilterId>[] = useMemo(() => {
    const present = new Set(galleryItems.map((item) => item.category));
    return [
      { id: "all" as FilterId, label: ui.galleryAll },
      ...categories
        .filter((category) => present.has(category.id))
        .map((category) => ({
          id: category.id as FilterId,
          label: category.label,
          short: category.short,
        })),
    ];
  }, []);

  const shown = useMemo(
    () =>
      filter === "all"
        ? galleryItems
        : galleryItems.filter((item) => item.category === filter),
    [filter]
  );

  if (galleryItems.length === 0) return null;

  const titleId = "gallery-detail-title";

  return (
    <section id="gallery" className="scroll-mt-20 bg-cream py-[clamp(3.5rem,9vw,6rem)]">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={ui.galleryEyebrow}
            title={ui.galleryTitle}
            subtitle={ui.gallerySubtitle}
          />
        </Reveal>

        {tabs.length > 2 && (
          <Reveal className="mt-8 sm:mt-10">
            <FilterTabs
              tabs={tabs}
              active={filter}
              onChange={setFilter}
              label={ui.galleryFilterLabel}
            />
          </Reveal>
        )}

        {/* Two up on a phone, three from sm, four on a wide screen. Square
            tiles, so a mixed set of portrait and landscape photographs
            still lays out as an even grid. */}
        <Reveal
          as="ul"
          stagger={0.06}
          className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4"
        >
          {shown.map((item, i) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setOpenItem(item)}
                className="group relative block w-full overflow-hidden rounded-2xl border border-cream-dark bg-ivory-light text-left shadow-soft transition-shadow duration-300 hover:shadow-lift focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-deep"
              >
                <PlaceholderPhoto
                  index={i}
                  src={item.image}
                  alt={item.caption}
                  className="aspect-square w-full"
                  sizes="(min-width: 1024px) 22vw, (min-width: 640px) 30vw, 45vw"
                />

                {/* The caption sits on the photograph rather than under it,
                    so every tile is the same height whatever its wording. */}
                <span
                  className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-0.5 bg-gradient-to-t from-obsidian/85 via-obsidian/55 to-transparent p-3 pt-8 sm:p-4 sm:pt-10"
                  aria-hidden="true"
                >
                  {/* Both lines are clamped: a longer badge ("Full-Day
                      Coverage") wrapped onto two lines and pushed its
                      caption down out of line with the tile beside it. */}
                  <span className="type-caption truncate text-xs text-gold-soft">
                    {item.badge}
                  </span>
                  <span className="type-title line-clamp-1 text-base leading-tight text-ivory-light sm:text-lg">
                    {item.caption}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </Reveal>
      </div>

      <Modal
        open={openItem !== null}
        onClose={() => setOpenItem(null)}
        labelledBy={titleId}
        closeLabel={ui.closeGalleryDetails}
      >
        {openItem && (
          <>
            <PlaceholderPhoto
              index={openItem.id}
              src={openItem.image}
              alt={openItem.caption}
              className="aspect-4/3 w-full shrink-0"
              sizes="(min-width: 640px) 42rem, 100vw"
            />

            <div className="p-6 sm:p-8">
              <p className="label-gold text-gold-deep">{openItem.badge}</p>

              <h2
                id={titleId}
                className="type-heading mt-2 text-3xl leading-tight text-charcoal sm:text-4xl"
              >
                {openItem.caption}
              </h2>

              <p className="mt-4 text-base text-muted sm:text-lg">{openItem.description}</p>

              {openItem.tags.length > 0 && (
                <ul className="mt-5 flex flex-wrap gap-2">
                  {openItem.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-cream px-3 py-1.5 text-sm text-ink"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-7 flex flex-col gap-3 border-t border-cream-dark pt-6 sm:flex-row">
                <Button
                  href={telHref}
                  variant="primary"
                  size="lg"
                  fullWidth
                  icon={<PhoneIcon className="size-6" />}
                >
                  {ui.callToBook}
                </Button>
                <Button
                  href={whatsappHrefFor(enquiryMessageFor(openItem.caption))}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="whatsapp"
                  size="lg"
                  fullWidth
                  icon={<WhatsAppIcon className="size-6" />}
                >
                  {ui.askAboutThis}
                </Button>
              </div>
            </div>
          </>
        )}
      </Modal>
    </section>
  );
}
