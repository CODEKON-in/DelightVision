
import {
  categories as categoryCatalog,
  gallery as galleryData,
  getLocalizedText,
  packages as packageCatalog,
  services as serviceCatalog,
  type Category as ContentCategory,
  type GalleryItem as ContentGalleryItem,
  type Highlight as ContentHighlight,
  type MaterialItem as ContentMaterialItem,
  type MaterialPriceExample as ContentMaterialPriceExample,
  type MaterialPriceStructure as ContentMaterialPriceStructure,
  type MaterialPriceTier as ContentMaterialPriceTier,
  type ComboPriceTier as ContentComboPriceTier,
  type Service as ContentService,
  type Showcase as ContentShowcase,
  type ShowcaseItem as ContentShowcaseItem,
  type ShowcaseSpec as ContentShowcaseSpec,
  type ShowcaseType as ContentShowcaseType,
  type Combo as ContentPackage,
} from "../content";
import { formatPrice, formatPriceAmount } from "../utils/formatPrice";

export type ServiceId =
  | "decoration"
  | "food"
  | "photography"
  | "videography"
  | "album"
  | "video-editing"
  | "photo-editing";

export type CategoryId =
  | "photo-video"
  | "decor-venue"
  | "food-catering"
  | "editing-design";

export type Highlight = { label: string; value: string; level: number };

/* ---- Decorations showcase -----------------------------------------------
   The flattened, English view of a service's optional `showcase` block.
   Every text field is a plain string and the price is already formatted, so
   the components stay free of content plumbing. Fields the content does not
   carry come through empty and the UI simply omits them — nothing is filled
   in on the content's behalf. */
export type DecorationSpec = { label: string; value: string };

export type Decoration = {
  id: string;
  name: string;
  /* The decoration type this design belongs to, carried on the design so a
     detail view can name it without the caller passing it down. */
  typeId: string;
  typeName: string;
  description: string;
  images: string[];
  /* Formatted, or "" when the content states no price for this design. */
  price: string;
  includes: string[];
  suitableFor: string[];
  tags: string[];
  style: string;
  specifications: DecorationSpec[];
};

export type DecorationType = {
  id: string;
  name: string;
  description: string;
  /* Falls back to the first image of the first design, so a type that has
     designs always has something to show. */
  image: string;
  items: Decoration[];
};

export type Showcase = { intro: string; types: DecorationType[] };

/* A single material/product a service is built from, priced on its own —
   e.g. plastic vs. natural flowers for decoration. */
export type Material = {
  id: string;
  name: string;
  image: string;
  /* Full formatted price WITH its unit ("₹60/sq ft") — shown in the detail
     popup. Formatted, or "" when the content states no price. */
  price: string;
  /* Bare number only ("₹60"), no unit — shown in the listing row. */
  priceValue: string;
  note: string;
  /* Longer paragraph for the detail popup — "" when the content carries
     none, in which case the popup just shows the short note instead. */
  details: string;
  tag: string;
  /* A couple of quick facts — "Best for", "Care", "Colours" — shown under
     the note. Empty when the content carries none. */
  specs: DecorationSpec[];
  /* Fuller pricing picture for the detail popup — volume tiers, minimum
     order, extra charges, worked examples. Every array empty and every
     string "" when the content carries none, so the popup just omits the
     section entirely. */
  priceStructure: MaterialPriceStructureDisplay;
};

export type MaterialPriceTier = { range: string; price: string; quantity: string };
export type MaterialPriceExample = { label: string; amount: string };

export type MaterialPriceStructureDisplay = {
  minimumOrder: string;
  extraCharges: string[];
  tiers: MaterialPriceTier[];
  examples: MaterialPriceExample[];
};

export type Service = {
  id: ServiceId;
  name: string;
  category: CategoryId;
  description: string;
  price: string;
  image: string;
  detail: {
    badge: string;
    subtitle: string;
    about: string;
    highlights: Highlight[];
    tags: string[];
    includes: string[];
    notice: string;
    conditions: string;
  };
  showcase?: Showcase;
  materials: Material[];
};

