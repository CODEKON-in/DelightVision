import categoriesData from "../../content/categories.json";
import companyData from "../../content/company.json";
import galleryData from "../../content/gallery.json";
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

export type CategoryId = "photo-video" | "decor-venue" | "food-catering" | "editing-design";
export type ServiceId = "decoration" | "food" | "photography" | "videography" | "album" | "video-editing" | "photo-editing";

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

/* Optional showcase block.

   The Decorations area of the Services section is driven by this. It hangs
   off the service it belongs to, so it travels with `content/services.json`
   — the file the content manager already reads, writes and publishes — and
   no second content source is introduced. Every field is optional, so a
   service without a showcase (all six of the others today) is unchanged,
   and a showcase entry only renders the fields it actually carries. */
export type ShowcaseSpec = {
  label: LocalizedText;
  value: LocalizedText;
};

export type ShowcaseItem = {
  id: string;
  name: LocalizedText;
  description?: LocalizedText;
  /* First image leads the card and the detail view; the rest become
     thumbnails inside the detail view. */
  images?: string[];
  pricing?: PriceInfo;
  includes?: LocalizedText[];
  suitableFor?: LocalizedText[];
  tags?: LocalizedText[];
  style?: LocalizedText;
  specifications?: ShowcaseSpec[];
};

export type ShowcaseType = {
  id: string;
  name: LocalizedText;
  description?: LocalizedText;
  image?: string;
  items?: ShowcaseItem[];
};

export type Showcase = {
  intro?: LocalizedText;
  types: ShowcaseType[];
};

/* Optional materials block — a small product-style catalogue of the raw
   materials a service is built from (e.g. plastic vs. fresh flowers for
   decoration), each with its own price. Hangs off the service the same way
   `showcase` does, so it travels with `content/services.json` and only
   renders where the content actually carries it. */
export type MaterialItem = {
  id: string;
  name: LocalizedText;
  /* DUMMY photo — falls back to the painted tile when absent */
  image?: string;
  pricing: PriceInfo;
  note?: LocalizedText;
  /* Longer paragraph shown in the "View Details" popup, beyond the short
     row-level note — what it's made of, how it behaves, why you'd pick it. */
  details?: LocalizedText;
  /* Small badge on the photo, e.g. "Most Popular" or "Budget Pick" */
  tag?: LocalizedText;
  /* A couple of quick label/value facts shown under the note — "Best for",
     "Care", "Colours", that kind of thing. Same shape as a showcase
     design's specifications, reused rather than duplicated. */
  specs?: ShowcaseSpec[];
  /* Optional fuller pricing picture beyond the single `pricing` rate —
     volume tiers, a minimum order, extra charges, and a couple of
     worked examples so a customer can picture a real total. Shown in the
     material's detail popup; a material with none of these just shows
     its plain `pricing` rate as today. */
  priceStructure?: MaterialPriceStructure;
};

export type MaterialPriceTier = {
  /* e.g. "Small — entrance or one photo corner" */
  range: LocalizedText;
  /* e.g. "₹3,000" — a formatted string, not a PriceInfo, since a tier
     is a display row rather than something formatPrice() needs to build. */
  price: LocalizedText;
  /* Optional real-world quantity the flat price covers, in an easy metric
     unit — e.g. "≈ 5 m²" or "≈ 15 m" or "≈ 2 kg" — so a size name like
     "Small" is backed by something concrete rather than a guess. */
  quantity?: LocalizedText;
};

export type MaterialPriceExample = {
  /* e.g. "Photo backdrop (100 sq ft)" */
  label: LocalizedText;
  /* e.g. "≈ ₹6,000" */
  amount: LocalizedText;
};

export type MaterialPriceStructure = {
  /* e.g. "50 sq ft" */
  minimumOrder?: LocalizedText;
  /* e.g. ["Setup & removal: ₹500 flat", "Rush order (under 48 hrs): +10%"] */
  extraCharges?: LocalizedText[];
  tiers?: MaterialPriceTier[];
  examples?: MaterialPriceExample[];
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
  showcase?: Showcase;
  materials?: MaterialItem[];
};

/* A Bronze/Silver/Gold pricing choice within one combo — the combo itself
   stays a single card in the Combo Packages grid, and its own detail
   dialog is where a customer picks which of the three to go with. */
export type ComboPriceTier = {
  /* "Bronze" / "Silver" / "Gold" */
  name: LocalizedText;
  /* One-line summary of what's different at this tier, shown on its card */
  blurb: LocalizedText;
  /* e.g. "₹85,000" — a formatted string, like a material's price tier */
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
};

export type GalleryItem = {
  id: number;
  category: CategoryId;
  caption: LocalizedText;
  badge: LocalizedText;
  description: LocalizedText;
  tags: LocalizedText[];
  image: string;
  serviceId: ServiceId;
};

export type CompanyInfo = {
  name: LocalizedText;
  tagline: LocalizedText;
  description: LocalizedText;
  phone: string;
  phoneDial: string;
  whatsapp: string;
  email: string;
  address: string;
  instagram: string;
  hours: string;
  mapQuery: string;
};

export function getLocalizedText(value: LocalizedText | undefined, language: Language = "en"): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return value[language] || value.en || Object.values(value)[0] || "";
}

export const categories = categoriesData as Category[];
export const services = servicesData as Service[];
export const packages = packagesData as Combo[];
export const gallery = galleryData as GalleryItem[];
export const company = companyData as CompanyInfo;

export const serviceById = Object.fromEntries(
  services.map((service) => [service.id, service])
) as Record<string, Service>;

export const categoryById = Object.fromEntries(
  categories.map((category) => [category.id, category])
) as Record<string, Category>;

export const galleryItems = gallery;
export const combos = packages;

export const serviceIds = services.map((service) => service.id);

export { default as categoriesData } from "../../content/categories.json";
export { default as companyData } from "../../content/company.json";
export { default as galleryData } from "../../content/gallery.json";
export { default as packagesData } from "../../content/packages.json";
export { default as servicesData } from "../../content/services.json";
