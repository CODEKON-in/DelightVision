import categoriesData from "../../content/categories.json";
import packagesData from "../../content/packages.json";
import servicesData from "../../content/services.json";

export type Language = "en" | "ta";

export type LocalizedText = Partial<Record<Language, string>> | string;

export type PriceInfo = {
  type?: string;
  amount?: number;
  currency?: string;
  unit?: string;
  label?: LocalizedText;
};

export type CategoryId = "photo-video" | "decor-venue" | "food-catering" | "tours-travel";
export type ServiceId = "decoration" | "food" | "photography-videography" | "tour-planning-organizing";

export type Category = {
  id: CategoryId;
  label: LocalizedText;
  shortLabel?: LocalizedText;
};

export type Highlight = {
  label: LocalizedText;
  value: LocalizedText;
  level: number;
};

/* A label/value line in a decoration design's Details section — "Suitable
   for", "Design elements", "Setup" and so on. Generic on purpose: the
   labels are content, not code, so the client can add or rename them. */
export type DesignDetail = {
  label: LocalizedText;
  value: LocalizedText;
};

/* One line of a decoration design's pricing: a label and an amount in
   rupees. The site renders whatever lines a design carries and never
   interprets a label — "Decoration Setup", "Natural Flowers", "Lighting"
   are all just text to it. The first line is the design's headline price.

   Kept flat so the CMA can edit it as a plain list:
   + Add price  →  Label ____  Price ____ */
export type DesignPricingEntry = {
  label: LocalizedText;
  price: number;
};

/* A decoration DESIGN — something the client shows a customer, adjusts
   lightly (colours, small changes) and then sets up at the event. Not a
   product. The photograph is the design's identity, so the title is
   optional and a design without one works everywhere. */
export type DecorationDesign = {
  id: string;
  image: string;
  title?: LocalizedText;
  /* Small badge over the photo, e.g. "Popular" */
  badge?: LocalizedText;
  pricing: DesignPricingEntry[];
  description?: LocalizedText;
  /* What can be changed without changing the price, e.g. colours */
  customization?: LocalizedText;
  details?: DesignDetail[];
};

/* One capability inside a top-level service — Photography, Album Design and
   so on inside Photography & Videography. Content, not code: the client adds,
   renames or removes them without touching the site. */
export type SubService = {
  name: LocalizedText;
  description: LocalizedText;
};

export type Service = {
  id: ServiceId;
  name: LocalizedText;
  category: CategoryId;
  description: LocalizedText;
  pricing: PriceInfo;
  image: string;
  detail: {
    badge: LocalizedText;
    subtitle: LocalizedText;
    about: LocalizedText;
    highlights: Highlight[];
    tags: LocalizedText[];
    includes: LocalizedText[];
    notice: LocalizedText;
    conditions: LocalizedText;
  };
  /* The decoration service's gallery of designs. Other services omit it. */
  designs?: DecorationDesign[];
  /* What the service is made up of, listed in its details dialog. Services
     that are a single thing omit it. */
  subServices?: SubService[];
};

/* A Bronze/Silver/Gold pricing choice within one combo — the combo itself
   stays a single card in the Combo Packages grid, and its own detail
   dialog is where a customer picks which of the three to go with. */
export type ComboPriceTier = {
  /* "Bronze" / "Silver" / "Gold" */
  name: LocalizedText;
  /* One-line summary of what's different at this tier, shown on its card */
  blurb: LocalizedText;
  /* e.g. "₹85,000" — already formatted, shown as written */
  price: LocalizedText;
  /* Fuller paragraph shown when the customer taps "View Details" on this
     specific tier */
  about?: LocalizedText;
  /* Which services this tier includes — lets Bronze/Silver/Gold cover a
     different slice of the combo's full service list (e.g. Bronze just
     the core services, Gold the complete set). Falls back to the combo's
     own `services` list when a tier doesn't specify its own. */
  services?: ServiceId[];
  /* Extra items shown as chips alongside the resolved services, for
     something specific to this combo/tier that isn't part of the site's
     main service catalog — e.g. "Tour Photography" (a pre-wedding couple
     shoot) added only at the higher tiers of a particular combo. */
  extras?: LocalizedText[];
  /* The decoration designs this tier offers — `id`s of the decoration
     service's `designs`, in display order, never copies of them, so each
     design's photo, pricing and details stay in one place. Only meaningful
     when the tier includes the decoration service. Falls back to the
     combo's own `decorationIds` when a tier doesn't name any. */
  decorationIds?: string[];
};

export type Combo = {
  id: string;
  name: LocalizedText;
  blurb: LocalizedText;
  services: ServiceId[];
  pricing: PriceInfo;
  popular?: boolean;
  image: string;
  detail: {
    badge: LocalizedText;
    subtitle: LocalizedText;
    about: LocalizedText;
    highlights: Highlight[];
    notice: LocalizedText;
    conditions: LocalizedText;
  };
  /* Optional Bronze/Silver/Gold pricing choice, shown in the combo's own
     detail dialog. A combo with none just shows its plain `pricing` rate
     as before. */
  priceTiers?: ComboPriceTier[];
  /* The decoration designs the combo offers, for a combo without tiers or
     as the default for tiers that don't name their own. */
  decorationIds?: string[];
};

export function getLocalizedText(value: LocalizedText | undefined, language: Language = "en"): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[language] || value.en || Object.values(value)[0] || "";
}

export const categories = categoriesData as Category[];
export const services = servicesData as Service[];
export const packages = packagesData as Combo[];