export type ComboPriceTier = {
  name: string;
  blurb: string;
  price: string;
  about: string;
  /* Which services this tier covers — falls back to the combo's own full
     service list when the tier's content doesn't specify one. */
  includes: ServiceId[];
  /* Extra chip labels for this tier beyond the resolved services — for
     something combo-specific that isn't in the site's main service
     catalog, e.g. "Tour Photography". */
  extras: string[];
};

export type Combo = {
  id: string;
  name: string;
  blurb: string;
  includes: ServiceId[];
  price: string;
  popular?: boolean;
  image: string;
  detail: {
    badge: string;
    subtitle: string;
    about: string;
    highlights: Highlight[];
    notice: string;
    conditions: string;
  };
  priceTiers: ComboPriceTier[];
};

export type GalleryItem = {
  id: number;
  category: CategoryId;
  caption: string;
  badge: string;
  description: string;
  tags: string[];
  image: string;
  service: ServiceId;
};

const normalizeHighlights = (items: ContentHighlight[] = []): Highlight[] =>
  items.map((item) => ({
    label: getLocalizedText(item.label, "en"),
    value: getLocalizedText(item.value, "en"),
    level: item.level,
  }));

const normalizeTextArray = (items: Array<string | { en?: string; ta?: string }> = []): string[] =>
  items.map((item) => (typeof item === "string" ? item : getLocalizedText(item, "en")));

const normalizeCategory = (category: ContentCategory): { id: CategoryId; label: string; short: string } => ({
  id: category.id as CategoryId,
  label: getLocalizedText(category.label, "en"),
  short: getLocalizedText(category.shortLabel ?? category.label, "en"),
});

const normalizeSpecs = (items: ContentShowcaseSpec[] = []): DecorationSpec[] =>
  items
    .map((item) => ({
      label: getLocalizedText(item.label, "en"),
      value: getLocalizedText(item.value, "en"),
    }))
    /* A half-filled row would print a label with nothing beside it. */
    .filter((spec) => spec.label !== "" && spec.value !== "");

const normalizeDecoration = (
  item: ContentShowcaseItem,
  type: ContentShowcaseType
): Decoration => ({
  id: item.id,
  name: getLocalizedText(item.name, "en"),
  typeId: type.id,
  typeName: getLocalizedText(type.name, "en"),
  description: getLocalizedText(item.description, "en"),
  /* Blank entries would render as an empty thumbnail strip. */
  images: (item.images ?? []).filter(Boolean),
  price: item.pricing ? formatPrice(item.pricing, "en") : "",
  includes: normalizeTextArray(item.includes),
  suitableFor: normalizeTextArray(item.suitableFor),
  tags: normalizeTextArray(item.tags),
  style: getLocalizedText(item.style, "en"),
  specifications: normalizeSpecs(item.specifications),
});

const normalizeShowcase = (showcase?: ContentShowcase): Showcase | undefined => {
  if (!showcase || !Array.isArray(showcase.types) || showcase.types.length === 0) {
    return undefined;
  }

  const types: DecorationType[] = showcase.types.map((type) => {
    const items = (type.items ?? []).map((item) => normalizeDecoration(item, type));

    return {
      id: type.id,
      name: getLocalizedText(type.name, "en"),
      description: getLocalizedText(type.description, "en"),
      image: type.image || items[0]?.images[0] || "",
      items,
    };
  });

  /* A type with no name has nothing to put in the menu. */
  const named = types.filter((type) => type.name !== "");
  if (named.length === 0) return undefined;

  return { intro: getLocalizedText(showcase.intro, "en"), types: named };
};

const normalizeTiers = (items: ContentMaterialPriceTier[] = []): MaterialPriceTier[] =>
  items
    .map((item) => ({
      range: getLocalizedText(item.range, "en"),
      price: getLocalizedText(item.price, "en"),
      quantity: getLocalizedText(item.quantity, "en"),
    }))
    .filter((tier) => tier.range !== "" && tier.price !== "");

const normalizeExamples = (items: ContentMaterialPriceExample[] = []): MaterialPriceExample[] =>
  items
    .map((item) => ({
      label: getLocalizedText(item.label, "en"),
      amount: getLocalizedText(item.amount, "en"),
    }))
    .filter((example) => example.label !== "" && example.amount !== "");

