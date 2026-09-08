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
