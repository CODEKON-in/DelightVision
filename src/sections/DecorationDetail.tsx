import { useState } from "react";
import { AnimatedIcon } from "../components/AnimatedIcon";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { PlaceholderPhoto } from "../components/PlaceholderPhoto";
import { CheckIcon, PhoneIcon, WhatsAppIcon } from "../components/icons";
import { ui } from "../data/copy";
import { enquiryMessageFor, telHref, whatsappHrefFor } from "../data/site";
import type { Decoration } from "../data/services";

/* A row of pills, used for the two short lists. Rendered only by the caller,
   which checks the list is not empty first — an empty heading with nothing
   under it reads as a mistake. */
function PillList({ heading, items }: { heading: string; items: string[] }) {
  return (
    <section>
      <h3 className="label-gold text-gold-deep">{heading}</h3>
      <ul className="mt-3 flex flex-wrap gap-2">
        {items.map((item) => (
          <li
            key={item}
            className="rounded-full border border-gold/40 bg-cream/50 px-4 py-2 text-base font-medium text-ink"
          >
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}

function DetailBody({ decoration, index }: { decoration: Decoration; index: number }) {
  /* The image the visitor is currently looking at. Keyed by the decoration
     in the parent, so opening a different design starts at its first image. */
  const [shot, setShot] = useState(0);

  const images = decoration.images;
  const main = images[shot] ?? images[0];
  const enquiryHref = whatsappHrefFor(
    enquiryMessageFor(`"${decoration.name}" (${decoration.typeName})`)
  );

  return (
    <>
      <div className="relative shrink-0">
        {/* Keyed by the image: PlaceholderPhoto latches its src into state on
            mount so it can fall back to the painted tile when a photo fails,
            which means a changed src alone would not swap the picture.
            Remounting is what makes picking a thumbnail work. */}
        <PlaceholderPhoto
          key={main}
          index={index}
          src={main}
          alt={decoration.name}
          sizes="(min-width: 640px) 672px, 100vw"
          className="aspect-4/3 w-full sm:aspect-16/10"
        />
        <span className="absolute top-4 left-4 rounded-full bg-charcoal px-4 py-2 type-caption text-base text-ivory-light shadow-soft">
          {decoration.typeName}
        </span>
      </div>

      {/* Other views of this same decoration. Only ever shown when the
          content carries more than one image, so the strip never appears as
          a single lonely thumbnail. */}
      {images.length > 1 && (
        <div className="shrink-0 border-b border-cream-dark bg-ivory-light px-4 py-4 sm:px-8">
          <ul className="no-scrollbar flex gap-3 overflow-x-auto" aria-label={ui.moreImages}>
            {images.map((image, i) => (
              <li key={image}>
                <button
                  type="button"
                  onClick={() => setShot(i)}
                  aria-label={`${ui.viewImage} ${i + 1}`}
                  aria-current={i === shot}
                  className={[
                    "block size-20 overflow-hidden rounded-xl transition-shadow sm:size-24",
                    i === shot
                      ? "ring-2 ring-gold ring-offset-2 ring-offset-ivory-light"
                      : "ring-1 ring-cream-strong hover:ring-gold",
                  ].join(" ")}
                >
                  <PlaceholderPhoto
                    index={index + i}
                    src={image}
                    alt=""
                    sizes="96px"
                    className="size-full"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-col gap-7 p-6 sm:p-8">
        <div>
          {/* The decoration type is named on the badge over the photo, so it
              is not repeated here. */}
          <h2
            id={`decoration-title-${decoration.id}`}
            className="type-heading text-4xl leading-tight text-charcoal sm:text-5xl"
          >
            {decoration.name}
          </h2>

          {decoration.price && (
            <p className="type-price mt-5 inline-block rounded-full border border-gold/40 bg-cream/60 px-5 py-2 text-lg text-ink">
              {decoration.price}
            </p>
          )}
        </div>

        {decoration.description && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.aboutThisDecoration}</h3>
            <p className="mt-3 text-lg leading-relaxed text-ink">{decoration.description}</p>
          </section>
        )}

        {decoration.includes.length > 0 && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.whatsIncluded}</h3>
            <ul className="mt-3 flex flex-col gap-3">
              {decoration.includes.map((item) => (
                <li key={item} className="flex gap-3">
                  <AnimatedIcon immediate delay={0.1} className="mt-1 shrink-0">
                    <CheckIcon className="size-5 text-gold-deep" />
                  </AnimatedIcon>
                  <span className="text-base text-ink">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {decoration.suitableFor.length > 0 && (
          <PillList heading={ui.idealFor} items={decoration.suitableFor} />
        )}

        {decoration.tags.length > 0 && <PillList heading={ui.shownHere} items={decoration.tags} />}

        {decoration.style && (
          <section>
            <h3 className="label-gold text-gold-deep">{ui.decorationStyle}</h3>
            <p className="mt-3 text-lg text-ink">{decoration.style}</p>
          </section>
        )}

        {decoration.specifications.length > 0 && (
          <section className="rounded-2xl border border-cream-dark bg-ivory-light p-5 sm:p-6">
            <h3 className="label-gold text-gold-deep">{ui.decorationDetails}</h3>
            <dl className="mt-4 flex flex-col gap-4">
              {decoration.specifications.map((spec) => (
                <div
                  key={spec.label}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 border-b border-cream-dark pb-4 last:border-0 last:pb-0"
                >
                  <dt className="text-base font-semibold text-ink">{spec.label}</dt>
                  <dd className="nums-lining text-base text-muted">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}
      </div>

      {/* The same two actions as every other detail view on the site. The
          WhatsApp message already names this decoration, so the enquiry
          arrives saying what it is about. */}
      <div className="sticky bottom-0 mt-auto flex flex-col gap-3 border-t border-cream-dark bg-ivory-light p-4 sm:flex-row sm:bg-ivory-light/95 sm:p-5 sm:backdrop-blur-md">
        <Button
          href={enquiryHref}
          target="_blank"
          rel="noopener noreferrer"
          variant="whatsapp"
          size="md"
          fullWidth
          icon={<WhatsAppIcon className="size-5" />}
        >
          {ui.enquireAboutThis}
        </Button>
        <Button
          href={telHref}
          variant="primary"
          size="md"
          fullWidth
          icon={<PhoneIcon className="size-5" />}
        >
          {ui.callToBook}
        </Button>
      </div>
    </>
  );
}

type Props = {
  decoration: Decoration | null;
  /* Picks the fallback tile palette, so a missing photo still looks designed */
  index: number;
  onClose: () => void;
};

export function DecorationDetail({ decoration, index, onClose }: Props) {
  /* Hold the last decoration on screen while the modal animates closed,
     instead of blanking instantly. Derived during render, so no extra paint. */
  const [shown, setShown] = useState(decoration);
  if (decoration && decoration !== shown) setShown(decoration);

  return (
    <Modal
      open={decoration !== null}
      onClose={onClose}
      labelledBy={shown ? `decoration-title-${shown.id}` : "decoration-title"}
      closeLabel={ui.closeDecorationDetails}
    >
      {shown && <DetailBody key={shown.id} decoration={shown} index={index} />}
    </Modal>
  );
}
