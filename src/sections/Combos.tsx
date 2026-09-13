import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { PlaceholderPhoto } from "../components/PlaceholderPhoto";
import { Reveal } from "../components/Reveal";
import { CornerOrnaments } from "../components/Royal";
import { SectionHeading } from "../components/SectionHeading";
import { PhoneIcon } from "../components/icons";
import { ui } from "../data/copy";
import { telHref } from "../data/site";
import { combos, serviceById, type Combo } from "../data/services";
import { navigate, packagePathFor } from "../lib/router";

/* Bronze / Silver / Gold get their own accent colour on the active button,
   so the choice reads clearly even before it's tapped. Gold reuses the
   site's existing gold accent (the same colour as the "Most Popular"
   ribbon); Bronze and Silver are new, warm-neutral companions to it. */
const TIER_ACCENTS: Record<string, { bg: string; text: string }> = {
  Bronze: { bg: "#a9713f", text: "#fff7ec" },
  Silver: { bg: "#93938d", text: "#fff" },
  Gold: { bg: "#d4af37", text: "#2a1f08" },
};

function tierAccent(name: string) {
  return TIER_ACCENTS[name] ?? { bg: "#3a3632", text: "#fff" };
}

/* One shared row of Bronze/Silver/Gold buttons for the whole section —
   picking one here updates every card's price and included-services list
   at once, rather than each card having its own separate switch. */
function TierSwitcher({
  tierNames,
  selected,
  onSelect,
}: {
  tierNames: string[];
  selected: string;
  onSelect: (name: string) => void;
}) {
  if (tierNames.length === 0) return null;

  return (
    <div className="flex justify-center">
      <div
        className="inline-flex gap-1 rounded-full bg-ivory-light p-1.5 shadow-soft sm:gap-2 sm:p-2"
        role="group"
        aria-label={ui.pricingOptionsHeading}
      >
        {tierNames.map((name) => {
          const active = name === selected;
          const accent = tierAccent(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => onSelect(name)}
              aria-pressed={active}
              className={[
                "rounded-full px-3.5 py-2 type-caption text-sm transition-colors sm:px-6 sm:py-2.5 sm:text-base",
                active ? "shadow-soft" : "text-ink hover:bg-cream",
              ].join(" ")}
              style={active ? { background: accent.bg, color: accent.text } : undefined}
            >
              {name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ComboCard({
  combo,
  comboIndex,
  selectedTierName,
  onViewDetails,
}: {
  combo: Combo;
  comboIndex: number;
  selectedTierName: string;
  onViewDetails: () => void;
}) {
  const tiers = combo.priceTiers;
  const selectedTier = tiers.find((t) => t.name === selectedTierName) ?? tiers[0];
  const includedIds = selectedTier ? selectedTier.includes : combo.includes;
  const extraChips = selectedTier ? selectedTier.extras : [];

  return (
    <Card featured={combo.popular} flush className="flex h-full flex-col">
      {combo.popular && <CornerOrnaments />}

      <div className="relative">
        {/* DUMMY photo of this package - see src/data/services.ts */}
        <PlaceholderPhoto
          index={comboIndex}
          src={combo.image}
          alt={combo.name}
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
          className="aspect-2/1 w-full"
        />
        {combo.popular && (
          <>
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-obsidian/60 to-transparent"
              aria-hidden="true"
            />
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1.5 type-caption text-base whitespace-nowrap text-obsidian shadow-soft">
              {ui.mostPopular}
            </span>
          </>
        )}
      </div>

      <div className="flex grow flex-col p-5 sm:p-6">
        <h3 className="type-title text-xl leading-tight break-words text-charcoal sm:text-2xl">
          {combo.name}
        </h3>

        <p className="mt-2 line-clamp-3 text-base break-words text-muted">
          {combo.blurb}
        </p>

        {/* The bundled services as plain chips — which services show here
            depends on the Bronze/Silver/Gold tier selected at the top of
            the section, since each tier can cover a different slice of
            the combo's full service list. Extras are tier-specific
            add-ons (e.g. "Tour Photography") that aren't part of the
            site's main service catalog, so they're kept visually distinct
            with a gold tint. The full photo/description/price listing for
            each service lives on the package's own page (via "View
            Package Details" below) rather than here, so the card stays a
            quick-scan summary. */}
        <ul className="mt-4 flex flex-wrap gap-1.5">
          {includedIds.map((id) => (
            <li
              key={id}
              className="rounded-full bg-cream/70 px-3 py-1 text-base text-ink"
            >
              {serviceById[id].name}
            </li>
          ))}
          {extraChips.map((label) => (
            <li
              key={label}
              className="rounded-full bg-gold/15 px-3 py-1 text-base font-semibold text-gold-deep"
            >
              {label}
            </li>
          ))}
        </ul>

        <div className="mt-auto border-t border-cream-dark pt-4">
          {/* DUMMY PRICE - see src/data/services.ts */}
          <p className="type-price text-3xl text-charcoal">
            {selectedTier ? selectedTier.price : combo.price}
          </p>

          <div className="mt-4 flex flex-col gap-2.5">
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
              variant="secondary"
              size="md"
              fullWidth
              onClick={onViewDetails}
            >
              <span className="sm:hidden">{ui.viewPackShort}</span>
              <span className="hidden sm:inline">{ui.viewPackLong}</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

export function Combos() {
  /* One shared tier selection for the whole section. Tier names are the
     same set (Bronze/Silver/Gold) across every combo that has tiers, so
     the first combo that carries any is used to build the switcher. */
  const tierNames = combos.find((c) => c.priceTiers.length > 0)?.priceTiers.map((t) => t.name) ?? [];
  const [selectedTierName, setSelectedTierName] = useState(tierNames[0] ?? "");

  return (
    <section
      id="packages"
      className="relative scroll-mt-20 overflow-hidden bg-cream py-[clamp(3.5rem,9vw,6rem)]"
    >

      <div className="relative mx-auto max-w-6xl px-5 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow={ui.combosEyebrow}
            title={ui.combosTitle}
            subtitle={ui.combosSubtitle}
          />
        </Reveal>

        <Reveal className="mt-8">
          <TierSwitcher tierNames={tierNames} selected={selectedTierName} onSelect={setSelectedTierName} />
        </Reveal>

        <Reveal as="ul" stagger={0.1} className="mt-8 grid grid-cols-1 gap-6 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3">
          {combos.map((combo, comboIndex) => (
            <li key={combo.id} className="h-full">
              <ComboCard
                combo={combo}
                comboIndex={comboIndex}
                selectedTierName={selectedTierName}
                onViewDetails={() => navigate(packagePathFor(combo.id, selectedTierName))}
              />
            </li>
          ))}
        </Reveal>

        <Reveal>
          <p className="mt-10 text-center text-base text-muted">{ui.combosFootnote}</p>
        </Reveal>
      </div>
    </section>
  );
}
