import { PlaceholderPhoto } from "./PlaceholderPhoto";
import { serviceById, type Combo, type ComboPriceTier } from "../data/services";

/* Bronze / Silver / Gold get their own accent colour on the tier badge —
   the same colours the shared toggle on the Combo Packages section uses,
   so a tier reads the same way wherever it shows up on the site. */
const TIER_ACCENTS: Record<string, { bg: string; text: string }> = {
  Bronze: { bg: "#a9713f", text: "#fff7ec" },
  Silver: { bg: "#93938d", text: "#fff" },
  Gold: { bg: "#d4af37", text: "#2a1f08" },
};

function tierAccent(name: string) {
  return TIER_ACCENTS[name] ?? { bg: "#3a3632", text: "#fff" };
}

type Props = {
  combo: Combo;
  tier: ComboPriceTier;
  /* Picks the fallback tile palette if the photo is missing or fails */
  index: number;
};

/* One row of a package's Bronze/Silver/Gold breakdown, in the same
   product-listing pattern the Decorations page uses for its materials —
   a photo on the left, name/blurb/services/price stacked on the right.
   No per-tier action buttons here; the page's own Call/WhatsApp buttons
   further down cover enquiries for whichever tier a visitor is after. */
export function ComboTierCard({ combo, tier, index }: Props) {
  const accent = tierAccent(tier.name);

  return (
    <div className="flex gap-4 py-5 sm:gap-6 sm:py-6">
      <div className="relative shrink-0">
        {/* DUMMY photo — reuses the combo's own photo, see src/data/services.ts */}
        <PlaceholderPhoto
          index={index}
          src={combo.image || undefined}
          alt={`${combo.name} — ${tier.name}`}
          sizes="(min-width: 640px) 176px, 128px"
          className="size-32 rounded-xl sm:size-44"
        />
        <span
          className="absolute top-2 left-2 rounded-md px-2 py-1 text-[0.7rem] font-bold tracking-wide uppercase shadow-soft sm:text-xs"
          style={{ background: accent.bg, color: accent.text }}
        >
          {tier.name}
        </span>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <h3 className="text-lg leading-snug font-semibold text-charcoal sm:text-2xl">
          {tier.name}
        </h3>

        {tier.blurb && (
          <p className="mt-1.5 text-sm leading-snug text-muted sm:mt-2 sm:text-lg">
            {tier.blurb}
          </p>
        )}

        {(tier.includes.length > 0 || tier.extras.length > 0) && (
          <ul className="mt-2 flex flex-col gap-0.5 list-disc pl-5 text-sm text-ink marker:text-gold sm:mt-3 sm:text-base">
            {tier.includes.map((id) => (
              <li key={id}>{serviceById[id].name}</li>
            ))}
            {tier.extras.map((label) => (
              <li key={label} className="font-semibold text-gold-deep">
                {label}
              </li>
            ))}
          </ul>
        )}

        {tier.price && (
          <p className="nums-lining mt-2.5 text-2xl leading-none font-bold text-charcoal sm:mt-4 sm:text-4xl">
            {tier.price}
          </p>
        )}
      </div>
    </div>
  );
}
