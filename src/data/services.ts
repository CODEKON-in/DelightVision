
import {
  categories as categoryCatalog,
  getLocalizedText,
  packages as packageCatalog,
  services as serviceCatalog,
  type Category as ContentCategory,
  type ComboPriceTier as ContentComboPriceTier,
  type Combo as ContentPackage,
  type DecorationDesign as ContentDecorationDesign,
  type DesignDetail as ContentDesignDetail,
  type ComplimentaryItem as ContentComplimentaryItem,
  type DesignPricingEntry as ContentDesignPricingEntry,
  type Highlight as ContentHighlight,
  type Service as ContentService,
  type SubService as ContentSubService,
} from "../content";
import { formatPrice } from "../utils/formatPrice";

/* Service ids come from the content, so this is a plain string rather than
   a closed union: the four top-level services ("decoration", "food",
   "photography-videography", "tour-planning-organizing") and the individual
   services inside them (e.g. "candid-photography"), which packages refer to
   in exactly the same way. */
export type ServiceId = string;

export type CategoryId = "photo-video" | "decor-venue" | "food-catering" | "tours-travel";

export type Highlight = { label: string; value: string; level: number };

/* ---- Decoration designs --------------------------------------------------
   The flattened, English view of a decoration design. Text fields are plain
   strings and prices arrive formatted, so components stay free of content
   plumbing. Anything the content leaves out comes through empty and the UI
   omits it — nothing is filled in on the content's behalf. */
export type DetailRow = { label: string; value: string };

/* One pricing line, ready to print. Rendered in order, whatever its label. */
export type DesignPrice = { label: string; price: string };

export type DecorationDesign = {
  id: string;
  image: string;
  /* "" when the design has no title — the photograph identifies it. */
  title: string;
  badge: string;
  pricing: DesignPrice[];
  /* The first pricing line's amount, e.g. "₹15,000" — "" if unpriced. */
  basePrice: string;
  description: string;
  customization: string;
  details: DetailRow[];
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
  designs: DecorationDesign[];
  /* The individual services this service is made up of — Candid
     Photography, Album Design and so on inside Photography & Videography.
     Each is an ordinary Service in its own right, so the same card and the
     same details dialog render it, and a package can refer to it by id.
     Empty for a service that is a single thing. */
  subServices: Service[];
  /* A service priced as generic label/price lines rather than one rate —
     the individual services use this, exactly as the decoration designs do.
     `price` holds the first line. */
  priceLines: DesignPrice[];
};

/* A package's complimentary item, flattened for display. */
export type ComplimentaryItem = { label: string; description: string };

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
  /* The decoration designs this tier offers, looked up from the decoration
     service's designs by the content's `decorationIds`, in that order. Empty
     when the tier includes no decoration or names no design that exists —
     its Decoration card then opens the service's own details instead. */
  decorations: DecorationDesign[];
  /* What this tier throws in beyond its services — the combo's own list
     unless the tier names a different one. Empty when there is nothing. */
  complimentaryItems: ComplimentaryItem[];
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
  /* As on a tier — used by a combo that has no tiers. */
  decorations: DecorationDesign[];
  complimentaryItems: ComplimentaryItem[];
};

const normalizeHighlights = (items: ContentHighlight[] = []): Highlight[] =>
  items.map((item) => ({
    label: getLocalizedText(item.label, "en"),
    value: getLocalizedText(item.value, "en"),
    level: item.level,
  }));

const normalizeTextArray = (items: Array<string | { en?: string; ta?: string }> = []): string[] =>
  items.map((item) => (typeof item === "string" ? item : getLocalizedText(item, "en")));

const normalizeCategory = (category: ContentCategory): { id: CategoryId; label: string } => ({
  id: category.id as CategoryId,
  label: getLocalizedText(category.label, "en"),
});

/* Each individual service becomes a Service of its own, so everything that
   renders a service — the card, the details dialog, a package's service list
   — works on it unchanged. It inherits its parent's category, and its
   description doubles as its "About this service" text. An entry without a
   name has nothing to show, and one without an id of its own is given a slug
   of its name so a package can still point at it. */
const slug = (text: string): string =>
  text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const normalizeSubServices = (
  items: ContentSubService[] = [],
  parent: ContentService
): Service[] =>
  items
    .map((item) => {
      const name = getLocalizedText(item.name, "en");
      const description = getLocalizedText(item.description, "en");
      const priceLines = normalizePriceLines(item.pricing);

      return {
        id: item.id || slug(name),
        name,
        category: parent.category as CategoryId,
        description,
        price: priceLines[0]?.price ?? "",
        priceLines,
        image: item.image ?? "",
        detail: {
          badge: "",
          subtitle: "",
          about: description,
          highlights: [],
          tags: [],
          includes: [],
          notice: "",
          conditions: "",
        },
        designs: [],
        subServices: [],
      };
    })
    .filter((item) => item.name !== "");

const normalizeDetails = (items: ContentDesignDetail[] = []): DetailRow[] =>
  items
    .map((item) => ({
      label: getLocalizedText(item.label, "en"),
      value: getLocalizedText(item.value, "en"),
    }))
    /* A half-filled row would print a label with nothing beside it. */
    .filter((row) => row.label !== "" && row.value !== "");