const normalizeComboPriceTiers = (
  items: ContentComboPriceTier[] = [],
  fallbackServices: ServiceId[] = []
): ComboPriceTier[] =>
  items
    .map((item) => ({
      name: getLocalizedText(item.name, "en"),
      blurb: getLocalizedText(item.blurb, "en"),
      price: getLocalizedText(item.price, "en"),
      about: getLocalizedText(item.about, "en"),
      includes: (item.services as ServiceId[] | undefined) ?? fallbackServices,
      extras: (item.extras ?? []).map((extra) => getLocalizedText(extra, "en")).filter(Boolean),
    }))
    .filter((tier) => tier.name !== "" && tier.price !== "");

const normalizePriceStructure = (structure?: ContentMaterialPriceStructure): MaterialPriceStructureDisplay => ({
  minimumOrder: getLocalizedText(structure?.minimumOrder, "en"),
  extraCharges: (structure?.extraCharges ?? []).map((charge) => getLocalizedText(charge, "en")).filter(Boolean),
  tiers: normalizeTiers(structure?.tiers),
  examples: normalizeExamples(structure?.examples),
});

const normalizeMaterials = (items: ContentMaterialItem[] = []): Material[] =>
  items
    .map((item) => ({
      id: item.id,
      name: getLocalizedText(item.name, "en"),
      image: item.image ?? "",
      price: item.pricing ? formatPrice(item.pricing, "en") : "",
      priceValue: item.pricing ? formatPriceAmount(item.pricing, "en") : "",
      note: getLocalizedText(item.note, "en"),
      details: getLocalizedText(item.details, "en"),
      tag: getLocalizedText(item.tag, "en"),
      specs: normalizeSpecs(item.specs),
      priceStructure: normalizePriceStructure(item.priceStructure),
    }))
    /* A nameless entry has nothing to show in the grid. */
    .filter((material) => material.name !== "");

export const categories = categoryCatalog.map(normalizeCategory);

export const services: Service[] = serviceCatalog.map((service: ContentService) => ({
  id: service.id as ServiceId,
  name: getLocalizedText(service.name, "en"),
  category: service.category as CategoryId,
  description: getLocalizedText(service.description, "en"),
  price: formatPrice(service.pricing, "en"),
  image: service.image,
  detail: {
    badge: getLocalizedText(service.detail.badge, "en"),
    subtitle: getLocalizedText(service.detail.subtitle, "en"),
    about: getLocalizedText(service.detail.about, "en"),
    highlights: normalizeHighlights(service.detail.highlights),
    tags: normalizeTextArray(service.detail.tags),
    includes: normalizeTextArray(service.detail.includes),
    notice: getLocalizedText(service.detail.notice, "en"),
    conditions: getLocalizedText(service.detail.conditions, "en"),
  },
  showcase: normalizeShowcase(service.showcase),
  materials: normalizeMaterials(service.materials),
}));

export const serviceById = Object.fromEntries(
  services.map((service) => [service.id, service])
) as Record<ServiceId, Service>;

export const combos: Combo[] = packageCatalog.map((combo: ContentPackage) => ({
  id: combo.id,
  name: getLocalizedText(combo.name, "en"),
  blurb: getLocalizedText(combo.blurb, "en"),
  includes: combo.services as ServiceId[],
  price: formatPrice(combo.pricing, "en"),
  popular: combo.popular,
  image: combo.image,
  detail: {
    badge: getLocalizedText(combo.detail.badge, "en"),
    subtitle: getLocalizedText(combo.detail.subtitle, "en"),
    about: getLocalizedText(combo.detail.about, "en"),
    highlights: normalizeHighlights(combo.detail.highlights),
    notice: getLocalizedText(combo.detail.notice, "en"),
    conditions: getLocalizedText(combo.detail.conditions, "en"),
  },
  priceTiers: normalizeComboPriceTiers(combo.priceTiers, combo.services as ServiceId[]),
}));

export const galleryItems: GalleryItem[] = galleryData.map((item: ContentGalleryItem) => ({
  id: item.id,
  category: item.category as CategoryId,
  caption: getLocalizedText(item.caption, "en"),
  badge: getLocalizedText(item.badge, "en"),
  description: getLocalizedText(item.description, "en"),
  tags: normalizeTextArray(item.tags),
  image: item.image,
  service: item.serviceId as ServiceId,
}));
