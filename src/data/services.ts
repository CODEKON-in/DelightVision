
import {
  categories as categoryCatalog,
  gallery as galleryData,
  getLocalizedText,
  packages as packageCatalog,
  services as serviceCatalog,
  type Category as ContentCategory,
  type GalleryItem as ContentGalleryItem,
  type Highlight as ContentHighlight,
  type Service as ContentService,
  type Combo as ContentPackage,
} from "../content";
import { formatPrice } from "../utils/formatPrice";

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
