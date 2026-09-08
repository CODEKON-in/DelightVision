import { useMemo, useState } from "react";
import { FilterTabs, type Tab } from "../components/FilterTabs";
import { PlaceholderPhoto } from "../components/PlaceholderPhoto";
import { Reveal } from "../components/Reveal";
import { SectionHeading } from "../components/SectionHeading";
import { ui } from "../data/copy";
import { categories, galleryItems, type CategoryId, type GalleryItem } from "../data/services";
import { GalleryDetail } from "./GalleryDetail";

type FilterId = CategoryId | "all";

export function Gallery() {
  const [filter, setFilter] = useState<FilterId>("all");

  const tabs: Tab<FilterId>[] = [
    { id: "all", label: ui.allWork },
    ...categories.map((c) => ({ id: c.id as FilterId, label: c.label, short: c.short })),
  ];

  const [open, setOpen] = useState<{ item: GalleryItem; index: number } | null>(null);

  const visible = useMemo(
    () => (filter === "all" ? galleryItems : galleryItems.filter((g) => g.category === filter)),
    [filter]
  );

  return (
    <section id="gallery" className="scroll-mt-20 bg-ivory py-[clamp(3.5rem,9vw,6rem)]">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={ui.galleryEyebrow}
            title={ui.galleryTitle}
            subtitle={ui.gallerySubtitle}
          />
        </Reveal>

        <Reveal className="mt-10 sm:mt-12">
          <FilterTabs
            tabs={tabs}
            active={filter}
            onChange={setFilter}
            label={ui.filterGallery}
          />
        </Reveal>

        <Reveal key={filter}>
          <ul
            className="mt-8 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4"
            aria-label={ui.photoGallery}
          >
            {visible.map((item, i) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpen({ item, index: i })}
                  className="group block w-full overflow-hidden rounded-2xl ring-1 ring-cream-dark transition-shadow duration-300 hover:shadow-lift sm:rounded-3xl"
                  aria-label={`${ui.viewDetailsOf}: ${item.caption}`}
                >
                  {/* DUMMY photo — see src/data/services.ts */}
                  <PlaceholderPhoto
                    index={i}
                    src={item.image}
                    alt=""
                    label={item.caption}
                    className="aspect-4/5 w-full transition-transform duration-500 motion-safe:group-hover:scale-105"
                  />
                </button>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <GalleryDetail
        item={open?.item ?? null}
        index={open?.index ?? 0}
        onClose={() => setOpen(null)}
      />
    </section>
  );
}