/* Generic label/price lines, shared by the decoration designs and the
   individual services. A line is shown as a plain amount — these prices are
   fixed, so nothing is prefixed with "Starting". Lines without a label or a
   usable number are dropped rather than printed half-empty. */
const normalizePriceLines = (entries: ContentDesignPricingEntry[] = []): DesignPrice[] =>
  entries
    .filter((entry) => Number.isFinite(entry.price))
    .map((entry) => ({
      label: getLocalizedText(entry.label, "en"),
      price: formatPrice({ type: "fixed", amount: entry.price }, "en"),
    }))
    .filter((entry) => entry.label !== "");


const normalizeDesigns = (items: ContentDecorationDesign[] = []): DecorationDesign[] =>
  items
    .map((item) => {
      const pricing = normalizePriceLines(item.pricing);

      return {
        id: item.id,
        image: item.image ?? "",
        title: getLocalizedText(item.title, "en"),
        badge: getLocalizedText(item.badge, "en"),
        pricing,
        basePrice: pricing[0]?.price ?? "",
        description: getLocalizedText(item.description, "en"),
        customization: getLocalizedText(item.customization, "en"),
        details: normalizeDetails(item.details),
      };
    })
    /* The photograph is the design, so an entry without one has nothing to
       show in the grid. */
    .filter((design) => design.image !== "");

/* A package points at its decoration designs by id; this turns the ids back
   into the designs themselves. A reference that cannot be followed is left
   out so the page still renders, and says why in development so a typo in
   the content is not silently swallowed. */
const warnInDev = (message: string) => {
  if (import.meta.env.DEV) console.warn(`[packages] ${message}`);
};

const resolveDecorations = (
  decorationIds: string[] | undefined,
  includes: ServiceId[],
  owner: string
): DecorationDesign[] => {
  const ids = decorationIds ?? [];
  const includesDesigns = includes.some((id) => (serviceById[id]?.designs.length ?? 0) > 0);

  if (!includesDesigns) {
    if (ids.length > 0) warnInDev(`${owner} names decoration designs (${ids.join(", ")}) but does not include the decoration service, so they are not shown.`);
    return [];
  }

  const designs = ids.flatMap((id) => {
    const design = decorationDesignById[id];
    if (!design) warnInDev(`${owner} names decoration design "${id}", which is not among the decoration designs in content/services.json (or has no image), so it is left out.`);
    return design ? [design] : [];
  });

  if (designs.length === 0) {
    warnInDev(`${owner} includes decoration but has no decoration designs to show (decorationIds); its Decoration card opens the service details instead.`);
  }
  return designs;
};

/* An item without a label has nothing to show. The description is
   optional — some items need no explaining. */
const normalizeComplimentaryItems = (
  items: ContentComplimentaryItem[] = []
): ComplimentaryItem[] =>
  items
    .map((item) => ({
      label: getLocalizedText(item.label, "en"),
      description: getLocalizedText(item.description, "en"),
    }))
    .filter((item) => item.label !== "");

const normalizeComboPriceTiers = (
  items: ContentComboPriceTier[] = [],
  combo: ContentPackage
): ComboPriceTier[] =>
  items
    .map((item) => {
      const name = getLocalizedText(item.name, "en");
      const includes = (item.services as ServiceId[] | undefined) ?? (combo.services as ServiceId[]);
      return {
        name,
        blurb: getLocalizedText(item.blurb, "en"),
        price: getLocalizedText(item.price, "en"),
        about: getLocalizedText(item.about, "en"),
        includes,
        extras: (item.extras ?? []).map((extra) => getLocalizedText(extra, "en")).filter(Boolean),
        decorations: resolveDecorations(
          item.decorationIds ?? combo.decorationIds,
          includes,
          `Package "${combo.id}", tier "${name}",`
        ),
        complimentaryItems: normalizeComplimentaryItems(
          item.complimentaryItems ?? combo.complimentaryItems
        ),
      };
    })
    .filter((tier) => tier.name !== "" && tier.price !== "");

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
  designs: normalizeDesigns(service.designs),
  subServices: normalizeSubServices(service.subServices, service),
  /* A top-level service is priced by its own single rate, not by lines. */
  priceLines: [],
}));

/* Every service a package can name: the top-level ones and the individual
   services inside them, all in one lookup, so a package's plain list of ids
   resolves whichever kind it holds. */
export const serviceById: Record<ServiceId, Service> = Object.fromEntries(
  services.flatMap((service) => [
    [service.id, service] as const,
    ...service.subServices.map((sub) => [sub.id, sub] as const),
  ])
);

/* Every decoration design, in catalogue order — the one source packages
   look their designs up in. */
const decorationDesigns: DecorationDesign[] = services.flatMap((service) => service.designs);

const decorationDesignById: Record<string, DecorationDesign> = Object.fromEntries(
  decorationDesigns.map((design) => [design.id, design])
);

export const combos: Combo[] = packageCatalog.map((combo: ContentPackage) => {
  const priceTiers = normalizeComboPriceTiers(combo.priceTiers, combo);

  return {
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
    priceTiers,
    /* A combo with tiers resolves its design per tier; this is only for one
       without, so a reference is not checked (and warned about) twice. */
    decorations:
      priceTiers.length > 0
        ? []
        : resolveDecorations(combo.decorationIds, combo.services as ServiceId[], `Package "${combo.id}"`),
    complimentaryItems: normalizeComplimentaryItems(combo.complimentaryItems),
  };
});
